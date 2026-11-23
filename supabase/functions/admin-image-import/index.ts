import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-import-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed." }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const imageImportSecret = Deno.env.get("IMAGE_IMPORT_SECRET");

  if (!supabaseUrl || !anonKey || !serviceRoleKey || !imageImportSecret) {
    console.error("admin-image-import function is missing required Supabase secrets.");
    return jsonResponse({ error: "خدمة استيراد الصور غير مكتملة الإعداد." }, 500);
  }

  // ---- Authentication via IMAGE_IMPORT_SECRET ----
  const providedSecret = request.headers.get("X-Import-Secret");
  if (!providedSecret || providedSecret !== imageImportSecret) {
    return jsonResponse({ error: "غير مصرح. سر الاستيراد غير صالح أو مفقود." }, 401);
  }

  // ---- Service role client for DB writes ----
  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  // ---- Parse request body ----
  let parsedBody: unknown;
  try {
    parsedBody = await request.json();
  } catch {
    return jsonResponse({ error: "بيانات الطلب غير صالحة." }, 400);
  }

  if (!isRecord(parsedBody)) {
    return jsonResponse({ error: "بيانات الطلب يجب أن تكون كائنًا." }, 400);
  }

  const action = parsedBody.action;
  if (action !== "import_batch") {
    return jsonResponse({ error: "إجراء غير مدعوم. استخدم action: 'import_batch'." }, 400);
  }

  const batch = parsedBody.batch;
  if (!Array.isArray(batch) || batch.length === 0) {
    return jsonResponse({ error: "حقل batch يجب أن يكون مصفوفة غير فارغة." }, 400);
  }
  if (batch.length > 20) {
    return jsonResponse({ error: "حد أقصى 20 مشروعًا لكل دفعة." }, 400);
  }

  // Always overwrite - no skip logic
  // ---- Process each item in the batch ----
  const results: Array<{
    project_code: string;
    status: "updated" | "skipped" | "failed";
    message: string;
  }> = [];

  for (const item of batch) {
    const projectCode = typeof item.project_code === "string" ? item.project_code.trim() : "";
    const imageUrl = typeof item.image_url === "string" && item.image_url.trim().length > 0 ? item.image_url.trim() : null;
    const imageAltText = typeof item.image_alt_text === "string" ? item.image_alt_text.trim() : "";
    const imageSource = typeof item.image_source === "string" ? item.image_source.trim() : "Wikimedia Commons (free license)";

    if (!projectCode || !/^TXH-[A-Z]{2,4}-[0-9]{3,6}$/.test(projectCode)) {
      results.push({
        project_code: projectCode || "UNKNOWN",
        status: "failed",
        message: "رمز مشروع غير صالح."
      });
      continue;
    }

    if (!imageUrl) {
      results.push({
        project_code: projectCode,
        status: "failed",
        message: "رابط الصورة مطلوب."
      });
      continue;
    }

    try {
      // Resolve project by project_code
      const { data: project, error: projError } = await serviceClient
        .from("service_projects")
        .select("id, image_url, project_code")
        .eq("project_code", projectCode)
        .maybeSingle();

      if (projError) {
        results.push({
          project_code: projectCode,
          status: "failed",
          message: `تعذر البحث عن المشروع: ${projError.message}`
        });
        continue;
      }

      if (!project) {
        results.push({
          project_code: projectCode,
          status: "failed",
          message: "المشروع غير موجود في قاعدة البيانات."
        });
        continue;
      }

      // Always update - no skip logic

      // Update only the three image fields
      const { error: updateError } = await serviceClient
        .from("service_projects")
        .update({
          image_url: imageUrl,
          image_source_url: imageSource,
          image_alt_text: imageAltText || `${projectCode} project image`
        })
        .eq("id", project.id);

      if (updateError) {
        results.push({
          project_code: projectCode,
          status: "failed",
          message: `فشل التحديث: ${updateError.message}`
        });
        continue;
      }

      results.push({
        project_code: projectCode,
        status: "updated",
        message: "تم تحديث الصورة بنجاح."
      });
    } catch (err) {
      results.push({
        project_code: projectCode,
        status: "failed",
        message: err instanceof Error ? err.message : "خطأ غير معروف."
      });
    }
  }

  // ---- Build summary ----
  const updated = results.filter((r) => r.status === "updated").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const failed = results.filter((r) => r.status === "failed").length;

  return jsonResponse({
    ok: true,
    batch_size: batch.length,
    updated,
    skipped,
    failed,
    results,
    processed_by: "image_import_system"
  }, 200);
});