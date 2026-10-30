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
        console.error("Review submission function is missing required Supabase secrets.");
        return jsonResponse({ error: "خدمة التقييمات غير مكتملة الإعداد." }, 500);
    }

    const authorization = request.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer ")) {
        return jsonResponse({ error: "سجّل الدخول أولًا لإرسال تقييم." }, 401);
    }
    const userClient = createClient(supabaseUrl, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { headers: { Authorization: authorization } },
    });
    const token = authorization.slice("Bearer ".length);
    const { data: { user }, error: userError } = await userClient.auth.getUser(token);
    if (userError || !user) return jsonResponse({ error: "جلسة الدخول غير صالحة." }, 401);
    if (!user.email || !user.email_confirmed_at) {
        return jsonResponse({ error: "أكد بريدك الإلكتروني قبل إرسال تقييم." }, 403);
    }

    let parsedBody: unknown;
    try {
        parsedBody = await request.json();
    } catch {
        return jsonResponse({ error: "بيانات التقييم غير صالحة." }, 400);
    }
    if (!parsedBody || typeof parsedBody !== "object" || Array.isArray(parsedBody)) {
        return jsonResponse({ error: "بيانات التقييم غير صالحة." }, 400);
    }
    const body = parsedBody as {
        courseId?: unknown;
        rating?: unknown;
        comment?: unknown;
        consent?: unknown;
    };
    if (!Number.isInteger(body.courseId) || Number(body.courseId) < 0 || Number(body.courseId) > 7
        || !Number.isInteger(body.rating) || Number(body.rating) < 1 || Number(body.rating) > 5
        || typeof body.comment !== "string" || body.comment.trim().length < 10
        || body.comment.trim().length > 1200 || body.consent !== true) {
        return jsonResponse({ error: "راجع تقييمك وموافقتك على نشره." }, 400);
    }

    const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: profile, error: profileError } = await serviceClient
        .from("profiles")
        .select("full_name, individual_training_activated_at")
        .eq("id", user.id)
        .maybeSingle();
    if (profileError) {
        console.error("Unable to verify student activation:", profileError.message);
        return jsonResponse({ error: "تعذر التحقق من حالة حساب الطالب." }, 500);
    }
    if (!profile?.individual_training_activated_at) {
        return jsonResponse({ error: "التقييم الموثق متاح لحسابات الطلاب المفعّلة فقط." }, 403);
    }

    const { data: existingReview, error: existingError } = await serviceClient
        .from("course_reviews")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", body.courseId)
        .neq("moderation_status", "rejected")
        .maybeSingle();
    if (existingError) {
        console.error("Unable to check for duplicate reviews:", existingError.message);
        return jsonResponse({ error: "تعذر التحقق من التقييم السابق." }, 500);
    }
    if (existingReview) return jsonResponse({ error: "لديك تقييم سابق لهذا الكورس." }, 409);

    const reviewerName = (profile.full_name || user.user_metadata?.full_name || "").trim();
    if (!reviewerName) return jsonResponse({ error: "أضف اسمك إلى حسابك قبل إرسال تقييم." }, 400);

    const { data, error } = await serviceClient
        .from("course_reviews")
        .insert({
            user_id: user.id,
            course_id: body.courseId,
            reviewer_name: reviewerName.slice(0, 100),
            rating: body.rating,
            comment: body.comment.trim(),
            is_verified: true,
        })
        .select("id, moderation_status, created_at")
        .single();
    if (error) {
        console.error("Unable to save course review:", error.message);
        return jsonResponse({ error: "تعذر حفظ التقييم. حاول مرة أخرى." }, 500);
    }

    return jsonResponse({ success: true, review: data });
});
