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

Deno.serve(async (request) => {
    if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
    if (request.method !== "POST") return jsonResponse({ error: "Method not allowed." }, 405);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
        console.error("Request submission function is missing required Supabase secrets.");
        return jsonResponse({ error: "خدمة الطلبات غير مكتملة الإعداد." }, 500);
    }

    const authorization = request.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer ")) {
        return jsonResponse({ error: "سجّل الدخول أولًا لإرسال الطلب." }, 401);
    }

    const userClient = createClient(supabaseUrl, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { headers: { Authorization: authorization } },
    });
    const token = authorization.slice("Bearer ".length);
    const { data: { user }, error: userError } = await userClient.auth.getUser(token);
    if (userError || !user) return jsonResponse({ error: "جلسة الدخول غير صالحة." }, 401);
    if (!user.email || !user.email_confirmed_at) {
        return jsonResponse({ error: "أكد بريدك الإلكتروني قبل إرسال الطلب." }, 403);
    }

    let parsedBody: unknown;
    try {
        parsedBody = await request.json();
    } catch {
        return jsonResponse({ error: "بيانات الطلب غير صالحة." }, 400);
    }
    if (!parsedBody || typeof parsedBody !== "object" || Array.isArray(parsedBody)) {
        return jsonResponse({ error: "بيانات الطلب غير صالحة." }, 400);
    }
    const body = parsedBody as Record<string, unknown>;

    const requestType = body.requestType;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const portfolio = typeof body.portfolio === "string" ? body.portfolio.trim() : "";
    if (!["course_enrollment", "job_application"].includes(String(requestType))) {
        return jsonResponse({ error: "نوع الطلب غير صالح." }, 400);
    }
    if (name.length < 2 || name.length > 160 || phone.length < 5 || phone.length > 40
        || message.length > 3000 || portfolio.length > 500) {
        return jsonResponse({ error: "راجع البيانات المدخلة وحاول مرة أخرى." }, 400);
    }
    let safePortfolio = "";
    if (portfolio) {
        try {
            const portfolioUrl = new URL(portfolio);
            if (!["http:", "https:"].includes(portfolioUrl.protocol)) {
                return jsonResponse({ error: "رابط معرض الأعمال غير صالح." }, 400);
            }
            safePortfolio = portfolioUrl.toString();
        } catch {
            return jsonResponse({ error: "رابط معرض الأعمال غير صالح." }, 400);
        }
    }

    const row: Record<string, unknown> = {
        user_id: user.id,
        request_type: requestType,
        name,
        email: user.email,
        phone,
        message,
        portfolio: safePortfolio || null,
    };
    if (requestType === "course_enrollment") {
        const courseId = body.courseId;
        const courseName = typeof body.courseName === "string" ? body.courseName.trim() : "";
        if (!Number.isInteger(courseId) || Number(courseId) < 0 || Number(courseId) > 7
            || !courseName || courseName.length > 160) {
            return jsonResponse({ error: "الدورة المختارة غير صالحة." }, 400);
        }
        row.course_id = courseId;
        row.course_name = courseName;
    } else {
        const jobTitle = typeof body.jobTitle === "string" ? body.jobTitle.trim() : "";
        if (!jobTitle || jobTitle.length > 160) {
            return jsonResponse({ error: "المسمى المهني غير صالح." }, 400);
        }
        row.job_title = jobTitle;
    }

    const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await serviceClient
        .from("site_requests")
        .insert(row)
        .select("id, request_type, status, created_at")
        .single();
    if (error) {
        console.error("Unable to save site request:", error.message);
        return jsonResponse({ error: "تعذر حفظ الطلب. حاول مرة أخرى." }, 500);
    }

    return jsonResponse({ success: true, request: data });
});
