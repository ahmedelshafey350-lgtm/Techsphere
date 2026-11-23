import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
const requestStatuses = new Set([
  "new",
  "reviewing",
  "contacted",
  "accepted",
  "rejected",
  "completed"
]);
const moderationStatuses = new Set([
  "approved",
  "rejected"
]);
const courseDifficulties = new Set([
  "beginner",
  "intermediate",
  "advanced"
]);
const discountTypes = new Set([
  "percentage",
  "fixed_amount",
  "fixed_price"
]);
const courseImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp"
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
function jsonResponseError(error, label) {
  console.error(`${label}:`, error.message);
  return jsonResponse({
    error: `تعذر تنفيذ ${label}.`
  }, 500);
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
  const configuredAdmins = Deno.env.get("ADMIN_EMAILS");
  if (!supabaseUrl || !anonKey || !serviceRoleKey || !configuredAdmins) {
    console.error("Admin requests function is missing required Supabase secrets.");
    return jsonResponse({
      error: "خدمة الإدارة غير مكتملة الإعداد."
    }, 500);
  }
  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return jsonResponse({
      error: "سجّل الدخول بحساب الإدارة."
    }, 401);
  }
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
  const { data: { user }, error: userError } = await userClient.auth.getUser(token);
  if (userError || !user?.email) {
    return jsonResponse({
      error: "جلسة الإدارة غير صالحة أو البريد غير مؤكد."
    }, 401);
  }
  const adminEmails = configuredAdmins.split(",").map((email)=>email.trim().toLowerCase());
  const isAdmin = adminEmails.includes(user.email.toLowerCase());
  let parsedBody;
  try {
    parsedBody = await request.json();
  } catch  {
    return jsonResponse({
      error: "بيانات الطلب غير صالحة."
    }, 400);
  }
  if (!parsedBody || typeof parsedBody !== "object" || Array.isArray(parsedBody)) {
    return jsonResponse({
      error: "بيانات الطلب غير صالحة."
    }, 400);
  }
  const body = parsedBody;
  if (body.action === "check_admin") {
    return jsonResponse({
      isAdmin
    });
  }
  if (!isAdmin) {
    return jsonResponse({
      error: "هذا الحساب غير مصرح له بلوحة الإدارة."
    }, 403);
  }
  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
  if (body.action === "course_list") {
    const [coursesResult, chaptersResult, topicsResult, discountsResult] = await Promise.all([
      serviceClient.from("courses").select("*").order("created_at", {
        ascending: false
      }),
      serviceClient.from("course_chapters").select("*").order("sort_order"),
      serviceClient.from("chapter_topics").select("*").order("sort_order"),
      serviceClient.from("course_discounts").select("*").order("created_at", {
        ascending: false
      })
    ]);
    const failedResult = [
      coursesResult,
      chaptersResult,
      topicsResult,
      discountsResult
    ].find((result)=>result.error);
    if (failedResult?.error) return jsonResponseError(failedResult.error, "تحميل إدارة الكورسات");
    const topicsByChapter = new Map();
    for (const topic of topicsResult.data || []){
      const existing = topicsByChapter.get(topic.chapter_id) || [];
      existing.push(topic);
      topicsByChapter.set(topic.chapter_id, existing);
    }
    const chaptersByCourse = new Map();
    for (const chapter of chaptersResult.data || []){
      const existing = chaptersByCourse.get(chapter.course_id) || [];
      existing.push({
        ...chapter,
        topics: topicsByChapter.get(chapter.id) || []
      });
      chaptersByCourse.set(chapter.course_id, existing);
    }
    const discountsByCourse = new Map();
    for (const discount of discountsResult.data || []){
      const existing = discountsByCourse.get(discount.course_id) || [];
      existing.push(discount);
      discountsByCourse.set(discount.course_id, existing);
    }
    return jsonResponse({
      courses: (coursesResult.data || []).map((course)=>({
          ...course,
          chapters: chaptersByCourse.get(course.id) || [],
          discounts: discountsByCourse.get(course.id) || []
        }))
    });
  }
  if (body.action === "course_preview") {
    const courseId = typeof body.id === "string" ? body.id : "";
    if (!isUuid(courseId) && !/^\d+$/.test(courseId)) {
      return jsonResponse({
        error: "معرّف الكورس غير صالح."
      }, 400);
    }
    let query = serviceClient.from("courses").select("*");
    query = isUuid(courseId) ? query.eq("id", courseId) : query.eq("legacy_id", Number(courseId));
    const { data: course, error } = await query.maybeSingle();
    if (error) return jsonResponseError(error, "تحميل معاينة الكورس");
    if (!course) return jsonResponse({
      error: "الكورس غير موجود."
    }, 404);
    const [chaptersResult, discountsResult] = await Promise.all([
      serviceClient.from("course_chapters").select("*").eq("course_id", course.id).order("sort_order"),
      serviceClient.from("course_discounts").select("*").eq("course_id", course.id).order("created_at", {
        ascending: false
      })
    ]);
    if (chaptersResult.error) return jsonResponseError(chaptersResult.error, "تحميل فصول المعاينة");
    if (discountsResult.error) return jsonResponseError(discountsResult.error, "تحميل خصومات المعاينة");
    const chapterIds = (chaptersResult.data || []).map((chapter)=>chapter.id);
    const topicsResult = chapterIds.length ? await serviceClient.from("chapter_topics").select("*").in("chapter_id", chapterIds).order("sort_order") : {
      data: [],
      error: null
    };
    if (topicsResult.error) return jsonResponseError(topicsResult.error, "تحميل دروس المعاينة");
    const topicsByChapter = new Map();
    for (const topic of topicsResult.data || []){
      const existing = topicsByChapter.get(topic.chapter_id) || [];
      existing.push(topic);
      topicsByChapter.set(topic.chapter_id, existing);
    }
    const now = Date.now();
    const currentDiscount = (discountsResult.data || []).find((discount)=>discount.is_active && new Date(discount.start_date).getTime() <= now && (!discount.end_date || new Date(discount.end_date).getTime() > now));
    let currentPrice = Number(course.original_price);
    let discountPercentage = null;
    if (currentDiscount) {
      const discountValue = Number(currentDiscount.discount_value);
      if (currentDiscount.discount_type === "percentage") {
        currentPrice = Math.round(currentPrice * (1 - discountValue / 100) * 100) / 100;
      } else if (currentDiscount.discount_type === "fixed_amount") {
        currentPrice = Math.max(0, currentPrice - discountValue);
      } else {
        currentPrice = Math.min(currentPrice, discountValue);
      }
      discountPercentage = Number(course.original_price) > 0 ? Math.round((Number(course.original_price) - currentPrice) / Number(course.original_price) * 10000) / 100 : 0;
    }
    return jsonResponse({
      course: {
        ...course,
        current_price: currentPrice,
        discount_percentage: discountPercentage,
        promotional_label: currentDiscount?.promotional_label || null,
        discount_end_date: currentDiscount?.end_date || null,
        chapters: (chaptersResult.data || []).map((chapter)=>({
            ...chapter,
            topics: topicsByChapter.get(chapter.id) || []
          }))
      }
    });
  }
  if (body.action === "course_save") {
    if (!isRecord(body.course)) return jsonResponse({
      error: "بيانات الكورس غير صالحة."
    }, 400);
    const course = body.course;
    if (!boundedText(course.slug, 2, 160) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(course.slug)) || !boundedText(course.title_en, 2, 200) || !boundedText(course.title_ar, 2, 200) || !boundedText(course.category, 2, 100) || typeof course.description_en !== "string" || typeof course.description_ar !== "string" || course.description_en.length > 10000 || course.description_ar.length > 10000 || !Array.isArray(course.technologies) || !course.technologies.every((technology)=>boundedText(technology, 1, 80)) || !Number.isFinite(course.original_price) || Number(course.original_price) < 0 || course.duration_months !== null && course.duration_months !== "" && (!Number.isFinite(course.duration_months) || Number(course.duration_months) <= 0) || course.difficulty !== null && !courseDifficulties.has(String(course.difficulty)) || typeof course.is_published !== "boolean") {
      return jsonResponse({
        error: "راجع بيانات الكورس والسعر والمدة والمستوى."
      }, 400);
    }
    if (course.id !== undefined && !isUuid(course.id)) {
      return jsonResponse({
        error: "معرّف الكورس غير صالح."
      }, 400);
    }
    if (course.legacy_id !== undefined && course.legacy_id !== null && (!Number.isInteger(course.legacy_id) || Number(course.legacy_id) < 0 || Number(course.legacy_id) > 7)) {
      return jsonResponse({
        error: "معرّف الكورس القديم غير صالح."
      }, 400);
    }
    const row = {
      ...course.id ? {
        id: course.id
      } : {},
      legacy_id: course.legacy_id ?? null,
      slug: String(course.slug).trim(),
      title_en: String(course.title_en).trim(),
      title_ar: String(course.title_ar).trim(),
      description_en: course.description_en.trim(),
      description_ar: course.description_ar.trim(),
      thumbnail_url: typeof course.thumbnail_url === "string" ? course.thumbnail_url : null,
      cover_url: typeof course.cover_url === "string" ? course.cover_url : null,
      category: String(course.category).trim(),
      technologies: course.technologies.map((technology)=>String(technology).trim()),
      difficulty: course.difficulty || null,
      duration_months: course.duration_months === "" ? null : course.duration_months,
      original_price: course.original_price,
      currency_code: typeof course.currency_code === "string" && /^[A-Z]{3}$/.test(course.currency_code) ? course.currency_code : "EGP",
      is_published: course.is_published
    };
    if (row.is_published && !course.id && course.legacy_id === null) {
      return jsonResponse({
        error: "احفظ الكورس كمسودة وأضف فصلًا ودرسًا واحدًا على الأقل قبل النشر."
      }, 400);
    }
    if (row.is_published && course.id && course.legacy_id === null) {
      const { data: chapterRows, error: chapterError } = await serviceClient.from("course_chapters").select("id").eq("course_id", course.id);
      if (chapterError) return jsonResponseError(chapterError, "التحقق من محتوى الكورس");
      if (!chapterRows?.length) {
        return jsonResponse({
          error: "أضف فصلًا ودرسًا واحدًا على الأقل قبل نشر الكورس."
        }, 400);
      }
      const { count, error: topicError } = await serviceClient.from("chapter_topics").select("id", {
        count: "exact",
        head: true
      }).in("chapter_id", chapterRows.map((chapter)=>chapter.id));
      if (topicError) return jsonResponseError(topicError, "التحقق من دروس الكورس");
      if (!count) {
        return jsonResponse({
          error: "أضف درسًا واحدًا على الأقل قبل نشر الكورس."
        }, 400);
      }
    }
    const query = course.id ? serviceClient.from("courses").update(row).eq("id", course.id) : serviceClient.from("courses").insert(row);
    const { data, error } = await query.select("*").single();
    if (error) return jsonResponseError(error, "حفظ الكورس");
    return jsonResponse({
      success: true,
      course: data
    });
  }
  if (body.action === "course_delete") {
    if (!isUuid(body.id)) return jsonResponse({
      error: "معرّف الكورس غير صالح."
    }, 400);
    const { data: course, error: courseError } = await serviceClient.from("courses").select("legacy_id").eq("id", body.id).maybeSingle();
    if (courseError) return jsonResponseError(courseError, "التحقق من ارتباطات الكورس");
    if (!course) return jsonResponse({
      error: "الكورس غير موجود."
    }, 404);
    if (course.legacy_id !== null) {
      const [requests, reviews] = await Promise.all([
        serviceClient.from("site_requests").select("id", {
          count: "exact",
          head: true
        }).eq("request_type", "course_enrollment").eq("course_id", course.legacy_id),
        serviceClient.from("course_reviews").select("id", {
          count: "exact",
          head: true
        }).eq("course_id", course.legacy_id)
      ]);
      if (requests.error) return jsonResponseError(requests.error, "التحقق من طلبات الكورس");
      if (reviews.error) return jsonResponseError(reviews.error, "التحقق من تقييمات الكورس");
      if ((requests.count || 0) > 0 || (reviews.count || 0) > 0) {
        return jsonResponse({
          error: "لا يمكن حذف كورس قديم مرتبط بطلبات أو تقييمات موجودة. يمكنك إلغاء نشره بدلًا من ذلك."
        }, 409);
      }
    }
    const { data, error } = await serviceClient.from("courses").delete().eq("id", body.id).select("id").maybeSingle();
    if (error) return jsonResponseError(error, "حذف الكورس");
    if (!data) return jsonResponse({
      error: "الكورس غير موجود."
    }, 404);
    return jsonResponse({
      success: true,
      id: data.id
    });
  }
  if (body.action === "chapter_save") {
    if (!isRecord(body.chapter)) return jsonResponse({
      error: "بيانات الفصل غير صالحة."
    }, 400);
    const chapter = body.chapter;
    if (!isUuid(chapter.course_id) || chapter.id !== undefined && !isUuid(chapter.id) || !boundedText(chapter.title_en, 1, 200) || !boundedText(chapter.title_ar, 1, 200) || typeof chapter.description_en !== "string" || typeof chapter.description_ar !== "string" || !Number.isInteger(chapter.sort_order) || Number(chapter.sort_order) < 0 || chapter.difficulty && !courseDifficulties.has(String(chapter.difficulty))) {
      return jsonResponse({
        error: "راجع عنوان الفصل والترتيب والمستوى."
      }, 400);
    }
    const fields = [
      "learning_objectives",
      "practical_applications",
      "real_world_examples",
      "tools_and_technologies",
      "exercises",
      "expected_outcomes"
    ];
    if (fields.some((field)=>{
      const value = chapter[field];
      return value !== undefined && (!isRecord(value) || !Array.isArray(value.en) || !Array.isArray(value.ar));
    })) {
      return jsonResponse({
        error: "قوائم محتوى الفصل يجب أن تكون مصفوفات بالعربية والإنجليزية."
      }, 400);
    }
    const row = {
      ...chapter.id ? {
        id: chapter.id
      } : {},
      course_id: chapter.course_id,
      title_en: String(chapter.title_en).trim(),
      title_ar: String(chapter.title_ar).trim(),
      description_en: chapter.description_en,
      description_ar: chapter.description_ar,
      learning_objectives: chapter.learning_objectives || {
        en: [],
        ar: []
      },
      duration_minutes: chapter.duration_minutes || null,
      difficulty: chapter.difficulty || null,
      practical_applications: chapter.practical_applications || {
        en: [],
        ar: []
      },
      real_world_examples: chapter.real_world_examples || {
        en: [],
        ar: []
      },
      tools_and_technologies: chapter.tools_and_technologies || {
        en: [],
        ar: []
      },
      exercises: chapter.exercises || {
        en: [],
        ar: []
      },
      expected_outcomes: chapter.expected_outcomes || {
        en: [],
        ar: []
      },
      sort_order: chapter.sort_order
    };
    const query = chapter.id ? serviceClient.from("course_chapters").update(row).eq("id", chapter.id) : serviceClient.from("course_chapters").insert(row);
    const { data, error } = await query.select("*").single();
    if (error) return jsonResponseError(error, "حفظ الفصل");
    return jsonResponse({
      success: true,
      chapter: data
    });
  }
  if (body.action === "chapter_delete" || body.action === "topic_delete") {
    if (!isUuid(body.id)) return jsonResponse({
      error: "معرّف العنصر غير صالح."
    }, 400);
    const table = body.action === "chapter_delete" ? "course_chapters" : "chapter_topics";
    const { data, error } = await serviceClient.from(table).delete().eq("id", body.id).select("id").maybeSingle();
    if (error) return jsonResponseError(error, "حذف العنصر");
    if (!data) return jsonResponse({
      error: "العنصر غير موجود."
    }, 404);
    return jsonResponse({
      success: true,
      id: data.id
    });
  }
  if (body.action === "topic_save") {
    if (!isRecord(body.topic)) return jsonResponse({
      error: "بيانات الموضوع غير صالحة."
    }, 400);
    const topic = body.topic;
    if (!isUuid(topic.chapter_id) || topic.id !== undefined && !isUuid(topic.id) || !boundedText(topic.title_en, 1, 200) || !boundedText(topic.title_ar, 1, 200) || !Number.isInteger(topic.sort_order) || Number(topic.sort_order) < 0 || typeof topic.detailed_content_en !== "string" || typeof topic.detailed_content_ar !== "string" || topic.detailed_content_en.length > 30000 || topic.detailed_content_ar.length > 30000) {
      return jsonResponse({
        error: "راجع عنوان الموضوع وترتيبه والشرح التفصيلي."
      }, 400);
    }
    const row = {
      ...topic.id ? {
        id: topic.id
      } : {},
      chapter_id: topic.chapter_id,
      title_en: String(topic.title_en).trim(),
      title_ar: String(topic.title_ar).trim(),
      short_description_en: typeof topic.short_description_en === "string" ? topic.short_description_en : "",
      short_description_ar: typeof topic.short_description_ar === "string" ? topic.short_description_ar : "",
      detailed_content_en: topic.detailed_content_en,
      detailed_content_ar: topic.detailed_content_ar,
      step_by_step: topic.step_by_step || {
        en: [],
        ar: []
      },
      code_examples: Array.isArray(topic.code_examples) ? topic.code_examples : [],
      practical_examples: topic.practical_examples || {
        en: [],
        ar: []
      },
      use_cases: topic.use_cases || {
        en: [],
        ar: []
      },
      common_mistakes: topic.common_mistakes || {
        en: [],
        ar: []
      },
      exercises: topic.exercises || {
        en: [],
        ar: []
      },
      sort_order: topic.sort_order
    };
    const query = topic.id ? serviceClient.from("chapter_topics").update(row).eq("id", topic.id) : serviceClient.from("chapter_topics").insert(row);
    const { data, error } = await query.select("*").single();
    if (error) return jsonResponseError(error, "حفظ الموضوع");
    return jsonResponse({
      success: true,
      topic: data
    });
  }
  if (body.action === "discount_save") {
    if (!isRecord(body.discount)) return jsonResponse({
      error: "بيانات الخصم غير صالحة."
    }, 400);
    const discount = body.discount;
    if (!isUuid(discount.course_id) || discount.id !== undefined && !isUuid(discount.id) || !discountTypes.has(String(discount.discount_type)) || !Number.isFinite(discount.discount_value) || Number(discount.discount_value) < 0 || discount.discount_type === "percentage" && Number(discount.discount_value) > 100 || typeof discount.start_date !== "string" || Number.isNaN(Date.parse(discount.start_date)) || discount.end_date && (typeof discount.end_date !== "string" || Number.isNaN(Date.parse(discount.end_date)) || Date.parse(discount.end_date) <= Date.parse(discount.start_date)) || typeof discount.is_active !== "boolean") {
      return jsonResponse({
        error: "راجع نوع الخصم وقيمته وتواريخ صلاحيته."
      }, 400);
    }
    const row = {
      ...discount.id ? {
        id: discount.id
      } : {},
      course_id: discount.course_id,
      discount_type: discount.discount_type,
      discount_value: discount.discount_value,
      start_date: discount.start_date,
      end_date: discount.end_date || null,
      is_active: discount.is_active,
      promotional_label: typeof discount.promotional_label === "string" ? discount.promotional_label.trim().slice(0, 120) || null : null
    };
    const query = discount.id ? serviceClient.from("course_discounts").update(row).eq("id", discount.id) : serviceClient.from("course_discounts").insert(row);
    const { data, error } = await query.select("*").single();
    if (error) return jsonResponseError(error, "حفظ الخصم");
    return jsonResponse({
      success: true,
      discount: data
    });
  }
  if (body.action === "discount_delete") {
    if (!isUuid(body.id)) return jsonResponse({
      error: "معرّف الخصم غير صالح."
    }, 400);
    const { data, error } = await serviceClient.from("course_discounts").delete().eq("id", body.id).select("id").maybeSingle();
    if (error) return jsonResponseError(error, "حذف الخصم");
    if (!data) return jsonResponse({
      error: "الخصم غير موجود."
    }, 404);
    return jsonResponse({
      success: true,
      id: data.id
    });
  }
  if (body.action === "course_asset_upload") {
    if (typeof body.fileName !== "string" || !/^[a-zA-Z0-9._-]{1,120}$/.test(body.fileName) || typeof body.contentType !== "string" || !courseImageTypes.has(body.contentType) || typeof body.base64 !== "string" || body.base64.length > 7_000_000) {
      return jsonResponse({
        error: "الصورة غير صالحة أو حجمها أكبر من 5 ميجابايت."
      }, 400);
    }
    let bytes;
    try {
      const binary = atob(body.base64);
      if (binary.length > 5 * 1024 * 1024) {
        return jsonResponse({
          error: "يجب ألا يتجاوز حجم الصورة 5 ميجابايت."
        }, 400);
      }
      bytes = Uint8Array.from(binary, (character)=>character.charCodeAt(0));
    } catch  {
      return jsonResponse({
        error: "تعذر قراءة ملف الصورة."
      }, 400);
    }
    const objectPath = `${crypto.randomUUID()}-${body.fileName}`;
    const { error } = await serviceClient.storage.from("techsphere-course-assets").upload(objectPath, bytes, {
      contentType: body.contentType,
      upsert: false
    });
    if (error) return jsonResponseError(error, "رفع صورة الكورس");
    const { data } = serviceClient.storage.from("techsphere-course-assets").getPublicUrl(objectPath);
    return jsonResponse({
      success: true,
      url: data.publicUrl
    });
  }
  if (body.action === "delete_request" || body.action === "delete_review") {
    if (typeof body.id !== "string") {
      return jsonResponse({
        error: "معرّف العنصر غير صالح."
      }, 400);
    }
    const isRequest = body.action === "delete_request";
    const requestTable = body.source === "course_enrollment_requests" ? "course_enrollment_requests" : "site_requests";
    const { data, error } = await serviceClient.from(isRequest ? requestTable : "course_reviews").delete().eq("id", body.id).select("id").maybeSingle();
    if (error) {
      console.error(`Unable to delete ${isRequest ? "site request" : "course review"}:`, error.message);
      return jsonResponse({
        error: `تعذر حذف ${isRequest ? "الطلب" : "التقييم"}.`
      }, 500);
    }
    if (!data) return jsonResponse({
      error: `ال${isRequest ? "طلب" : "تقييم"} غير موجود.`
    }, 404);
    return jsonResponse({
      success: true,
      id: data.id
    });
  }
  if (body.action === "list") {
    const [siteRequestsResult, courseRequestsResult, reviewsResult, profilesResult, projectRequestsResult] = await Promise.allSettled([
      serviceClient.from("site_requests").select("id, user_id, request_type, status, name, email, phone, course_id, course_name, job_title, portfolio, message, created_at, updated_at").order("created_at", {
        ascending: false
      }).limit(250),
      serviceClient.from("course_enrollment_requests").select("id, user_id, status, name, email, phone, course_id, course_name, quoted_price, currency_code, message, created_at, updated_at").order("created_at", {
        ascending: false
      }).limit(250),
      serviceClient.from("course_reviews").select("id, user_id, course_id, reviewer_name, rating, comment, moderation_status, is_verified, created_at").order("created_at", {
        ascending: false
      }).limit(250),
      serviceClient.from("profiles").select("id, full_name, email, student_id, individual_training_activated_at, created_at").order("created_at", {
        ascending: false
      }).limit(1000),
      serviceClient.from("project_requests").select(`
                    id, order_number, project_id, category_id, user_id,
                    buyer_name, buyer_phone, buyer_email, delivery_address,
                    min_budget, max_budget, budget_currency, delivery_deadline,
                    additional_message, status, access_granted, access_granted_by,
                    access_granted_at, created_at, updated_at,
                    service_projects (id, slug, title_ar, title_en, project_code),
                    service_project_categories (id, slug, title_ar, title_en)
                `).order("created_at", {
        ascending: false
      }).limit(250)
    ]);
    const rawSiteRequests = siteRequestsResult.status === "fulfilled" && !siteRequestsResult.value.error ? siteRequestsResult.value.data || [] : [];
    if (siteRequestsResult.status === "fulfilled" && siteRequestsResult.value.error) {
      console.error("Unable to load site requests:", siteRequestsResult.value.error.message);
    }
    const rawCourseRequests = courseRequestsResult.status === "fulfilled" && !courseRequestsResult.value.error ? courseRequestsResult.value.data || [] : [];
    if (courseRequestsResult.status === "fulfilled" && courseRequestsResult.value.error) {
      console.error("Unable to load course enrollment requests:", courseRequestsResult.value.error.message);
    }
    const rawReviews = reviewsResult.status === "fulfilled" && !reviewsResult.value.error ? reviewsResult.value.data || [] : [];
    if (reviewsResult.status === "fulfilled" && reviewsResult.value.error) {
      console.error("Unable to load course reviews:", reviewsResult.value.error.message);
    }
    let registeredUsers = [];
    if (profilesResult.status === "fulfilled" && !profilesResult.value.error && profilesResult.value.data) {
      registeredUsers = profilesResult.value.data.map((p)=>({
          id: p.id,
          full_name: (p.full_name || "").trim(),
          email: (p.email || "").trim(),
          student_id: p.student_id || null,
          individual_training_activated_at: p.individual_training_activated_at || null,
          created_at: p.created_at
        }));
    } else if (profilesResult.status === "fulfilled" && profilesResult.value.error) {
      console.error("Unable to load profiles:", profilesResult.value.error.message);
    }
    try {
      const { data: authData, error: authErr } = await serviceClient.auth.admin.listUsers({
        perPage: 1000
      });
      if (!authErr && authData?.users) {
        const userMap = new Map(registeredUsers.map((u)=>[
            u.id,
            u
          ]));
        for (const authUser of authData.users){
          const existing = userMap.get(authUser.id);
          const authName = (authUser.user_metadata?.full_name || "").trim();
          const authEmail = (authUser.email || "").trim();
          if (existing) {
            if (!existing.full_name && authName) existing.full_name = authName;
            if (!existing.email && authEmail) existing.email = authEmail;
            if (!existing.created_at && authUser.created_at) existing.created_at = authUser.created_at;
          } else {
            const newUser = {
              id: authUser.id,
              full_name: authName,
              email: authEmail,
              student_id: null,
              created_at: authUser.created_at
            };
            userMap.set(authUser.id, newUser);
            registeredUsers.push(newUser);
          }
        }
      }
    } catch (e) {
      console.error("Unable to list auth users:", e);
    }
    let rawProjectRequests = projectRequestsResult.status === "fulfilled" && !projectRequestsResult.value.error ? projectRequestsResult.value.data || [] : [];
    if (projectRequestsResult.status === "fulfilled" && projectRequestsResult.value.error) {
      console.error("Unable to load project requests with relation:", projectRequestsResult.value.error.message);
      const { data: plainRequests, error: plainError } = await serviceClient.from("project_requests").select("*").order("created_at", {
        ascending: false
      }).limit(250);
      if (!plainError && plainRequests) {
        rawProjectRequests = plainRequests;
      } else if (plainError) {
        console.error("Unable to load plain project requests:", plainError.message);
      }
    }
    const registeredNames = registeredUsers.map((u)=>u.full_name || u.email).filter(Boolean);
    return jsonResponse({
      requests: [
        ...rawSiteRequests.map((item)=>({
            ...item,
            source: "site_requests"
          })),
        ...rawCourseRequests.map((item)=>({
            ...item,
            request_type: "course_enrollment",
            source: "course_enrollment_requests"
          }))
      ].sort((left, right)=>new Date(right.created_at).getTime() - new Date(left.created_at).getTime()).slice(0, 250),
      reviews: rawReviews,
      registeredNames,
      registeredUsers,
      projectRequests: rawProjectRequests
    });
  }
  if (body.action === "update_request") {
    if (typeof body.id !== "string" || !requestStatuses.has(String(body.status))) {
      return jsonResponse({
        error: "معرّف الطلب أو حالته غير صالحين."
      }, 400);
    }
    const requestTable = body.source === "course_enrollment_requests" ? "course_enrollment_requests" : "site_requests";
    const { data, error } = await serviceClient.from(requestTable).update({
      status: body.status,
      updated_at: new Date().toISOString()
    }).eq("id", body.id).select("id, status, updated_at").maybeSingle();
    if (error) {
      console.error("Unable to update site request:", error.message);
      return jsonResponse({
        error: "تعذر تحديث حالة الطلب."
      }, 500);
    }
    if (!data) return jsonResponse({
      error: "الطلب غير موجود."
    }, 404);
    return jsonResponse({
      success: true,
      request: data
    });
  }
  if (body.action === "moderate_review") {
    if (typeof body.id !== "string" || !moderationStatuses.has(String(body.status))) {
      return jsonResponse({
        error: "معرّف التقييم أو حالته غير صالحين."
      }, 400);
    }
    const { data, error } = await serviceClient.from("course_reviews").update({
      moderation_status: body.status,
      moderated_at: new Date().toISOString(),
      moderated_by: user.email
    }).eq("id", body.id).select("id, moderation_status, moderated_at").maybeSingle();
    if (error) {
      console.error("Unable to moderate course review:", error.message);
      return jsonResponse({
        error: "تعذر تحديث حالة التقييم."
      }, 500);
    }
    if (!data) return jsonResponse({
      error: "التقييم غير موجود."
    }, 404);
    return jsonResponse({
      success: true,
      review: data
    });
  }
  if (body.action === "update_project_request" || body.action === "order_status_update") {
    if (typeof body.id !== "string" || !isUuid(body.id)) {
      return jsonResponse({
        error: "معرّف الطلب غير صالح."
      }, 400);
    }
    const validStatuses = new Set([
      "pending_review",
      "contacted",
      "negotiating",
      "approved",
      "in_progress",
      "completed",
      "rejected"
    ]);
    if (!validStatuses.has(String(body.status))) {
      return jsonResponse({
        error: "حالة طلب المشروع غير صالحة."
      }, 400);
    }
    const { data, error } = await serviceClient.from("project_requests").update({
      status: body.status,
      updated_at: new Date().toISOString()
    }).eq("id", body.id).select(`
                id, order_number, project_id, category_id, user_id,
                buyer_name, buyer_phone, buyer_email, delivery_address,
                min_budget, max_budget, budget_currency, delivery_deadline,
                additional_message, status, access_granted, access_granted_by,
                access_granted_at, created_at, updated_at,
                service_projects (id, slug, title_ar, title_en, project_code),
                service_project_categories (id, slug, title_ar, title_en)
            `).maybeSingle();
    if (error) {
      console.error("Unable to update project request:", error.message);
      return jsonResponse({
        error: "تعذر تحديث حالة طلب المشروع."
      }, 500);
    }
    if (!data) return jsonResponse({
      error: "الطلب غير موجود."
    }, 404);
    return jsonResponse({
      success: true,
      request: data
    });
  }
  if (body.action === "grant_project_access" || body.action === "project_access_grant") {
    const requestId = typeof body.id === "string" ? body.id : typeof body.orderId === "string" ? body.orderId : "";
    if (!isUuid(requestId)) {
      return jsonResponse({
        error: "معرّف الطلب غير صالح."
      }, 400);
    }
    const { data: request, error: requestError } = await serviceClient.from("project_requests").select("id, order_number, project_id, category_id, user_id, buyer_name, buyer_email, status, access_granted").eq("id", requestId).maybeSingle();
    if (requestError) {
      console.error("Unable to find project request for access grant:", requestError.message);
      return jsonResponse({
        error: "تعذر التحقق من الطلب."
      }, 500);
    }
    if (!request) return jsonResponse({
      error: "الطلب غير موجود."
    }, 404);
    if (request.access_granted) {
      return jsonResponse({
        error: "تم منح صلاحية الوصول لهذا الطلب بالفعل."
      }, 409);
    }
    let targetUserId = request.user_id;
    if (!targetUserId && request.buyer_email) {
      const { data: userList } = await serviceClient.auth.admin.listUsers();
      const matched = userList?.users?.find((u)=>u.email?.toLowerCase() === request.buyer_email.toLowerCase());
      if (matched) {
        targetUserId = matched.id;
        await serviceClient.from("project_requests").update({
          user_id: targetUserId
        }).eq("id", request.id);
      }
    }
    if (!targetUserId) {
      return jsonResponse({
        error: "الطلب غير مرتبط بمستخدم مسجل. يجب أن يسجل العميل حسابه أولاً بنفس البريد."
      }, 400);
    }
    const { data: existingAccess, error: existingError } = await serviceClient.from("service_project_access").select("id, status").eq("user_id", targetUserId).eq("project_id", request.project_id).eq("status", "active").limit(1).maybeSingle();
    if (existingError) {
      console.error("Unable to check existing access:", existingError.message);
      return jsonResponse({
        error: "تعذر التحقق من الصلاحيات القائمة."
      }, 500);
    }
    if (existingAccess) {
      return jsonResponse({
        error: "العميل يملك صلاحية نشطة لهذا المشروع بالفعل."
      }, 409);
    }
    const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
    const note = typeof body.note === "string" ? body.note.slice(0, 2000) : "";
    const { data: access, error: accessError } = await serviceClient.from("service_project_access").insert({
      user_id: targetUserId,
      project_id: request.project_id,
      order_id: null,
      request_id: request.id,
      status: "active",
      activated_at: new Date().toISOString(),
      expires_at: expiresAt,
      granted_by: user.email,
      admin_note: note
    }).select("id, status, activated_at, expires_at").single();
    if (accessError) {
      console.error("Unable to grant project access:", accessError.message);
      return jsonResponse({
        error: "تعذر منح صلاحية الوصول للمشروع."
      }, 500);
    }
    const { error: updateError } = await serviceClient.from("project_requests").update({
      access_granted: true,
      access_granted_by: user.email,
      access_granted_at: new Date().toISOString(),
      status: "approved",
      updated_at: new Date().toISOString()
    }).eq("id", request.id);
    if (updateError) {
      console.error("Unable to update request access status:", updateError.message);
    }
    return jsonResponse({
      success: true,
      access,
      order_number: request.order_number
    });
  }
  if (body.action === "revoke_project_access" || body.action === "access_revoke") {
    const requestId = typeof body.id === "string" ? body.id : typeof body.requestId === "string" ? body.requestId : "";
    if (!isUuid(requestId)) {
      return jsonResponse({
        error: "معرّف الطلب غير صالح."
      }, 400);
    }
    const { error: accessRevokeError } = await serviceClient.from("service_project_access").update({
      status: "revoked",
      revoked_at: new Date().toISOString(),
      revoked_by: user.email
    }).eq("request_id", requestId);
    if (accessRevokeError) {
      console.error("Unable to revoke access by request_id:", accessRevokeError.message);
    }
    const { data: updatedRequest, error: reqError } = await serviceClient.from("project_requests").update({
      access_granted: false,
      updated_at: new Date().toISOString()
    }).eq("id", requestId).select("id, order_number, status, access_granted").maybeSingle();
    if (reqError) {
      console.error("Unable to update project request on revoke:", reqError.message);
      return jsonResponse({
        error: "تعذر إلغاء صلاحية الوصول."
      }, 500);
    }
    return jsonResponse({
      success: true,
      request: updatedRequest
    });
  }
  if (body.action === "delete_project_request") {
    if (typeof body.id !== "string" || !isUuid(body.id)) {
      return jsonResponse({
        error: "معرّف الطلب غير صالح."
      }, 400);
    }
    const { data, error } = await serviceClient.from("project_requests").delete().eq("id", body.id).select("id").maybeSingle();
    if (error) {
      console.error("Unable to delete project request:", error.message);
      return jsonResponse({
        error: "تعذر حذف طلب المشروع."
      }, 500);
    }
    if (!data) return jsonResponse({
      error: "الطلب غير موجود."
    }, 404);
    return jsonResponse({
      success: true,
      id: data.id
    });
  }
  return jsonResponse({
    error: "الإجراء المطلوب غير معروف."
  }, 400);
});
