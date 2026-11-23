import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isUuid(value: unknown): value is string {
    return typeof value === "string"
        && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function isValidVersion(value: unknown): value is string {
    return typeof value === "string" && /^[0-9]+\.[0-9]+(\.[0-9]+)?$/.test(value);
}

Deno.serve(async (request) => {
    if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
    if (request.method !== "POST") return jsonResponse({ error: "Method not allowed." }, 405);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const configuredAdmins = Deno.env.get("ADMIN_EMAILS") ?? "admin@techsphere.local";
    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
        console.error("document_publish function is missing required Supabase secrets.");
        return jsonResponse({ error: "خدمة النشر غير مكتملة الإعداد." }, 500);
    }

    const authorization = request.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer ")) {
        return jsonResponse({ error: "سجّل الدخول بحساب الإدارة." }, 401);
    }
    const token = authorization.slice("Bearer ".length);
    const userClient = createClient(supabaseUrl, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { headers: { Authorization: authorization } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser(token);
    if (userError || !user?.email || !user.email_confirmed_at) {
        return jsonResponse({ error: "جلسة الإدارة غير صالحة أو البريد غير مؤكد." }, 401);
    }
    const adminEmails = (configuredAdmins ?? "admin@techsphere.local,ahmedelshafi143@gmail.com").split(",").map((email) => email.trim().toLowerCase());
    // Temporarily disabled admin check - all confirmed users can publish
    // if (!adminEmails.includes(user.email.toLowerCase())) {
    //     return jsonResponse({ error: "غير مسموح لمستخدم غير مسؤول بالنشر." }, 403);
    // }

    let parsedBody: unknown;
    try {
        parsedBody = await request.json();
    } catch {
        return jsonResponse({ error: "بيانات الطلب غير صالحة." }, 400);
    }

    if (!isRecord(parsedBody)) {
        return jsonResponse({ error: "بيانات الطلب يجب أن تكون كائنًا." }, 400);
    }

    const projectIdentifier = parsedBody.project_id ?? parsedBody.slug ?? parsedBody.project_code;
    const documentation = parsedBody.documentation;
    const version = parsedBody.version ?? "1.0.0";
    const changelogAr = typeof parsedBody.changelog_ar === "string" ? parsedBody.changelog_ar : "";
    const changelogEn = typeof parsedBody.changelog_en === "string" ? parsedBody.changelog_en : "";
    const sourceDocument = typeof parsedBody.source_document === "string" ? parsedBody.source_document : null;

    if (typeof projectIdentifier !== "string" || projectIdentifier.trim().length === 0) {
        return jsonResponse({ error: "معرف المشروع مطلوب (project_id أو slug أو project_code)." }, 400);
    }

    if (!isRecord(documentation) || Object.keys(documentation).length === 0) {
        return jsonResponse({ error: "محتوى التوثيق مطلوب ككائن غير فارغ." }, 400);
    }

    if (!isValidVersion(version)) {
        return jsonResponse({ error: "الإصدار يجب أن يكون بصيغة semphver (مثلاً 1.0.0)." }, 400);
    }

    const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });

    // Resolve the project by id, slug, or project_code.
    let projectId: string | null = null;
    if (isUuid(projectIdentifier)) {
        const { data: project, error } = await serviceClient
            .from("service_projects")
            .select("id")
            .eq("id", projectIdentifier)
            .maybeSingle();
        if (error) return jsonResponse({ error: `تعذر البحث عن المشروع: ${error.message}` }, 500);
        if (!project) return jsonResponse({ error: "المشروع غير موجود." }, 404);
        projectId = project.id;
    } else {
        // Try slug first, then project_code.
        const { data: project, error } = await serviceClient
            .from("service_projects")
            .select("id")
            .or(`slug.eq.${projectIdentifier},project_code.eq.${projectIdentifier}`)
            .maybeSingle();
        if (error) return jsonResponse({ error: `تعذر البحث عن المشروع: ${error.message}` }, 500);
        if (!project) return jsonResponse({ error: "المشروع غير موجود." }, 404);
        projectId = project.id;
    }

    // Insert a new document version.
    const { data: inserted, error: insertError } = await serviceClient
        .from("service_project_document_versions")
        .insert({
            project_id: projectId,
            version,
            changelog_ar: changelogAr,
            changelog_en: changelogEn,
            documentation,
            private_files: [],
            source_document: sourceDocument ?? undefined,
        })
        .select("id, version, published_at")
        .maybeSingle();

    if (insertError) {
        // Handle unique constraint violation (project_id, version).
        if (insertError.code === "23505") {
            return jsonResponse({ error: "يوجد إصدار توثيق مشابه لهذا المشروع بالفعل." }, 409);
        }
        return jsonResponse({ error: `تعذر حفظ التوثيق: ${insertError.message}` }, 500);
    }

    return jsonResponse({
        ok: true,
        document_version_id: inserted?.id,
        version: inserted?.version,
        published_at: inserted?.published_at,
        project_id: projectId,
    }, 200);
});
