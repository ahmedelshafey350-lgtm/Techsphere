import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1?target=deno";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
const codeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const imageTypes = new Map([
  [
    "image/jpeg",
    "jpg"
  ],
  [
    "image/png",
    "png"
  ],
  [
    "image/webp",
    "webp"
  ]
]);
const imageSearchStopWords = new Set([
  "and",
  "the",
  "for",
  "with",
  "using",
  "based",
  "system",
  "project",
  "design",
  "smart",
  "automatic",
  "automated",
  "digital",
  "control",
  "development",
  "implementation",
  "from",
  "via",
  "monitor",
  "monitoring",
  "analysis",
  "industrial",
  "engineering",
  "prototype",
  "model",
  "architecture",
  "closed",
  "loop",
  "axis",
  "robot",
  "robotic",
  "sensor",
  "metal",
  "detector",
  "cable",
  "fault",
  "fire",
  "suppression",
  "solar",
  "parallel",
  "serial",
  "register",
  "out"
]);
const imageSearchRejectedTitleTerms = new Set([
  "book",
  "ceremony",
  "conference",
  "cutting",
  "diagram",
  "drawing",
  "event",
  "golf",
  "historic",
  "launch",
  "logo",
  "laptop",
  "manual",
  "map",
  "museum",
  "opening",
  "politician",
  "poster",
  "report",
  "ribbon",
  "rights",
  "satellite",
  "schematic",
  "sign",
  "speaking",
  "thesis",
  "warning"
]);
const privateFileTypes = new Set([
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "text/plain",
  "text/markdown",
  "application/json",
  "application/octet-stream"
]);
const publicServiceCategorySlugs = new Set([
  "embedded-iot",
  "digital-logic",
  "electronics",
  "mechanical-design",
  "industrial-automation",
  "embedded-systems",
  "software-ai"
]);
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
function boundedText(value, min, max) {
  return typeof value === "string" && value.trim().length >= min && value.trim().length <= max;
}
function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
    }
  });
}
function databaseError(error, label) {
  console.error(`${label}:`, error.message);
  return jsonResponse({
    error: `تعذر تنفيذ ${label}.`
  }, 500);
}
async function authenticate(request, supabaseUrl, anonKey) {
  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  const token = authorization.slice("Bearer ".length);
  const userClient = createClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    global: {
      headers: {
        Authorization: authorization
      }
    }
  });
  const { data: { user }, error } = await userClient.auth.getUser(token);
  if (error || !user?.email) return null;
  const metadataName = user.user_metadata?.full_name;
  return {
    id: user.id,
    email: user.email,
    fullName: typeof metadataName === "string" && metadataName.trim() ? metadataName.trim() : user.email.split("@")[0]
  };
}
function isAdmin(session, configuredAdmins) {
  return Boolean(configuredAdmins) && configuredAdmins.split(",").map((email)=>email.trim().toLowerCase()).includes(session.email.toLowerCase());
}
function createActivationCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const parts = [
    0,
    4,
    8
  ].map((start)=>Array.from(bytes.slice(start, start + 4), (byte)=>codeAlphabet[byte % codeAlphabet.length]).join(""));
  return `TXH-${parts.join("-")}`;
}
// Codes are copied from an RTL page, forwarded through WhatsApp, or retyped with
// spaces and bidi marks. Collapse the value to its 15 meaningful characters before
// hashing so that a copy that looks identical always hashes to the same value.
const invisibleCodeCharacters = /[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g;
function normalizeActivationCode(value) {
  if (typeof value !== "string") return null;
  const compact = value.normalize("NFKC").replace(invisibleCodeCharacters, "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (compact.length !== 15 || !compact.startsWith("TXH")) return null;
  const body = compact.slice(3);
  if (!/^[A-Z2-9]{12}$/.test(body)) return null;
  return `TXH-${body.slice(0, 4)}-${body.slice(4, 8)}-${body.slice(8, 12)}`;
}
async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte)=>byte.toString(16).padStart(2, "0")).join("");
}
// Mirror of techsphere_service_project_redeem_code_v1/v2 in TypeScript. Only called after
// the activation code passed every validation the database function performs (unused, not
// revoked, not expired, order confirmed by code and owned by this customer, no active access)
// and only when the database function is missing or fails for a technical reason, so that a
// paid customer is never blocked by a database-side mismatch.
async function activateProjectAccessDirect(serviceClient, input) {
  const activation = new Date();
  const expiresAt = new Date(activation.getTime());
  expiresAt.setMonth(expiresAt.getMonth() + 3);
  const activatedAt = activation.toISOString();
  const expiresIso = expiresAt.toISOString();
  const { data: activeAccess, error: activeError } = await serviceClient.from("service_project_access").select("id, expires_at").eq("user_id", input.userId).eq("project_id", input.projectId).eq("status", "active").gt("expires_at", activatedAt).order("expires_at", {
    ascending: false
  }).limit(1).maybeSingle();
  if (activeError) {
    console.error("Unable to check the active project access:", activeError.message);
    return null;
  }
  if (activeAccess) {
    return {
      access_id: activeAccess.id,
      project_id: input.projectId,
      activated_at: activatedAt,
      expires_at: activeAccess.expires_at
    };
  }
  const { data: orderAccess, error: orderAccessError } = await serviceClient.from("service_project_access").select("id").eq("order_id", input.orderId).maybeSingle();
  if (orderAccessError) {
    console.error("Unable to read the order access:", orderAccessError.message);
    return null;
  }
  let accessId = orderAccess?.id ?? null;
  if (accessId) {
    const { error: reactivateError } = await serviceClient.from("service_project_access").update({
      user_id: input.userId,
      activation_code_id: input.codeId,
      activated_at: activatedAt,
      expires_at: expiresIso,
      status: "active",
      revoked_at: null,
      revoked_by: null,
      granted_by: input.grantedBy
    }).eq("id", accessId);
    if (reactivateError) {
      console.error("Unable to reactivate the order access:", reactivateError.message);
      return null;
    }
  } else {
    const { data: inserted, error: insertError } = await serviceClient.from("service_project_access").insert({
      user_id: input.userId,
      project_id: input.projectId,
      order_id: input.orderId,
      activation_code_id: input.codeId,
      activated_at: activatedAt,
      expires_at: expiresIso,
      granted_by: input.grantedBy
    }).select("id").maybeSingle();
    if (insertError || !inserted?.id) {
      console.error("Unable to create the project access:", insertError?.message);
      return null;
    }
    accessId = inserted.id;
  }
  const { error: markError } = await serviceClient.from("service_project_activation_codes").update({
    redeemed_by: input.userId,
    redeemed_at: activatedAt
  }).eq("id", input.codeId);
  if (markError) {
    console.error("Access activated but the code was not marked as redeemed:", markError.message);
  }
  return {
    access_id: accessId,
    project_id: input.projectId,
    activated_at: activatedAt,
    expires_at: expiresIso
  };
}
function safeFileName(value) {
  return value.replace(/[\\/\r\n"]/g, "_").slice(0, 180) || "project-file";
}
function contentDispositionFileName(value) {
  const fileName = safeFileName(value);
  const fallback = fileName.replace(/[^\x20-\x7E]/g, "_");
  const encoded = encodeURIComponent(fileName).replace(/['()*]/g, (character)=>`%${character.charCodeAt(0).toString(16).toUpperCase()}`);
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}
function safePathSegment(value) {
  const cleaned = value.normalize("NFKC").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned.slice(0, 100) || "file";
}
function plainWikimediaText(value) {
  if (typeof value !== "string") return "";
  return value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, "\"").replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/\s+/g, " ").trim().slice(0, 500);
}
function wikimediaMatchScore(projectTitle, fileTitle) {
  const projectTerms = [
    ...new Set(projectTitle.toLowerCase().match(/[a-z]+/g) || [])
  ].filter((term)=>term.length >= 3 && !imageSearchStopWords.has(term));
  const fileTerms = new Set(fileTitle.toLowerCase().match(/[a-z]+/g) || []);
  if ([
    ...imageSearchRejectedTitleTerms
  ].some((term)=>fileTerms.has(term))) return 0;
  const numberWords = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10
  };
  const bitWidths = (title)=>[
      ...title.matchAll(/\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten)[\s_-]*bits?\b/gi)
    ].map((match)=>Number(match[1]) || numberWords[match[1].toLowerCase()]);
  const projectBitWidths = bitWidths(projectTitle);
  if (projectBitWidths.some((width)=>!bitWidths(fileTitle).includes(width))) return 0;
  const fileNumbers = new Set(fileTitle.match(/\d+/g) || []);
  const requiredModelNumbers = projectTitle.match(/\b\d{3,}\b/g) || [];
  if (requiredModelNumbers.some((number)=>!fileNumbers.has(number))) return 0;
  const projectVoltageRanges = [
    ...projectTitle.matchAll(/\b(\d+)\s*[-–]\s*(\d+)\s*(?:v|volts?)\b/gi)
  ];
  const projectVoltages = projectVoltageRanges.map((range)=>range[2]).concat([
    ...projectTitle.matchAll(/\b(\d+)\s*(?:v|volts?)\b/gi)
  ].filter((match)=>!projectVoltageRanges.some((range)=>range.index === match.index)).map((match)=>match[1]));
  const normalizedFileTitle = fileTitle.toLowerCase().replace(/[\s_-]+/g, "");
  if (projectVoltages.some((voltage)=>!normalizedFileTitle.includes(`${voltage}v`) && !normalizedFileTitle.includes(`${voltage}volt`))) return 0;
  const requiredAcronyms = [
    ...new Set(projectTitle.match(/\b[A-Z]{2,}\b/g) || [])
  ].map((term)=>term.toLowerCase());
  if (requiredAcronyms.some((term)=>!fileTerms.has(term))) return 0;
  const flipFlopType = projectTitle.match(/\b([DJKTRS])[- ]+flip[- ]?flop\b/i)?.[1];
  if (flipFlopType && !fileTerms.has(flipFlopType.toLowerCase())) return 0;
  const matches = projectTerms.filter((term)=>fileTerms.has(term));
  return matches.length >= 2 ? matches.length : 0;
}
function isSupportedImage(bytes, contentType) {
  if (contentType === "image/jpeg") {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (contentType === "image/png") {
    return bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a;
  }
  return contentType === "image/webp" && bytes.length >= 12 && new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
}
async function readImageWithinLimit(response, maxBytes) {
  const contentLength = Number(response.headers.get("Content-Length"));
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw new Error("حجم الصورة يتجاوز الحد المسموح.");
  }
  if (!response.body) throw new Error("مصدر الصورة لم يُرجع ملفًا قابلًا للقراءة.");
  const reader = response.body.getReader();
  const chunks = [];
  let totalBytes = 0;
  while(true){
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.length;
    if (totalBytes > maxBytes) {
      await reader.cancel();
      throw new Error("حجم الصورة يتجاوز الحد المسموح.");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks){
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return bytes;
}
async function fetchWikimediaSearch(searchUrl) {
  let response = null;
  for(let attempt = 0; attempt < 4; attempt += 1){
    response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "TechsphereProjectImageResearch/1.0 (educational project catalog)"
      },
      signal: AbortSignal.timeout(20_000)
    });
    if (response.ok || response.status !== 429 && response.status < 500) return response;
    if (attempt < 3) {
      const retryAfterSeconds = Number(response.headers.get("Retry-After"));
      const delayMilliseconds = Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0 ? Math.min(retryAfterSeconds * 1000, 10_000) : (attempt + 1) * 1500;
      await new Promise((resolve)=>setTimeout(resolve, delayMilliseconds));
    }
  }
  if (!response) throw new Error("تعذر بدء البحث عن صورة في Wikimedia Commons.");
  return response;
}
async function importWikimediaProjectImage(serviceClient, project) {
  if (project.image_url) return {
    status: "skipped",
    reason: "image_already_set"
  };
  const queryTerms = [
    ...new Set([
      ...(project.title_en.toLowerCase().match(/[a-z]+/g) || []).filter((term)=>term.length >= 3 && !imageSearchStopWords.has(term)),
      ...(project.title_en.match(/\b[A-Z]{2,}\b/g) || []).map((term)=>term.toLowerCase())
    ])
  ];
  const queries = [
    ...new Set([
      queryTerms.slice(0, 3).join(" "),
      queryTerms.slice(-3).join(" ")
    ].filter(Boolean))
  ];
  const candidateMap = new Map();
  for (const query of queries){
    const searchUrl = new URL("https://commons.wikimedia.org/w/api.php");
    searchUrl.search = new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: query,
      gsrnamespace: "6",
      gsrlimit: "20",
      prop: "imageinfo",
      iiprop: "url|extmetadata",
      iiurlwidth: "1000",
      format: "json"
    }).toString();
    const searchResponse = await fetchWikimediaSearch(searchUrl);
    if (!searchResponse.ok) {
      throw new Error(`تعذر البحث عن صورة في Wikimedia Commons (${searchResponse.status}).`);
    }
    await new Promise((resolve)=>setTimeout(resolve, 300));
    const searchResult = await searchResponse.json();
    if (!isRecord(searchResult) || !isRecord(searchResult.query) || !isRecord(searchResult.query.pages)) {
      continue;
    }
    for (const page of Object.values(searchResult.query.pages).filter(isRecord)){
      const fileTitle = typeof page.title === "string" ? page.title : "";
      const info = Array.isArray(page.imageinfo) && isRecord(page.imageinfo[0]) ? page.imageinfo[0] : null;
      const metadata = info && isRecord(info.extmetadata) ? info.extmetadata : {};
      const license = plainWikimediaText(isRecord(metadata.LicenseShortName) ? metadata.LicenseShortName.value : "");
      const imageUrl = info && typeof info.thumburl === "string" ? info.thumburl : info && typeof info.url === "string" ? info.url : "";
      const sourceUrl = info && typeof info.descriptionurl === "string" ? info.descriptionurl : "";
      let imageHost = "";
      try {
        imageHost = new URL(imageUrl).hostname;
      } catch  {
        continue;
      }
      if (!info || !sourceUrl.startsWith("https://commons.wikimedia.org/wiki/File:") || ![
        "upload.wikimedia.org",
        "thumb.wikimedia.org"
      ].includes(imageHost) || !/\.(?:jpe?g|png|webp)$/i.test(fileTitle) || !/\.(?:jpe?g|png|webp)(?:$|[?#])/i.test(imageUrl) || !/^(?:CC BY(?:-SA)?(?: [0-9.]+)?|CC0|Public domain|PD(?:[- ]\w+)?)$/i.test(license)) {
        continue;
      }
      const score = wikimediaMatchScore(project.title_en, fileTitle);
      if (!score) continue;
      const current = candidateMap.get(sourceUrl);
      if (!current || current.score < score) {
        candidateMap.set(sourceUrl, {
          fileTitle,
          info,
          metadata,
          license,
          imageUrl,
          sourceUrl,
          score
        });
      }
    }
  }
  const candidates = [
    ...candidateMap.values()
  ].sort((left, right)=>right.score - left.score);
  let candidate = null;
  for (const option of candidates){
    const { count, error: existingImageError } = await serviceClient.from("service_projects").select("id", {
      count: "exact",
      head: true
    }).eq("image_source_url", option.sourceUrl);
    if (existingImageError) throw new Error(`تعذر التحقق من تكرار الصورة: ${existingImageError.message}`);
    if (!count) {
      candidate = option;
      break;
    }
  }
  if (!candidate?.info) return {
    status: "needs_review",
    reason: "no_relevant_openly_licensed_image"
  };
  const imageResponse = await fetch(candidate.imageUrl, {
    headers: {
      "User-Agent": "TechsphereProjectImageResearch/1.0 (educational project catalog)"
    },
    signal: AbortSignal.timeout(20_000)
  });
  if (!imageResponse.ok) throw new Error(`تعذر تنزيل الصورة المختارة (${imageResponse.status}).`);
  const contentType = (imageResponse.headers.get("Content-Type") || "").split(";")[0].trim().toLowerCase();
  if (!imageTypes.has(contentType)) return {
    status: "needs_review",
    reason: "unsupported_image_format"
  };
  const bytes = await readImageWithinLimit(imageResponse, 5 * 1024 * 1024);
  if (!isSupportedImage(bytes, contentType)) return {
    status: "needs_review",
    reason: "invalid_image_content"
  };
  const attributionRequired = isRecord(candidate.metadata.AttributionRequired) && candidate.metadata.AttributionRequired.value === "true";
  const artist = plainWikimediaText(isRecord(candidate.metadata.Artist) ? candidate.metadata.Artist.value : "");
  const attribution = attributionRequired && artist ? `; attribution: ${artist}` : "";
  const licenseText = `${candidate.license}${attribution}`;
  const sourceHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(candidate.sourceUrl));
  const sourceKey = Array.from(new Uint8Array(sourceHash), (byte)=>byte.toString(16).padStart(2, "0")).slice(0, 20).join("");
  const extension = imageTypes.get(contentType);
  if (!extension) return {
    status: "needs_review",
    reason: "unsupported_image_format"
  };
  const storagePath = `${project.id}/commons-${sourceKey}.${extension}`;
  const { error: uploadError } = await serviceClient.storage.from("techsphere-project-images").upload(storagePath, bytes, {
    contentType,
    upsert: true
  });
  if (uploadError) throw new Error(`تعذر رفع الصورة إلى Storage: ${uploadError.message}`);
  const { data: { publicUrl } } = serviceClient.storage.from("techsphere-project-images").getPublicUrl(storagePath);
  const { data: updatedProject, error: updateError } = await serviceClient.from("service_projects").update({
    image_url: publicUrl,
    image_source_url: candidate.sourceUrl,
    image_license: licenseText,
    image_alt_text: project.title_en || project.title_ar
  }).eq("id", project.id).is("image_url", null).select("id").maybeSingle();
  if (updateError) throw new Error(`تعذر ربط الصورة بالمشروع: ${updateError.message}`);
  if (!updatedProject) return {
    status: "skipped",
    reason: "image_was_set_concurrently"
  };
  return {
    status: "uploaded",
    projectCode: project.project_code,
    fileTitle: candidate.fileTitle,
    sourceUrl: candidate.sourceUrl,
    license: licenseText,
    imageUrl: publicUrl
  };
}
async function verifyProjectAccess(serviceClient, projectId, session) {
  const now = new Date().toISOString();
  const { data, error } = await serviceClient.from("service_project_access").select("id, order_id, activated_at, expires_at, status").eq("user_id", session.id).eq("project_id", projectId).eq("status", "active").lte("activated_at", now).gt("expires_at", now).order("expires_at", {
    ascending: false
  }).limit(1).maybeSingle();
  if (error) return {
    error
  };
  return {
    access: data
  };
}
async function watermarkPdf(input, customerEmail, projectCode, orderReference) {
  const pdf = await PDFDocument.load(input);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const date = new Date().toISOString().slice(0, 10);
  const watermark = `Techshpere | ${customerEmail} | ${projectCode} | ${orderReference || "ACTIVATION"} | ${date}`;
  for (const page of pdf.getPages()){
    const availableWidth = Math.max(50, page.getWidth() - 48);
    const fontSize = Math.max(5, Math.min(8, availableWidth / font.widthOfTextAtSize(watermark, 8) * 8));
    page.drawText(watermark, {
      x: 24,
      y: 12,
      size: fontSize,
      font,
      color: rgb(0.52, 0.52, 0.52),
      opacity: 0.35
    });
  }
  return await pdf.save();
}
Deno.serve(async (request)=>{
  if (request.method === "OPTIONS") return new Response("ok", {
    headers: corsHeaders
  });
  if (request.method !== "POST") return jsonResponse({
    error: "Method not allowed."
  }, 405);
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    console.error("Service projects function is missing Supabase secrets.");
    return jsonResponse({
      error: "خدمة المشاريع غير مكتملة الإعداد."
    }, 500);
  }
  let parsedBody;
  try {
    parsedBody = await request.json();
  } catch  {
    return jsonResponse({
      error: "بيانات الطلب غير صالحة."
    }, 400);
  }
  if (!isRecord(parsedBody) || typeof parsedBody.action !== "string") {
    return jsonResponse({
      error: "بيانات الطلب غير صالحة."
    }, 400);
  }
  const body = parsedBody;
  const action = body.action;
  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
  if (action === "catalog") {
    const { data, error } = await serviceClient.from("service_project_categories").select("*").eq("is_active", true).order("sort_order");
    if (error) return databaseError(error, "تحميل فئات المشاريع");
    return jsonResponse({
      categories: (data || []).filter((category)=>publicServiceCategorySlugs.has(category.slug))
    });
  }
  if (action === "featured_projects") {
    const { data: categories, error: categoryError } = await serviceClient.from("service_project_categories").select("id, slug").eq("is_active", true);
    if (categoryError) return databaseError(categoryError, "تحميل فئات المشاريع");
    const activeCategoryIds = (categories || []).filter((category)=>publicServiceCategorySlugs.has(category.slug)).map((category)=>category.id);
    if (!activeCategoryIds.length) return jsonResponse({
      projects: []
    });
    const { data, error } = await serviceClient.from("service_projects").select("id, project_code, slug, category_id, title_ar, title_en, public_description_ar, public_description_en, image_url, image_alt_text, price, currency_code, difficulty, status").eq("catalog_visible", true).in("category_id", activeCategoryIds).order("created_at", {
      ascending: false
    }).limit(12);
    if (error) return databaseError(error, "تحميل مشاريع الواجهة");
    return jsonResponse({
      projects: (data || []).map(({ status, ...project })=>({
          ...project,
          is_for_sale: status === "published" && Number(project.price) > 0
        }))
    });
  }
  if (action === "category_projects") {
    if (!boundedText(body.slug, 1, 100) || !publicServiceCategorySlugs.has(body.slug) || body.page !== undefined && (!Number.isSafeInteger(body.page) || Number(body.page) < 1 || Number(body.page) > 1_000_000) || body.search !== undefined && (typeof body.search !== "string" || body.search.length > 100) || body.saleFilter !== undefined && ![
      "all",
      "available",
      "unpriced"
    ].includes(String(body.saleFilter))) {
      return jsonResponse({
        error: "بيانات القسم أو الصفحة غير صالحة."
      }, 400);
    }
    const page = body.page === undefined ? 1 : Number(body.page);
    const pageSize = 15;
    const search = typeof body.search === "string" ? body.search.trim().replace(/[,.()"']/g, " ").replace(/[%_\\]/g, "\\$&") : "";
    const saleFilter = typeof body.saleFilter === "string" ? body.saleFilter : "all";
    const { data: category, error: categoryError } = await serviceClient.from("service_project_categories").select("*").eq("slug", body.slug).eq("is_active", true).maybeSingle();
    if (categoryError) return databaseError(categoryError, "تحميل القسم");
    if (!category) return jsonResponse({
      error: "القسم غير موجود."
    }, 404);
    const start = (page - 1) * pageSize;
    let projectsQuery = serviceClient.from("service_projects").select("id, project_code, slug, category_id, title_ar, title_en, public_description_ar, public_description_en, image_url, image_alt_text, price, currency_code, difficulty, status", {
      count: "exact"
    }).eq("catalog_visible", true).eq("category_id", category.id);
    if (search) {
      const pattern = `%${search}%`;
      projectsQuery = projectsQuery.or([
        `project_code.ilike.${pattern}`,
        `slug.ilike.${pattern}`,
        `title_ar.ilike.${pattern}`,
        `title_en.ilike.${pattern}`,
        `public_description_ar.ilike.${pattern}`,
        `public_description_en.ilike.${pattern}`
      ].join(","));
    }
    if (saleFilter === "available") {
      projectsQuery = projectsQuery.eq("status", "published").gt("price", 0);
    } else if (saleFilter === "unpriced") {
      projectsQuery = projectsQuery.is("price", null);
    }
    const { data, count, error } = await projectsQuery.order("created_at", {
      ascending: false
    }).order("id", {
      ascending: true
    }).range(start, start + pageSize - 1);
    if (error) return databaseError(error, "تحميل مشاريع القسم");
    return jsonResponse({
      category,
      projects: (data || []).map(({ status, ...project })=>({
          ...project,
          is_for_sale: status === "published" && Number(project.price) > 0
        })),
      pagination: {
        page,
        page_size: pageSize,
        total_items: count || 0,
        total_pages: Math.ceil((count || 0) / pageSize)
      }
    });
  }
  if (action === "public_project") {
    const identifier = typeof body.slug === "string" && body.slug.trim() ? body.slug.trim() : typeof body.id === "string" && body.id.trim() ? body.id.trim() : "";
    if (!boundedText(identifier, 1, 180)) return jsonResponse({
      error: "معرّف المشروع غير صالح."
    }, 400);
    let query = serviceClient.from("service_projects").select("id, project_code, slug, category_id, title_ar, title_en, public_description_ar, public_description_en, image_url, image_alt_text, price, currency_code, difficulty, status, catalog_visible");
    query = isUuid(identifier) ? query.eq("id", identifier) : query.eq("slug", identifier);
    const { data, error } = await query.eq("catalog_visible", true).maybeSingle();
    if (error) return databaseError(error, "تحميل المشروع");
    if (!data) return jsonResponse({
      error: "المشروع غير موجود."
    }, 404);
    const { data: category, error: categoryError } = await serviceClient.from("service_project_categories").select("id").eq("id", data.category_id).eq("is_active", true).maybeSingle();
    if (categoryError) return databaseError(categoryError, "التحقق من فئة المشروع");
    if (!category) return jsonResponse({
      error: "المشروع غير موجود."
    }, 404);
    return jsonResponse({
      project: {
        id: data.id,
        project_code: data.project_code,
        slug: data.slug,
        category_id: data.category_id,
        title_ar: data.title_ar,
        title_en: data.title_en,
        public_description_ar: data.public_description_ar,
        public_description_en: data.public_description_en,
        image_url: data.image_url,
        image_alt_text: data.image_alt_text,
        price: data.price,
        currency_code: data.currency_code,
        difficulty: data.difficulty,
        is_for_sale: data.status === "published" && Number(data.price) > 0
      }
    });
  }
  const session = await authenticate(request, supabaseUrl, anonKey);
  if (!session) return jsonResponse({
    error: "سجّل الدخول بحساب موثّق لمتابعة الطلب."
  }, 401);
  if (action === "my_projects") {
    const [ordersResult, accessResult] = await Promise.all([
      serviceClient.from("service_project_orders").select("id, order_reference, project_id, order_type, amount, currency_code, payment_status, payment_method, confirmed_at, created_at").eq("user_id", session.id).order("created_at", {
        ascending: false
      }),
      serviceClient.from("service_project_access").select("id, project_id, order_id, activated_at, expires_at, status, created_at").eq("user_id", session.id).order("created_at", {
        ascending: false
      })
    ]);
    if (ordersResult.error) return databaseError(ordersResult.error, "تحميل طلباتك");
    if (accessResult.error) return databaseError(accessResult.error, "تحميل صلاحيات مشاريعك");
    const projectIds = [
      ...new Set([
        ...(ordersResult.data || []).map((order)=>order.project_id),
        ...(accessResult.data || []).map((access)=>access.project_id)
      ])
    ];
    const projectsResult = projectIds.length ? await serviceClient.from("service_projects").select("id, project_code, slug, title_ar, title_en, image_url, image_alt_text, price, currency_code, status").in("id", projectIds) : {
      data: [],
      error: null
    };
    if (projectsResult.error) return databaseError(projectsResult.error, "تحميل بيانات المشاريع");
    return jsonResponse({
      orders: ordersResult.data || [],
      access: accessResult.data || [],
      projects: projectsResult.data || []
    });
  }
  if (action === "create_order") {
    if (!isUuid(body.projectId) || body.orderType !== undefined && ![
      "purchase",
      "renewal"
    ].includes(String(body.orderType)) || body.message !== undefined && (typeof body.message !== "string" || body.message.length > 2000) || body.requestDetails !== undefined && !isRecord(body.requestDetails)) {
      return jsonResponse({
        error: "بيانات طلب المشروع غير صالحة."
      }, 400);
    }
    const orderType = body.orderType || "purchase";
    let customerMessage = typeof body.message === "string" ? body.message.trim() : "";
    if (orderType === "purchase") {
      if (!isRecord(body.requestDetails)) {
        return jsonResponse({
          error: "أكمل بيانات التواصل والتسليم قبل إرسال طلب المشروع."
        }, 400);
      }
      const details = body.requestDetails;
      const allowedBudgetRanges = new Set([
        "under_3000",
        "3000_7000",
        "7000_15000",
        "over_15000",
        "flexible"
      ]);
      const allowedDeliveryWindows = new Set([
        "within_1_week",
        "within_2_weeks",
        "within_1_month",
        "flexible"
      ]);
      const customerName = typeof details.customerName === "string" ? details.customerName.trim() : "";
      const phone = typeof details.phone === "string" ? details.phone.trim() : "";
      const address = typeof details.address === "string" ? details.address.trim() : "";
      const notes = typeof details.notes === "string" ? details.notes.trim() : "";
      if (!boundedText(customerName, 2, 120) || !/^[+0-9()\-\s]{7,30}$/.test(phone) || phone.replace(/\D/g, "").length < 7 || !allowedBudgetRanges.has(String(details.budgetRange)) || !allowedDeliveryWindows.has(String(details.deliveryWindow)) || !boundedText(address, 8, 350) || notes.length > 500) {
        return jsonResponse({
          error: "راجع الاسم ورقم الهاتف والميزانية وموعد التسليم والعنوان."
        }, 400);
      }
      customerMessage = JSON.stringify({
        form_version: 1,
        customer_name: customerName,
        phone,
        budget_range: details.budgetRange,
        delivery_window: details.deliveryWindow,
        address,
        notes
      });
      if (customerMessage.length > 2000) {
        return jsonResponse({
          error: "بيانات الطلب أطول من الحد المسموح؛ اختصر العنوان أو الملاحظات."
        }, 400);
      }
    }
    const { data: project, error: projectError } = await serviceClient.from("service_projects").select("id, category_id, price, currency_code, status").eq("id", body.projectId).eq("catalog_visible", true).eq("status", "published").maybeSingle();
    if (projectError) return databaseError(projectError, "التحقق من المشروع");
    if (!project || project.price === null || !Number.isFinite(Number(project.price)) || Number(project.price) <= 0) {
      return jsonResponse({
        error: "المشروع غير متاح للشراء قبل تحديد سعر صحيح."
      }, 409);
    }
    const { data: category, error: categoryError } = await serviceClient.from("service_project_categories").select("id").eq("id", project.category_id).eq("is_active", true).maybeSingle();
    if (categoryError) return databaseError(categoryError, "التحقق من فئة المشروع");
    if (!category) return jsonResponse({
      error: "المشروع غير متاح للشراء."
    }, 404);
    const accessResult = await verifyProjectAccess(serviceClient, project.id, session);
    if (accessResult.error) return databaseError(accessResult.error, "التحقق من صلاحية المشروع");
    if (accessResult.access) return jsonResponse({
      error: "لديك بالفعل صلاحية فعالة لهذا المشروع."
    }, 409);
    if (orderType === "renewal") {
      const { count, error: previousOrderError } = await serviceClient.from("service_project_orders").select("id", {
        count: "exact",
        head: true
      }).eq("user_id", session.id).eq("project_id", project.id).eq("payment_status", "confirmed");
      if (previousOrderError) return databaseError(previousOrderError, "التحقق من طلب التجديد");
      if (!count) return jsonResponse({
        error: "لا يوجد شراء سابق لهذا المشروع لتجديده."
      }, 409);
    }
    const { data: pendingOrder, error: pendingError } = await serviceClient.from("service_project_orders").select("id").eq("user_id", session.id).eq("project_id", project.id).eq("payment_status", "pending").limit(1).maybeSingle();
    if (pendingError) return databaseError(pendingError, "التحقق من الطلبات السابقة");
    if (pendingOrder) return jsonResponse({
      error: "لديك طلب دفع معلّق لهذا المشروع بالفعل."
    }, 409);
    const { data, error } = await serviceClient.rpc("techsphere_service_project_create_order_v1", {
      p_user_id: session.id,
      p_project_id: project.id,
      p_order_type: orderType,
      p_customer_message: customerMessage
    });
    if (error?.code === "23505") {
      return jsonResponse({
        error: "لديك طلب دفع معلّق لهذا المشروع بالفعل."
      }, 409);
    }
    if (error?.code === "P0001") {
      return jsonResponse({
        error: "المشروع غير متاح للشراء أو لا يملك سعرًا صحيحًا."
      }, 409);
    }
    if (error) return databaseError(error, "إنشاء طلب المشروع");
    return jsonResponse({
      success: true,
      order: data?.[0] || null
    }, 201);
  }
  if (action === "project_request_submit") {
    if (!boundedText(body.buyer_name, 2, 160) || !boundedText(body.buyer_phone, 7, 40) || !boundedText(body.buyer_email, 5, 254) || !boundedText(body.delivery_address, 8, 500) || !isUuid(body.project_id) || !isUuid(body.category_id) || typeof body.min_budget !== "number" || body.min_budget < 0 || typeof body.max_budget !== "number" || body.max_budget < 0 || body.min_budget > body.max_budget || !boundedText(body.budget_currency, 3, 3) || !/^[A-Z]{3}$/.test(body.budget_currency) || !boundedText(body.delivery_deadline, 1, 120)) {
      return jsonResponse({
        error: "راجع البيانات المدخلة وحاول مرة أخرى."
      }, 400);
    }
    if (body.additional_message && typeof body.additional_message !== "string") {
      return jsonResponse({
        error: "ملاحظات إضافية غير صالحة."
      }, 400);
    }
    const additionalMessage = typeof body.additional_message === "string" ? body.additional_message.trim() : "";
    // Verify the project exists and belongs to the given category.
    const { data: project, error: projectError } = await serviceClient.from("service_projects").select("id, slug, title_ar, title_en, category_id, status, catalog_visible").eq("id", body.project_id).maybeSingle();
    if (projectError) return databaseError(projectError, "تحقق من المشروع المطلوب");
    if (!project) return jsonResponse({
      error: "المشروع غير موجود."
    }, 404);
    const { data: category, error: categoryError } = await serviceClient.from("service_project_categories").select("id, slug, title_ar, title_en").eq("id", body.category_id).maybeSingle();
    if (categoryError) return databaseError(categoryError, "تحقق من تصنيف المشروع");
    if (!category || category.id !== project.category_id) {
      return jsonResponse({
        error: "تصنيف المشروع غير متطابق مع المشروع المحدد."
      }, 400);
    }
    // Prevent duplicate pending request for the same user and project.
    if (session.id) {
      const { data: pendingRequest, error: pendingError } = await serviceClient.from("project_requests").select("id, order_number").eq("user_id", session.id).eq("project_id", body.project_id).eq("status", "pending_review").limit(1).maybeSingle();
      if (pendingError) return databaseError(pendingError, "التحقق من الطلبات السابقة");
      if (pendingRequest) {
        return jsonResponse({
          error: "لديك طلب عرض سعر معلق لهذا المشروع بالفعل.",
          order_number: pendingRequest.order_number
        }, 409);
      }
    }
    const { data, error } = await serviceClient.from("project_requests").insert({
      project_id: body.project_id,
      category_id: body.category_id,
      user_id: session.id || null,
      buyer_name: body.buyer_name.trim(),
      buyer_phone: body.buyer_phone.trim(),
      buyer_email: body.buyer_email.trim(),
      delivery_address: body.delivery_address.trim(),
      min_budget: body.min_budget,
      max_budget: body.max_budget,
      budget_currency: body.budget_currency,
      delivery_deadline: body.delivery_deadline.trim(),
      additional_message: additionalMessage,
      status: "pending_review",
      access_granted: false
    }).select("id, order_number, project_id, category_id, user_id, buyer_name, buyer_phone, buyer_email, delivery_address, min_budget, max_budget, budget_currency, delivery_deadline, additional_message, status, access_granted, created_at").single();
    if (error) return databaseError(error, "حفظ طلب عرض السعر");
    return jsonResponse({
      success: true,
      request: data
    }, 201);
  }
  if (action === "redeem_activation_code") {
    const normalizedCode = normalizeActivationCode(body.code);
    if (!normalizedCode) {
      return jsonResponse({
        error: "صيغة الرمز غير مكتملة. الرمز يبدأ بـ TXH ويتكون من ثلاث مجموعات من أربعة حروف أو أرقام."
      }, 400);
    }
    const codeHash = await sha256(normalizedCode);
    const { data: codeRow, error: codeError } = await serviceClient.from("service_project_activation_codes").select("id, project_id, order_id, created_by, expires_at, redeemed_at, revoked_at").eq("code_hash", codeHash).maybeSingle();
    if (codeError) return databaseError(codeError, "التحقق من رمز التفعيل");
    if (!codeRow) {
      return jsonResponse({
        error: "لا يوجد رمز مطابق لهذه القيمة. راجع الحروف والأرقام ثم حاول مرة أخرى."
      }, 404);
    }
    if (codeRow.redeemed_at) {
      return jsonResponse({
        error: "هذا الرمز مستخدم بالفعل ولا يعمل مرة ثانية."
      }, 409);
    }
    if (codeRow.revoked_at) {
      return jsonResponse({
        error: "تم إلغاء هذا الرمز من الإدارة. اطلب رمزًا جديدًا."
      }, 409);
    }
    if (codeRow.expires_at && new Date(codeRow.expires_at).getTime() <= Date.now()) {
      return jsonResponse({
        error: `انتهت صلاحية هذا الرمز بتاريخ ${String(codeRow.expires_at).slice(0, 10)}. اطلب رمزًا جديدًا من الإدارة.`
      }, 410);
    }
    const { data: order, error: orderError } = await serviceClient.from("service_project_orders").select("id, user_id, project_id, payment_status, payment_method, order_reference").eq("id", codeRow.order_id).maybeSingle();
    if (orderError) return databaseError(orderError, "التحقق من طلب الرمز");
    if (!order) {
      return jsonResponse({
        error: "هذا الرمز غير مرتبط بطلب صالح. تواصل مع الإدارة."
      }, 409);
    }
    if (order.user_id !== session.id) {
      console.warn("Activation code redeemed from a different account:", JSON.stringify({
        codeId: codeRow.id,
        orderId: order.id,
        orderUserId: order.user_id,
        sessionUserId: session.id
      }));
      return jsonResponse({
        error: "هذا الرمز صادر لطلب مرتبط بحساب آخر. سجّل الدخول بالحساب الذي أُرسل منه الطلب، أو تواصل مع الإدارة لتصحيح الحساب."
      }, 403);
    }
    if (order.payment_status !== "confirmed" || order.payment_method !== "activation_code") {
      return jsonResponse({
        error: "لم يُسجَّل دفع مؤكد لهذا الطلب بالرمز. تواصل مع الإدارة لتأكيد الدفع أولًا."
      }, 409);
    }
    const { data: currentAccess, error: accessError } = await serviceClient.from("service_project_access").select("id, expires_at").eq("user_id", session.id).eq("project_id", order.project_id).eq("status", "active").gt("expires_at", new Date().toISOString()).order("expires_at", {
      ascending: false
    }).limit(1).maybeSingle();
    if (accessError) return databaseError(accessError, "التحقق من صلاحية المشروع");
    if (currentAccess) {
      return jsonResponse({
        error: `لديك صلاحية فعّالة لهذا المشروع حتى ${String(currentAccess.expires_at).slice(0, 10)}. لا تحتاج رمزًا جديدًا الآن.`
      }, 409);
    }
    const redeemParams = {
      p_code_hash: codeHash,
      p_user_id: session.id
    };
    let { data: redeemed, error: redeemError } = await serviceClient.rpc("techsphere_service_project_redeem_code_v2", redeemParams);
    if (redeemError && (redeemError.code === "PGRST202" || /could not find the function/i.test(String(redeemError.message)))) {
      // v2 ships with migration 20261102191000; keep redeeming through v1 until it exists.
      console.warn("Redeem v2 is not available, falling back to v1:", redeemError.message);
      const legacy = await serviceClient.rpc("techsphere_service_project_redeem_code_v1", redeemParams);
      redeemed = legacy.data;
      redeemError = legacy.error;
    }
    if (redeemError) {
      // Every documented refusal is reported above with its own message, so anything
      // reaching this point is a race or a database fault: log the real reason.
      console.error("Unable to redeem project activation code:", redeemError.code, redeemError.message);
      const reason = String(redeemError.message || "");
      if (reason.includes("already has active access")) {
        return jsonResponse({
          error: "لديك صلاحية فعّالة لهذا المشروع بالفعل."
        }, 409);
      }
      if (reason.includes("already used") || reason.includes("invalid, expired")) {
        return jsonResponse({
          error: "تم استخدام هذا الرمز أو انتهت صلاحيته للتو. حدّث الصفحة وحاول مرة أخرى."
        }, 409);
      }
      if (reason.includes("not valid for this customer")) {
        return jsonResponse({
          error: "هذا الرمز صادر لطلب مرتبط بحساب آخر. سجّل الدخول بالحساب الذي أُرسل منه الطلب، أو اطلب من الإدارة إعادة إسناد الطلب لحسابك."
        }, 403);
      }
      // Refusals of the business rules above are final. Anything else is a database-side
      // fault (missing or mismatched function, constraint, permission). The validations
      // above already passed, so the activation is carried out directly here instead of
      // leaving a paid customer blocked by a schema mismatch.
      if (redeemError.code !== "P0001") {
        const activated = await activateProjectAccessDirect(serviceClient, {
          orderId: order.id,
          projectId: order.project_id,
          codeId: codeRow.id,
          grantedBy: codeRow.created_by,
          userId: session.id
        });
        if (activated) {
          console.warn("Activation completed directly after the database function failed:", JSON.stringify({
            orderId: order.id,
            accessId: activated.access_id,
            errorCode: redeemError.code
          }));
          return jsonResponse({
            success: true,
            access: activated
          });
        }
      }
      return jsonResponse({
        error: `تعذر تفعيل الرمز الآن للطلب ${order.order_reference || order.id} (رمز الخطأ: ${redeemError.code || "unknown"}). أرسل هذه الرسالة للدعم مع رقم الطلب.`
      }, 500);
    }
    return jsonResponse({
      success: true,
      access: redeemed?.[0] || null
    });
  }
  if (action === "private_project") {
    if (!boundedText(body.projectCode, 6, 20) || !/^TXH-[A-Z]{2,4}-[0-9]{3,6}$/.test(body.projectCode)) {
      return jsonResponse({
        error: "معرّف المشروع غير صالح."
      }, 400);
    }
    const { data: project, error: projectError } = await serviceClient.from("service_projects").select("id, project_code, slug, category_id, title_ar, title_en, public_description_ar, public_description_en, image_url, image_alt_text, price, currency_code, difficulty, status").eq("project_code", body.projectCode).maybeSingle();
    if (projectError) return databaseError(projectError, "التحقق من المشروع");
    if (!project) return jsonResponse({
      error: "المشروع غير موجود."
    }, 404);
    const accessResult = await verifyProjectAccess(serviceClient, project.id, session);
    if (accessResult.error) return databaseError(accessResult.error, "التحقق من صلاحية المشروع");
    if (!accessResult.access) {
      const { data: latestAccess, error: latestAccessError } = await serviceClient.from("service_project_access").select("expires_at, status").eq("user_id", session.id).eq("project_id", project.id).order("created_at", {
        ascending: false
      }).limit(1).maybeSingle();
      if (latestAccessError) return databaseError(latestAccessError, "تحميل حالة صلاحية المشروع");
      return jsonResponse({
        error: latestAccess?.status === "revoked" ? "تم إيقاف صلاحية هذا المشروع." : latestAccess ? "انتهت صلاحية المشروع. يمكنك تقديم طلب تجديد." : "لا تملك صلاحية الوصول إلى هذا المشروع.",
        accessExpired: Boolean(latestAccess && latestAccess.status !== "revoked"),
        expiresAt: latestAccess?.expires_at || null
      }, 403);
    }
    const { data: documents, error: documentError } = await serviceClient.from("service_project_document_versions").select("*").eq("project_id", project.id).lte("published_at", new Date().toISOString()).order("published_at", {
      ascending: false
    });
    if (documentError) return databaseError(documentError, "تحميل توثيق المشروع");
    const document = documents?.[0];
    if (!document) return jsonResponse({
      error: "توثيق هذا المشروع غير متاح بعد."
    }, 404);
    const { data: order } = accessResult.access.order_id ? await serviceClient.from("service_project_orders").select("order_reference").eq("id", accessResult.access.order_id).maybeSingle() : {
      data: null
    };
    return jsonResponse({
      project: {
        id: project.id,
        project_code: project.project_code,
        slug: project.slug,
        category_id: project.category_id,
        title_ar: project.title_ar,
        title_en: project.title_en,
        public_description_ar: project.public_description_ar,
        public_description_en: project.public_description_en,
        image_url: project.image_url,
        image_alt_text: project.image_alt_text,
        price: project.price,
        currency_code: project.currency_code,
        difficulty: project.difficulty,
        status: project.status,
      },
      access: {
        id: accessResult.access.id,
        activated_at: accessResult.access.activated_at,
        expires_at: accessResult.access.expires_at,
        order_reference: order?.order_reference || null
      },
      document: {
        id: document.id,
        version: document.version,
        changelog_ar: document.changelog_ar,
        changelog_en: document.changelog_en,
        documentation: document.documentation,
        private_files: (document.private_files || []).map((file)=>({
            file_name: file.file_name,
            content_type: file.content_type,
            label_ar: file.label_ar || "",
            label_en: file.label_en || ""
          })),
        published_at: document.published_at
      },
      versions: (documents || []).map((version)=>({
          id: version.id,
          version: version.version,
          changelog_ar: version.changelog_ar,
          changelog_en: version.changelog_en,
          published_at: version.published_at
        })),
      customer: {
        name: session.fullName,
        email: session.email
      }
    });
  }
  if (action === "download_private_file") {
    if (!isUuid(body.documentVersionId) || !boundedText(body.fileName, 1, 180)) {
      return jsonResponse({
        error: "بيانات الملف غير صالحة."
      }, 400);
    }
    const { data: document, error: documentError } = await serviceClient.from("service_project_document_versions").select("id, project_id, private_files").eq("id", body.documentVersionId).lte("published_at", new Date().toISOString()).maybeSingle();
    if (documentError) return databaseError(documentError, "التحقق من الملف");
    if (!document || !Array.isArray(document.private_files)) {
      return jsonResponse({
        error: "الملف غير موجود."
      }, 404);
    }
    const accessResult = await verifyProjectAccess(serviceClient, document.project_id, session);
    if (accessResult.error) return databaseError(accessResult.error, "التحقق من صلاحية التنزيل");
    if (!accessResult.access) return jsonResponse({
      error: "انتهت صلاحية الوصول إلى المشروع."
    }, 403);
    const file = document.private_files.find((candidate)=>isRecord(candidate) && candidate.file_name === body.fileName);
    if (!isRecord(file) || typeof file.path !== "string" || typeof file.content_type !== "string" || !file.path.startsWith(`${document.project_id}/`)) {
      return jsonResponse({
        error: "الملف غير متاح لهذا المشروع."
      }, 404);
    }
    const { data: project, error: projectError } = await serviceClient.from("service_projects").select("project_code").eq("id", document.project_id).maybeSingle();
    if (projectError) return databaseError(projectError, "تحميل معرّف المشروع");
    if (!project) return jsonResponse({
      error: "المشروع غير موجود."
    }, 404);
    const { data: downloadedFile, error: downloadError } = await serviceClient.storage.from("techsphere-project-private").download(file.path);
    if (downloadError) return databaseError(downloadError, "تحميل الملف الخاص");
    let output = new Uint8Array(await downloadedFile.arrayBuffer());
    const contentType = file.content_type;
    if (contentType === "application/pdf" || String(file.file_name).toLowerCase().endsWith(".pdf")) {
      try {
        let orderReference = "ACTIVATION";
        if (accessResult.access.order_id) {
          const { data: order, error: orderError } = await serviceClient.from("service_project_orders").select("order_reference").eq("id", accessResult.access.order_id).maybeSingle();
          if (orderError) return databaseError(orderError, "تحميل بيانات الطلب للتوثيق");
          orderReference = order?.order_reference || orderReference;
        }
        output = await watermarkPdf(output, session.email, project.project_code, orderReference);
      } catch (error) {
        console.error("Unable to watermark the private project PDF:", error);
        return jsonResponse({
          error: "تعذر تجهيز نسخة PDF المائية الآمنة."
        }, 500);
      }
    }
    const { error: logError } = await serviceClient.from("service_project_download_logs").insert({
      user_id: session.id,
      access_id: accessResult.access.id,
      document_version_id: document.id,
      file_name: file.file_name
    });
    if (logError) return databaseError(logError, "تسجيل تنزيل الملف");
    return new Response(output, {
      headers: {
        ...corsHeaders,
        "Content-Type": contentType,
        "Content-Disposition": contentDispositionFileName(String(file.file_name)),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff"
      }
    });
  }
  // Every action handled below this point must be listed here, otherwise the request is
  // rejected as unknown before the administrator check runs.
  const adminOnlyActions = new Set([
    "admin_list",
    "category_save",
    "project_save",
    "project_archive",
    "project_delete",
    "document_publish",
    "image_upload",
    "private_upload_url",
    "order_confirm",
    "order_reject",
    "activation_code_issue",
    "activation_code_reissue",
    "order_reassign_user",
    "access_extend",
    "access_revoke",
    "project_request_list",
    "project_request_get",
    "order_status_update",
    "order_delete",
    "project_access_grant",
    "analytics",
    "commons_image_batch",
    "commons_image_remove"
  ]);
  if (!adminOnlyActions.has(action)) {
    console.warn("Unknown admin action requested:", action);
    return jsonResponse({
      error: "الإجراء المطلوب غير معروف."
    }, 400);
  }
  if (!isAdmin(session, Deno.env.get("ADMIN_EMAILS"))) {
    return jsonResponse({
      error: "هذا الحساب غير مصرح له بإدارة المشاريع."
    }, 403);
  }
  if (action === "commons_image_remove") {
    const projectCodes = body.projectCodes;
    if (!Array.isArray(projectCodes) || projectCodes.length < 1 || projectCodes.length > 50 || projectCodes.some((code)=>typeof code !== "string" || !/^TXH-[A-Z]{2,4}-[0-9]{3,6}$/.test(code))) {
      return jsonResponse({
        error: "قائمة المشاريع المراد تنظيف صورها غير صالحة."
      }, 400);
    }
    const { data: projects, error: projectsError } = await serviceClient.from("service_projects").select("id, project_code, image_url, image_source_url").in("project_code", projectCodes);
    if (projectsError) return databaseError(projectsError, "تحميل صور المشاريع للمراجعة");
    const storageMarker = "/storage/v1/object/public/techsphere-project-images/";
    const results = [];
    for (const project of projects || []){
      if (!project.image_url || !project.image_source_url?.startsWith("https://commons.wikimedia.org/wiki/File:")) {
        results.push({
          projectCode: project.project_code,
          status: "skipped",
          reason: "not_an_imported_commons_image"
        });
        continue;
      }
      let imageUrl;
      try {
        imageUrl = new URL(project.image_url);
      } catch  {
        results.push({
          projectCode: project.project_code,
          status: "skipped",
          reason: "invalid_image_url"
        });
        continue;
      }
      const configuredUrl = Deno.env.get("SUPABASE_URL");
      if (!configuredUrl || imageUrl.origin !== new URL(configuredUrl).origin || !imageUrl.pathname.includes(storageMarker)) {
        results.push({
          projectCode: project.project_code,
          status: "skipped",
          reason: "image_not_in_project_bucket"
        });
        continue;
      }
      const storagePath = decodeURIComponent(imageUrl.pathname.slice(imageUrl.pathname.indexOf(storageMarker) + storageMarker.length));
      if (!storagePath.startsWith(`${project.id}/commons-`)) {
        results.push({
          projectCode: project.project_code,
          status: "skipped",
          reason: "image_not_owned_by_project_importer"
        });
        continue;
      }
      const { error: updateError } = await serviceClient.from("service_projects").update({
        image_url: null,
        image_source_url: null,
        image_license: null,
        image_alt_text: ""
      }).eq("id", project.id).eq("image_url", project.image_url);
      if (updateError) {
        results.push({
          projectCode: project.project_code,
          status: "failed",
          reason: updateError.message.slice(0, 200)
        });
        continue;
      }
      const { error: removeError } = await serviceClient.storage.from("techsphere-project-images").remove([
        storagePath
      ]);
      results.push(removeError ? {
        projectCode: project.project_code,
        status: "cleared_storage_orphan",
        reason: removeError.message.slice(0, 200)
      } : {
        projectCode: project.project_code,
        status: "cleared"
      });
    }
    return jsonResponse({
      results
    });
  }
  if (action === "commons_image_batch") {
    const limit = body.limit === undefined ? 3 : Number(body.limit);
    const cursor = body.cursor === undefined ? "" : body.cursor;
    if (!Number.isSafeInteger(limit) || limit < 1 || limit > 5 || cursor !== "" && !boundedText(cursor, 1, 24)) {
      return jsonResponse({
        error: "حجم الدفعة أو مؤشر الاستكمال غير صالح."
      }, 400);
    }
    let projectQuery = serviceClient.from("service_projects").select("id, project_code, title_ar, title_en, image_url").eq("catalog_visible", true).is("image_url", null).order("project_code", {
      ascending: true
    }).limit(limit);
    if (cursor) projectQuery = projectQuery.gt("project_code", cursor);
    const { data: projects, error: projectsError } = await projectQuery;
    if (projectsError) return databaseError(projectsError, "تحميل دفعة الصور");
    const results = [];
    for (const project of projects || []){
      try {
        results.push({
          ...await importWikimediaProjectImage(serviceClient, project),
          projectCode: project.project_code
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "تعذر استيراد الصورة.";
        console.error(`Wikimedia image import failed for ${project.project_code}:`, message);
        results.push({
          status: "failed",
          projectCode: project.project_code,
          reason: message.slice(0, 300)
        });
      }
    }
    const lastProject = projects?.[projects.length - 1];
    return jsonResponse({
      results,
      nextCursor: lastProject?.project_code || cursor || null,
      done: (projects || []).length < limit
    });
  }
  if (action === "admin_list") {
    const [categories, projects, documents, orders, projectRequests, access, codes] = await Promise.all([
      serviceClient.from("service_project_categories").select("*").order("sort_order"),
      serviceClient.from("service_projects").select("*").order("created_at", {
        ascending: false
      }),
      serviceClient.from("service_project_document_versions").select("*").order("published_at", {
        ascending: false
      }).limit(1000),
      serviceClient.from("service_project_orders").select("*").order("created_at", {
        ascending: false
      }).limit(500),
      serviceClient.from("project_requests").select("*").order("created_at", {
        ascending: false
      }).limit(500),
      serviceClient.from("service_project_access").select("*").order("created_at", {
        ascending: false
      }).limit(500),
      serviceClient.from("service_project_activation_codes").select("id, order_id, project_id, expires_at, redeemed_by, redeemed_at, revoked_at, created_by, created_at").order("created_at", {
        ascending: false
      }).limit(500)
    ]);
    const failed = [
      categories,
      projects,
      documents,
      orders,
      projectRequests,
      access,
      codes
    ].find((result)=>result.error);
    if (failed?.error) return databaseError(failed.error, "تحميل إدارة المشاريع");
    const userIds = [
      ...new Set([
        ...(orders.data || []).map((order)=>order.user_id),
        ...(projectRequests.data || []).map((req)=>req.user_id).filter(Boolean),
        ...(access.data || []).map((row)=>row.user_id),
        ...(codes.data || []).map((code)=>code.redeemed_by).filter(Boolean)
      ])
    ];
    const profiles = userIds.length ? await serviceClient.from("profiles").select("id, full_name, email").in("id", userIds) : {
      data: [],
      error: null
    };
    if (profiles.error) return databaseError(profiles.error, "تحميل بيانات أصحاب الطلبات");
    const users = new Map((profiles.data || []).map((profile)=>[
        profile.id,
        profile
      ]));
    const normalizedOrders = [
      ...(orders.data || []).map((order)=>({
          ...order,
          source: "service_order",
          customer: users.get(order.user_id) || null,
          customerName: order.customer?.full_name || order.customer?.email || order.user_id,
          reference: order.order_reference,
          status: order.payment_status,
          amount: order.amount,
          currency: order.currency_code,
          type: order.order_type,
          message: order.customer_message
        })),
      ...(projectRequests.data || []).map((req)=>({
          ...req,
          source: "project_request",
          customer: users.get(req.user_id) || null,
          customerName: req.buyer_name || req.buyer_email || req.user_id,
          reference: req.order_number,
          status: req.status,
          amount: req.min_budget && req.max_budget ? `${req.min_budget} – ${req.max_budget}` : null,
          currency: req.budget_currency,
          type: "quotation",
          message: req.additional_message || undefined
        }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return jsonResponse({
      categories: categories.data || [],
      projects: projects.data || [],
      documents: documents.data || [],
      orders: normalizedOrders,
      access: (access.data || []).map((row)=>({
          ...row,
          customer: users.get(row.user_id) || null
        })),
      activationCodes: (codes.data || []).map((code)=>({
          ...code,
          customer: code.redeemed_by ? users.get(code.redeemed_by) || null : null
        }))
    });
  }
  if (action === "category_save") {
    if (!isRecord(body.category)) return jsonResponse({
      error: "بيانات الفئة غير صالحة."
    }, 400);
    const category = body.category;
    if (category.id !== undefined && !isUuid(category.id) || !boundedText(category.slug, 2, 100) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(category.slug)) || !boundedText(category.title_ar, 2, 120) || !boundedText(category.title_en, 2, 120) || typeof category.description_ar !== "string" || typeof category.description_en !== "string" || category.description_ar.length > 2000 || category.description_en.length > 2000 || category.image_url != null && typeof category.image_url !== "string" || category.image_alt_text != null && typeof category.image_alt_text !== "string" || !Number.isInteger(category.sort_order) || Number(category.sort_order) < 0 || typeof category.is_active !== "boolean") {
      return jsonResponse({
        error: "راجع اسم الفئة ووصفها وترتيبها."
      }, 400);
    }
    const row = {
      ...category.id ? {
        id: category.id
      } : {},
      slug: category.slug,
      title_ar: category.title_ar.trim(),
      title_en: category.title_en.trim(),
      description_ar: category.description_ar.trim(),
      description_en: category.description_en.trim(),
      image_url: typeof category.image_url === "string" ? category.image_url : null,
      image_alt_text: typeof category.image_alt_text === "string" ? category.image_alt_text.trim().slice(0, 300) : "",
      sort_order: category.sort_order,
      is_active: category.is_active
    };
    const query = category.id ? serviceClient.from("service_project_categories").update(row).eq("id", category.id) : serviceClient.from("service_project_categories").insert(row);
    const { data, error } = await query.select("*").single();
    if (error) return databaseError(error, "حفظ فئة المشروع");
    return jsonResponse({
      success: true,
      category: data
    });
  }
  if (action === "project_save") {
    if (!isRecord(body.project)) return jsonResponse({
      error: "بيانات المشروع غير صالحة."
    }, 400);
    const project = body.project;
    if (project.id !== undefined && !isUuid(project.id) || !boundedText(project.project_code, 9, 18) || !/^TXH-[A-Z]{2,4}-[0-9]{3,6}$/.test(String(project.project_code)) || !boundedText(project.slug, 2, 160) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(project.slug)) || !isUuid(project.category_id) || !boundedText(project.title_ar, 2, 200) || !boundedText(project.title_en, 2, 200) || typeof project.public_description_ar !== "string" || typeof project.public_description_en !== "string" || project.public_description_ar.length > 4000 || project.public_description_en.length > 4000 || project.image_source_url != null && typeof project.image_source_url !== "string" || project.image_license != null && typeof project.image_license !== "string" || project.image_alt_text != null && typeof project.image_alt_text !== "string" || project.price !== null && project.price !== undefined && (typeof project.price !== "number" || !Number.isFinite(project.price) || project.price < 0) || project.difficulty && ![
      "beginner",
      "intermediate",
      "advanced"
    ].includes(String(project.difficulty)) || typeof project.catalog_visible !== "boolean" || ![
      "draft",
      "published",
      "archived"
    ].includes(String(project.status))) {
      return jsonResponse({
        error: "راجع بيانات المشروع ورقمه وسعره وحالته."
      }, 400);
    }
    if (project.status === "published" && (!project.catalog_visible || project.price == null || typeof project.price !== "number" || project.price <= 0)) {
      return jsonResponse({
        error: "انشر المشروع في الكتالوج وحدد سعرًا أكبر من صفر قبل إتاحته للبيع."
      }, 400);
    }
    if (project.id) {
      const { data: existing, error: existingError } = await serviceClient.from("service_projects").select("project_code").eq("id", project.id).maybeSingle();
      if (existingError) return databaseError(existingError, "التحقق من معرّف المشروع");
      if (!existing) return jsonResponse({
        error: "المشروع غير موجود."
      }, 404);
      if (existing.project_code !== project.project_code) {
        return jsonResponse({
          error: "رقم المشروع دائم ولا يمكن تغييره بعد إنشائه."
        }, 409);
      }
    }
    const row = {
      ...project.id ? {
        id: project.id
      } : {},
      project_code: project.project_code,
      slug: project.slug,
      category_id: project.category_id,
      title_ar: project.title_ar.trim(),
      title_en: project.title_en.trim(),
      public_description_ar: project.public_description_ar.trim(),
      public_description_en: project.public_description_en.trim(),
      image_url: typeof project.image_url === "string" ? project.image_url : null,
      image_source_url: typeof project.image_source_url === "string" ? project.image_source_url.trim() || null : null,
      image_license: typeof project.image_license === "string" ? project.image_license.trim() || null : null,
      image_alt_text: typeof project.image_alt_text === "string" ? project.image_alt_text.trim().slice(0, 300) : "",
      catalog_visible: project.catalog_visible,
      price: project.price ?? null,
      currency_code: typeof project.currency_code === "string" && /^[A-Z]{3}$/.test(project.currency_code) ? project.currency_code : "EGP",
      difficulty: project.difficulty || null,
      source_document: typeof project.source_document === "string" ? project.source_document : null,
      status: project.status
    };
    const query = project.id ? serviceClient.from("service_projects").update(row).eq("id", project.id) : serviceClient.from("service_projects").insert(row);
    const { data, error } = await query.select("*").single();
    if (error?.code === "23514") {
      return jsonResponse({
        error: "يلزم إظهار المشروع في الكتالوج وتحديد سعر أكبر من صفر قبل إتاحته للبيع."
      }, 400);
    }
    if (error) return databaseError(error, "حفظ المشروع");
    return jsonResponse({
      success: true,
      project: data
    });
  }
  if (action === "project_archive") {
    if (!isUuid(body.projectId)) return jsonResponse({
      error: "معرّف المشروع غير صالح."
    }, 400);
    const { data, error } = await serviceClient.from("service_projects").update({
      status: "archived"
    }).eq("id", body.projectId).select("id, status").maybeSingle();
    if (error) return databaseError(error, "أرشفة المشروع");
    if (!data) return jsonResponse({
      error: "المشروع غير موجود."
    }, 404);
    return jsonResponse({
      success: true,
      project: data
    });
  }
  if (action === "project_delete") {
    if (!isUuid(body.projectId)) return jsonResponse({
      error: "معرّف المشروع غير صالح."
    }, 400);
    const { data: projectToDelete, error: projectLookupError } = await serviceClient.from("service_projects").select("id, source_document").eq("id", body.projectId).maybeSingle();
    if (projectLookupError) return databaseError(projectLookupError, "التحقق من المشروع");
    if (!projectToDelete) return jsonResponse({
      error: "المشروع غير موجود."
    }, 404);
    if (typeof projectToDelete.source_document === "string" && projectToDelete.source_document.startsWith("Inventory ID: ")) {
      return jsonResponse({
        error: "مشاريع الكتالوج المستوردة محمية من الحذف؛ يمكنك أرشفتها بدلًا من ذلك."
      }, 409);
    }
    const references = await Promise.all([
      serviceClient.from("service_project_document_versions").select("id", {
        count: "exact",
        head: true
      }).eq("project_id", body.projectId),
      serviceClient.from("service_project_orders").select("id", {
        count: "exact",
        head: true
      }).eq("project_id", body.projectId),
      serviceClient.from("service_project_access").select("id", {
        count: "exact",
        head: true
      }).eq("project_id", body.projectId),
      serviceClient.from("service_project_activation_codes").select("id", {
        count: "exact",
        head: true
      }).eq("project_id", body.projectId)
    ]);
    const failedReferenceCheck = references.find((result)=>result.error);
    if (failedReferenceCheck?.error) return databaseError(failedReferenceCheck.error, "التحقق من ارتباطات المشروع");
    if (references.some((result)=>(result.count || 0) > 0)) {
      return jsonResponse({
        error: "لا يمكن حذف مشروع مرتبط بتوثيق أو طلبات أو صلاحيات؛ استخدم الأرشفة للحفاظ على السجلات."
      }, 409);
    }
    const { data, error } = await serviceClient.from("service_projects").delete().eq("id", body.projectId).select("id").maybeSingle();
    if (error) return databaseError(error, "حذف المشروع");
    if (!data) return jsonResponse({
      error: "المشروع غير موجود."
    }, 404);
    return jsonResponse({
      success: true,
      projectId: data.id
    });
  }
  if (action === "document_publish") {
    if (!isUuid(body.projectId) || !boundedText(body.version, 1, 20) || !/^[0-9]+[.][0-9]+([.][0-9]+)?$/.test(String(body.version)) || !isRecord(body.documentation) || new TextEncoder().encode(JSON.stringify(body.documentation)).length > 500_000 || body.privateFiles !== undefined && (!Array.isArray(body.privateFiles) || body.privateFiles.length > 100 || body.privateFiles.some((file)=>!isRecord(file) || !boundedText(file.file_name, 1, 180) || typeof file.path !== "string" || !file.path.startsWith(`${body.projectId}/`) || typeof file.content_type !== "string" || !privateFileTypes.has(file.content_type)))) {
      return jsonResponse({
        error: "راجع نسخة التوثيق ومحتواها والملفات المرتبطة."
      }, 400);
    }
    const fileNames = (body.privateFiles || []).map((file)=>file.file_name);
    if (new Set(fileNames).size !== fileNames.length) {
      return jsonResponse({
        error: "يجب أن تكون أسماء ملفات النسخة فريدة."
      }, 400);
    }
    const { data: project, error: projectError } = await serviceClient.from("service_projects").select("id").eq("id", body.projectId).maybeSingle();
    if (projectError) return databaseError(projectError, "التحقق من المشروع");
    if (!project) return jsonResponse({
      error: "المشروع غير موجود."
    }, 404);
    const documentRow = {
      project_id: body.projectId,
      version: body.version,
      changelog_ar: typeof body.changelogAr === "string" ? body.changelogAr.slice(0, 3000) : "",
      changelog_en: typeof body.changelogEn === "string" ? body.changelogEn.slice(0, 3000) : "",
      documentation: body.documentation,
      private_files: body.privateFiles || [],
      source_document: typeof body.sourceDocument === "string" ? body.sourceDocument.slice(0, 300) : null,
      published_at: new Date().toISOString()
    };
    const { data, error } = await serviceClient.from("service_project_document_versions").insert(documentRow).select("id, project_id, version, published_at").single();
    if (error) return databaseError(error, "نشر نسخة توثيق المشروع");
    return jsonResponse({
      success: true,
      document: data
    });
  }
  if (action === "image_upload") {
    const resourceId = isUuid(body.categoryId) ? body.categoryId : body.projectId;
    if (!isUuid(resourceId) || body.categoryId !== undefined && body.projectId !== undefined || body.categoryId !== undefined && !isUuid(body.categoryId) || body.projectId !== undefined && !isUuid(body.projectId) || typeof body.contentType !== "string" || !imageTypes.has(body.contentType) || typeof body.base64 !== "string") {
      return jsonResponse({
        error: "صيغة الصورة غير صالحة."
      }, 400);
    }
    const base64 = body.base64.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "");
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64) || base64.length > 7_000_000) {
      return jsonResponse({
        error: "حجم الصورة يتجاوز الحد المسموح."
      }, 400);
    }
    const bytes = Uint8Array.from(atob(base64), (character)=>character.charCodeAt(0));
    if (bytes.length > 5 * 1024 * 1024) return jsonResponse({
      error: "حجم الصورة يجب ألا يتجاوز 5 ميجابايت."
    }, 400);
    const resourcePath = isUuid(body.categoryId) ? `categories/${body.categoryId}` : resourceId;
    const path = `${resourcePath}/${crypto.randomUUID()}.${imageTypes.get(body.contentType)}`;
    const { error } = await serviceClient.storage.from("techsphere-project-images").upload(path, bytes, {
      contentType: body.contentType,
      upsert: false
    });
    if (error) return databaseError(error, "رفع الصورة");
    const { data: { publicUrl } } = serviceClient.storage.from("techsphere-project-images").getPublicUrl(path);
    return jsonResponse({
      success: true,
      imageUrl: publicUrl,
      path
    });
  }
  if (action === "private_upload_url") {
    if (!isUuid(body.projectId) || !boundedText(body.fileName, 1, 180) || typeof body.contentType !== "string" || !privateFileTypes.has(body.contentType)) {
      return jsonResponse({
        error: "بيانات الملف الخاص غير صالحة."
      }, 400);
    }
    const path = `${body.projectId}/${crypto.randomUUID()}-${safePathSegment(body.fileName)}`;
    const { data, error } = await serviceClient.storage.from("techsphere-project-private").createSignedUploadUrl(path, {
      upsert: false
    });
    if (error) return databaseError(error, "إنشاء رابط رفع آمن");
    return jsonResponse({
      success: true,
      path,
      token: data.token,
      signedUrl: data.signedUrl
    });
  }
  if (action === "order_confirm") {
    if (!isUuid(body.orderId)) return jsonResponse({
      error: "رقم الطلب غير صالح."
    }, 400);
    if (!session.email || session.email.trim().length < 3) return jsonResponse({
      error: "معرّف المسؤول غير صالح."
    }, 400);
    try {
      const { data, error } = await serviceClient.rpc("techsphere_service_project_confirm_order_v1", {
        p_order_id: body.orderId,
        p_confirmed_by: session.email
      });
      if (error) {
        console.error("Unable to confirm project order:", error.message);
        return jsonResponse({
          error: "تعذر تأكيد الطلب أو أن العميل يملك صلاحية فعالة بالفعل."
        }, 409);
      }
      return jsonResponse({
        success: true,
        access: data?.[0] || null
      });
    } catch (err) {
      console.error("Unexpected error confirming order:", err);
      return jsonResponse({
        error: "حدث خطأ غير متوقع أثناء تأكيد الطلب."
      }, 500);
    }
  }
  if (action === "order_reject") {
    if (!isUuid(body.orderId)) return jsonResponse({
      error: "رقم الطلب غير صالح."
    }, 400);
    const { data, error } = await serviceClient.from("service_project_orders").update({
      payment_status: "rejected",
      admin_note: typeof body.note === "string" ? body.note.slice(0, 2000) : ""
    }).eq("id", body.orderId).eq("payment_status", "pending").select("id, payment_status").maybeSingle();
    if (error) return databaseError(error, "رفض طلب المشروع");
    if (!data) return jsonResponse({
      error: "لا يمكن رفض الطلب؛ ربما تمت معالجته بالفعل."
    }, 409);
    return jsonResponse({
      success: true,
      order: data
    });
  }
  if (action === "activation_code_issue") {
    if (!isUuid(body.orderId)) return jsonResponse({
      error: "رقم الطلب غير صالح."
    }, 400);
    const code = createActivationCode();
    const codeHash = await sha256(code);
    let expiresAt = null;
    if (body.expiresInDays !== undefined) {
      if (!Number.isInteger(body.expiresInDays) || Number(body.expiresInDays) < 1 || Number(body.expiresInDays) > 365) {
        return jsonResponse({
          error: "مدة صلاحية الرمز يجب أن تكون من يوم إلى 365 يومًا."
        }, 400);
      }
      expiresAt = new Date(Date.now() + Number(body.expiresInDays) * 86_400_000).toISOString();
    }
    const { data, error } = await serviceClient.rpc("techsphere_service_project_issue_code_v1", {
      p_order_id: body.orderId,
      p_code_hash: codeHash,
      p_admin: session.email,
      p_code_expires_at: expiresAt
    });
    if (error) {
      console.error("Unable to issue activation code:", error.message);
      const reason = String(error.message || "");
      if (reason.includes("Only pending")) {
        return jsonResponse({
          error: "لا يمكن إصدار رمز لهذا الطلب لأنه لم يعد معلّقًا: سبق تأكيده أو رفضه."
        }, 409);
      }
      if (reason.includes("already has active access")) {
        return jsonResponse({
          error: "العميل يملك صلاحية فعّالة لهذا المشروع بالفعل."
        }, 409);
      }
      return jsonResponse({
        error: "تعذر إصدار الرمز. تحقق من حالة الطلب والصلاحية الحالية."
      }, 409);
    }
    return jsonResponse({
      success: true,
      code,
      activation: data?.[0] || null
    });
  }
  if (action === "activation_code_reissue") {
    if (!isUuid(body.orderId)) return jsonResponse({
      error: "رقم الطلب غير صالح."
    }, 400);
    let expiresAt = null;
    if (body.expiresInDays !== undefined) {
      if (!Number.isInteger(body.expiresInDays) || Number(body.expiresInDays) < 1 || Number(body.expiresInDays) > 365) {
        return jsonResponse({
          error: "مدة صلاحية الرمز يجب أن تكون من يوم إلى 365 يومًا."
        }, 400);
      }
      expiresAt = new Date(Date.now() + Number(body.expiresInDays) * 86_400_000).toISOString();
    }
    const { data: order, error: orderError } = await serviceClient.from("service_project_orders").select("id, user_id, project_id, payment_status, payment_method, order_reference").eq("id", body.orderId).maybeSingle();
    if (orderError) return databaseError(orderError, "التحقق من طلب إعادة إصدار الرمز");
    if (!order) return jsonResponse({
      error: "طلب المشروع غير موجود."
    }, 404);
    if (order.payment_status !== "confirmed" || order.payment_method !== "activation_code") {
      return jsonResponse({
        error: "إعادة الإصدار متاحة للطلبات المؤكدة التي صدر لها رمز سابق فقط. استخدم إصدار صلاحية مباشرة بدلًا من رمز."
      }, 409);
    }
    const { data: activeAccess, error: activeAccessError } = await serviceClient.from("service_project_access").select("id, expires_at").eq("user_id", order.user_id).eq("project_id", order.project_id).eq("status", "active").gt("expires_at", new Date().toISOString()).limit(1).maybeSingle();
    if (activeAccessError) return databaseError(activeAccessError, "التحقق من صلاحية العميل");
    if (activeAccess) {
      return jsonResponse({
        error: `العميل يملك صلاحية فعّالة حتى ${String(activeAccess.expires_at).slice(0, 10)}، فلا حاجة لرمز جديد.`
      }, 409);
    }
    const { data: previousCodes, error: codesError } = await serviceClient.from("service_project_activation_codes").select("id").eq("order_id", order.id).order("created_at", {
      ascending: false
    });
    if (codesError) return databaseError(codesError, "قراءة رموز الطلب السابقة");
    if (!previousCodes?.length) {
      return jsonResponse({
        error: "لا يوجد رمز سابق على هذا الطلب. استخدم إصدار صلاحية مباشرة بدلًا من رمز."
      }, 409);
    }
    const code = createActivationCode();
    const codeHash = await sha256(code);
    const issuedAt = new Date().toISOString();
    let reissued = null;
    const { data: inserted, error: insertError } = await serviceClient.from("service_project_activation_codes").insert({
      order_id: order.id,
      project_id: order.project_id,
      code_hash: codeHash,
      expires_at: expiresAt,
      created_by: session.email
    }).select("id, order_id, expires_at").maybeSingle();
    if (!insertError && inserted?.id) {
      reissued = inserted;
      // Older codes for the same order must stop working the moment a new one exists.
      const { error: revokePreviousError } = await serviceClient.from("service_project_activation_codes").update({
        revoked_at: issuedAt
      }).eq("order_id", order.id).neq("id", inserted.id).is("redeemed_at", null).is("revoked_at", null);
      if (revokePreviousError) {
        console.error("Unable to retire the previous activation code:", revokePreviousError.message);
      }
    } else if (insertError?.code === "23505") {
      // Schema still allows one code per order: replace that row in place.
      const { data: replaced, error: replaceError } = await serviceClient.from("service_project_activation_codes").update({
        code_hash: codeHash,
        expires_at: expiresAt,
        redeemed_by: null,
        redeemed_at: null,
        revoked_at: null,
        created_by: session.email,
        created_at: issuedAt
      }).eq("id", previousCodes[0].id).select("id, order_id, expires_at").maybeSingle();
      if (replaceError) {
        console.error("Unable to reissue activation code (in place):", replaceError.message);
        return jsonResponse({
          error: "تعذر إعادة إصدار الرمز. حاول مرة أخرى بعد لحظات."
        }, 500);
      }
      reissued = replaced;
    } else {
      console.error("Unable to reissue activation code:", insertError?.message || "empty insert result");
      return jsonResponse({
        error: "تعذر إعادة إصدار الرمز. حاول مرة أخرى بعد لحظات."
      }, 500);
    }
    console.info("Activation code reissued:", JSON.stringify({
      orderId: order.id,
      orderReference: order.order_reference,
      admin: session.email,
      previousCodeIds: previousCodes.map((row)=>row.id),
      expiresAt
    }));
    return jsonResponse({
      success: true,
      code,
      activation: reissued
    });
  }
  if (action === "order_reassign_user") {
    if (!isUuid(body.orderId)) return jsonResponse({
      error: "رقم الطلب غير صالح."
    }, 400);
    const targetEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (targetEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(targetEmail)) {
      return jsonResponse({
        error: "اكتب بريد الحساب الصحيح الذي يجب أن يملك الطلب."
      }, 400);
    }
    const { data: order, error: orderError } = await serviceClient.from("service_project_orders").select("id, user_id, project_id, payment_status, payment_method, order_reference, admin_note").eq("id", body.orderId).maybeSingle();
    if (orderError) return databaseError(orderError, "التحقق من الطلب");
    if (!order) return jsonResponse({
      error: "طلب المشروع غير موجود."
    }, 404);
    const { data: targetProfile, error: targetError } = await serviceClient.from("profiles").select("id, full_name, email").ilike("email", targetEmail).limit(1).maybeSingle();
    if (targetError) return databaseError(targetError, "البحث عن حساب العميل");
    if (!targetProfile) {
      return jsonResponse({
        error: `لا يوجد حساب مسجّل بالبريد ${targetEmail}.`
      }, 404);
    }
    if (targetProfile.id === order.user_id) {
      return jsonResponse({
        error: "الطلب مسجّل على هذا الحساب بالفعل."
      }, 409);
    }
    const { data: existingAccess, error: accessError } = await serviceClient.from("service_project_access").select("id").eq("order_id", order.id).limit(1).maybeSingle();
    if (accessError) return databaseError(accessError, "التحقق من صلاحية الطلب");
    if (existingAccess) {
      return jsonResponse({
        error: "هذا الطلب أنتج صلاحية وصول فعلية، فلا يمكن نقل ملكيته. أوقف الصلاحية أولًا إن كان النقل مطلوبًا."
      }, 409);
    }
    const { data: orderCodes, error: orderCodesError } = await serviceClient.from("service_project_activation_codes").select("id, redeemed_at").eq("order_id", order.id);
    if (orderCodesError) return databaseError(orderCodesError, "قراءة رموز الطلب");
    if ((orderCodes || []).some((row)=>row.redeemed_at)) {
      return jsonResponse({
        error: "الرمز المرتبط بهذا الطلب استُخدم بالفعل، فلا يمكن نقل الملكية. أعد إصدار رمز جديد بعد النقل."
      }, 409);
    }
    if (order.payment_status === "pending") {
      const { data: duplicateOrder, error: duplicateError } = await serviceClient.from("service_project_orders").select("id").eq("user_id", targetProfile.id).eq("project_id", order.project_id).eq("payment_status", "pending").neq("id", order.id).limit(1).maybeSingle();
      if (duplicateError) return databaseError(duplicateError, "التحقق من طلبات الحساب الجديد");
      if (duplicateOrder) {
        return jsonResponse({
          error: "الحساب الجديد عنده طلب معلّق لنفس المشروع بالفعل؛ لن يُسمح بوجود طلبين معلّقين."
        }, 409);
      }
    }
    const { data: previousProfile } = await serviceClient.from("profiles").select("id, full_name, email").eq("id", order.user_id).maybeSingle();
    const auditLine = `[${new Date().toISOString()}] order reassigned from ` + `${previousProfile?.email || order.user_id} to ${targetProfile.email} by ${session.email}`;
    const adminNote = `${order.admin_note ? `${order.admin_note}\n` : ""}${auditLine}`.slice(-2000);
    const { data: updated, error: updateError } = await serviceClient.from("service_project_orders").update({
      user_id: targetProfile.id,
      admin_note: adminNote
    }).eq("id", order.id).select("id, order_reference, user_id, project_id, payment_status, payment_method").maybeSingle();
    if (updateError?.code === "23505") {
      return jsonResponse({
        error: "الحساب الجديد عنده طلب معلّق لنفس المشروع بالفعل؛ لن يُسمح بوجود طلبين معلّقين."
      }, 409);
    }
    if (updateError) {
      console.error("Unable to reassign project order:", updateError.message);
      return jsonResponse({
        error: "تعذر نقل ملكية الطلب. حاول مرة أخرى بعد لحظات."
      }, 500);
    }
    console.info("Project order reassigned:", JSON.stringify({
      orderId: order.id,
      orderReference: order.order_reference,
      from: previousProfile?.email || order.user_id,
      to: targetProfile.email,
      admin: session.email
    }));
    return jsonResponse({
      success: true,
      order: updated,
      previousCustomer: previousProfile || null,
      customer: targetProfile
    });
  }
  if (action === "access_extend") {
    if (!isUuid(body.accessId) || !Number.isInteger(body.months) || Number(body.months) < 1 || Number(body.months) > 24) {
      return jsonResponse({
        error: "مدة التمديد أو معرّف الصلاحية غير صالح."
      }, 400);
    }
    const { data, error } = await serviceClient.rpc("techsphere_service_project_extend_access_v1", {
      p_access_id: body.accessId,
      p_months: body.months,
      p_admin: session.email
    });
    if (error) {
      console.error("Unable to extend project access:", error.message);
      return jsonResponse({
        error: "تعذر تمديد صلاحية المشروع."
      }, 409);
    }
    return jsonResponse({
      success: true,
      access: data?.[0] || null
    });
  }
  if (action === "access_revoke") {
    if (!isUuid(body.accessId)) return jsonResponse({
      error: "معرّف الصلاحية غير صالح."
    }, 400);
    const { data, error } = await serviceClient.from("service_project_access").update({
      status: "revoked",
      revoked_at: new Date().toISOString(),
      revoked_by: session.email,
      admin_note: typeof body.note === "string" ? body.note.slice(0, 2000) : ""
    }).eq("id", body.accessId).neq("status", "revoked").select("id, status, revoked_at").maybeSingle();
    if (error) return databaseError(error, "إيقاف صلاحية المشروع");
    if (!data) return jsonResponse({
      error: "الصلاحية غير موجودة أو متوقفة بالفعل."
    }, 404);
    return jsonResponse({
      success: true,
      access: data
    });
  }
  if (action === "project_request_list") {
    const page = Math.max(1, Number(body.page) || 1);
    const pageSize = Math.min(50, Math.max(1, Number(body.pageSize) || 20));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    let query = serviceClient.from("project_requests").select(`
                id, order_number, project_id, category_id, user_id,
                buyer_name, buyer_phone, buyer_email, delivery_address,
                min_budget, max_budget, budget_currency, delivery_deadline,
                additional_message, status, access_granted, access_granted_by,
                access_granted_at, created_at, updated_at,
                service_projects!inner (slug, title_ar, title_en, project_code),
                service_project_categories!inner (slug, title_ar, title_en)
            `, {
      count: "exact"
    });
    if (boundedText(body.search, 1, 200)) {
      const search = body.search.trim();
      query = query.or(`buyer_name.ilike.%${search}%,buyer_phone.ilike.%${search}%,` + `buyer_email.ilike.%${search}%,order_number.ilike.%${search}%,` + `service_projects.title_en.ilike.%${search}%,service_projects.title_ar.ilike.%${search}%`);
    }
    if (isUuid(body.category_id)) {
      query = query.eq("category_id", body.category_id);
    }
    if (boundedText(body.status, 1, 40)) {
      query = query.eq("status", body.status);
    }
    const orderBy = body.sort === "created_at_asc" ? {
      column: "created_at",
      ascending: true
    } : {
      column: "created_at",
      ascending: false
    };
    query = query.order(orderBy.column, {
      ascending: orderBy.ascending
    }).range(from, to);
    const { data, error, count } = await query;
    if (error) return databaseError(error, "قائمة طلبات عروض الأسعار");
    return jsonResponse({
      requests: data || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil((count || 0) / pageSize))
    });
  }
  if (action === "project_request_get") {
    if (!isUuid(body.id)) return jsonResponse({
      error: "معرّف الطلب غير صالح."
    }, 400);
    const { data, error } = await serviceClient.from("project_requests").select(`
                *,
                service_projects (slug, title_ar, title_en, project_code, image_url, image_alt_text, public_description_ar, public_description_en),
                service_project_categories (slug, title_ar, title_en)
            `).eq("id", body.id).maybeSingle();
    if (error) return databaseError(error, "تفاصيل طلب عرض السعر");
    if (!data) return jsonResponse({
      error: "الطلب غير موجود."
    }, 404);
    return jsonResponse({
      request: data
    });
  }
  if (action === "order_status_update") {
    if (!isUuid(body.id)) return jsonResponse({
      error: "معرّف الطلب غير صالح."
    }, 400);
    if (!boundedText(body.status, 1, 40) || ![
      "pending_review",
      "contacted",
      "negotiating",
      "approved",
      "in_progress",
      "completed",
      "rejected"
    ].includes(body.status)) {
      return jsonResponse({
        error: "حالة الطلب غير صالحة."
      }, 400);
    }
    const { data, error } = await serviceClient.from("project_requests").update({
      status: body.status,
      updated_at: new Date().toISOString()
    }).eq("id", body.id).select("id, order_number, status, updated_at").maybeSingle();
    if (error) return databaseError(error, "تحديث حالة الطلب");
    if (!data) return jsonResponse({
      error: "الطلب غير موجود."
    }, 404);
    return jsonResponse({
      success: true,
      request: data
    });
  }
  if (action === "order_delete") {
    if (typeof body.id !== "string" || body.id.trim().length === 0) return jsonResponse({
      error: "معرّف الطلب غير صالح."
    }, 400);
    const source = body.source || "service_order";
    if (source === "project_request") {
      // 1. Delete dependent download logs first (they reference service_project_access.id ON DELETE RESTRICT)
      const { data: accessRows } = await serviceClient
        .from("service_project_access")
        .select("id")
        .eq("request_id", body.id);
      if (accessRows?.length) {
        await serviceClient
          .from("service_project_download_logs")
          .delete()
          .in("access_id", accessRows.map((a) => a.id));
      }
      // 2. Delete dependent access records next (they reference project_requests.id ON DELETE RESTRICT)
      await serviceClient.from("service_project_access").delete().eq("request_id", body.id);
      const { data, error } = await serviceClient.from("project_requests").delete().eq("id", body.id).select("id").maybeSingle();
      if (error) return databaseError(error, "حذف طلب عرض السعر");
      if (!data) return jsonResponse({
        error: "طلب عرض السعر غير موجود."
      }, 404);
      return jsonResponse({
        success: true,
        id: data.id
      });
    } else {
      // Delete dependent records first due to ON DELETE RESTRICT foreign keys
      await serviceClient.from("service_project_activation_codes").delete().eq("order_id", body.id);
      await serviceClient.from("service_project_access").delete().eq("order_id", body.id);
      const { data, error } = await serviceClient.from("service_project_orders").delete().eq("id", body.id).select("id").maybeSingle();
      if (error) return databaseError(error, "حذف الطلب");
      if (!data) return jsonResponse({
        error: "الطلب غير موجود."
      }, 404);
      return jsonResponse({
        success: true,
        id: data.id
      });
    }
  }
  if (action === "project_access_grant") {
    if (!isUuid(body.id)) return jsonResponse({
      error: "معرّف الطلب غير صالح."
    }, 400);
    const { data: request, error: requestError } = await serviceClient.from("project_requests").select("id, order_number, project_id, category_id, user_id, buyer_name, buyer_email, status, access_granted").eq("id", body.id).maybeSingle();
    if (requestError) return databaseError(requestError, "التحقق من الطلب");
    if (!request) return jsonResponse({
      error: "الطلب غير موجود."
    }, 404);
    if (request.access_granted) {
      return jsonResponse({
        error: "تم منح صلاحية الوصول لهذا الطلب بالفعل."
      }, 409);
    }
    if (request.status !== "approved" && request.status !== "in_progress") {
      return jsonResponse({
        error: "لا يمكن منح الوصول إلا بعد اعتماد الطلب أو بدء التنفيذ."
      }, 403);
    }
    if (!request.user_id) {
      return jsonResponse({
        error: "الطلب غير مرتبط بمستخدم مسجل، لا يمكن منح الوصول."
      }, 400);
    }
    const { data: existingAccess, error: existingError } = await serviceClient.from("service_project_access").select("id, status").eq("user_id", request.user_id).eq("project_id", request.project_id).eq("status", "active").limit(1).maybeSingle();
    if (existingError) return databaseError(existingError, "التحقق من الصلاحية القائمة");
    if (existingAccess) {
      return jsonResponse({
        error: "العميل يملك صلاحية نشطة لهذا المشروع بالفعل."
      }, 409);
    }
    const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
    const { data: access, error: accessError } = await serviceClient.from("service_project_access").insert({
      user_id: request.user_id,
      project_id: request.project_id,
      order_id: null,
      request_id: request.id,
      status: "active",
      activated_at: new Date().toISOString(),
      expires_at: expiresAt,
      granted_by: session.email,
      admin_note: typeof body.note === "string" ? body.note.slice(0, 2000) : ""
    }).select("id, status, activated_at, expires_at").single();
    if (accessError) return databaseError(accessError, "منح صلاحية الوصول للمشروع");
    const { error: updateError } = await serviceClient.from("project_requests").update({
      access_granted: true,
      access_granted_by: session.email,
      access_granted_at: new Date().toISOString(),
      status: "approved",
      updated_at: new Date().toISOString()
    }).eq("id", body.id);
    if (updateError) return databaseError(updateError, "تحديث حالة منح الوصول");
    return jsonResponse({
      success: true,
      access,
      order_number: request.order_number
    });
  }
  if (action === "analytics") {
    const [ordersResult, accessResult] = await Promise.all([
      serviceClient.from("service_project_orders").select("project_id, amount, currency_code, order_type, confirmed_at").eq("payment_status", "confirmed"),
      serviceClient.from("service_project_access").select("id, status, expires_at, project_id")
    ]);
    if (ordersResult.error) return databaseError(ordersResult.error, "تحميل إحصاءات المبيعات");
    if (accessResult.error) return databaseError(accessResult.error, "تحميل إحصاءات الصلاحيات");
    const orders = ordersResult.data || [];
    const accessRows = accessResult.data || [];
    const now = Date.now();
    const revenueByCurrency = new Map();
    const salesByProject = new Map();
    const monthlyRevenue = new Map();
    let renewals = 0;
    for (const order of orders){
      revenueByCurrency.set(order.currency_code, (revenueByCurrency.get(order.currency_code) || 0) + Number(order.amount));
      salesByProject.set(order.project_id, (salesByProject.get(order.project_id) || 0) + 1);
      if (order.order_type === "renewal") renewals += 1;
      if (order.confirmed_at) {
        const month = String(order.confirmed_at).slice(0, 7);
        monthlyRevenue.set(month, (monthlyRevenue.get(month) || 0) + Number(order.amount));
      }
    }
    const activeAccessCount = accessRows.filter((row)=>row.status === "active" && new Date(row.expires_at).getTime() > now).length;
    const expiredAccessCount = accessRows.filter((row)=>row.status === "expired" || new Date(row.expires_at).getTime() <= now).length;
    const projectIds = [
      ...salesByProject.keys()
    ];
    const projectResult = projectIds.length ? await serviceClient.from("service_projects").select("id, project_code, title_ar, title_en").in("id", projectIds) : {
      data: [],
      error: null
    };
    if (projectResult.error) return databaseError(projectResult.error, "تحميل المشاريع الأكثر مبيعًا");
    const projectById = new Map((projectResult.data || []).map((project)=>[
        project.id,
        project
      ]));
    return jsonResponse({
      totalOrders: orders.length,
      totalRevenue: Object.fromEntries(revenueByCurrency),
      activeAccessCount,
      expiredAccessCount,
      renewalOrders: renewals,
      salesByProject: [
        ...salesByProject.entries()
      ].map(([projectId, count])=>({
          project: projectById.get(projectId) || null,
          count
        })).sort((left, right)=>right.count - left.count),
      monthlyRevenue: [
        ...monthlyRevenue.entries()
      ].sort(([left], [right])=>left.localeCompare(right))
    });
  }
  return jsonResponse({
    error: "الإجراء المطلوب غير معروف."
  }, 400);
});
