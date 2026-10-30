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

function equalSecret(left: string, right: string) {
    const encoder = new TextEncoder();
    const leftBytes = encoder.encode(left);
    const rightBytes = encoder.encode(right);
    let difference = leftBytes.length ^ rightBytes.length;
    const maxLength = Math.max(leftBytes.length, rightBytes.length);

    for (let index = 0; index < maxLength; index += 1) {
        difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
    }

    return difference === 0;
}

Deno.serve(async (request) => {
    if (request.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }
    if (request.method !== "POST") {
        return jsonResponse({ error: "Method not allowed." }, 405);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const ownerCode = Deno.env.get("OWNER_ACTIVATION_CODE");
    if (!supabaseUrl || !anonKey || !serviceRoleKey || !ownerCode) {
        console.error("Jobs access function is missing one or more required secrets.");
        return jsonResponse({ error: "خدمة التحقق غير مكتملة الإعداد." }, 500);
    }

    const authorization = request.headers.get("Authorization");
    if (!authorization?.startsWith("Bearer ")) {
        return jsonResponse({ error: "سجّل الدخول أولًا." }, 401);
    }

    const token = authorization.slice("Bearer ".length);
    const userClient = createClient(supabaseUrl, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { headers: { Authorization: authorization } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser(token);
    if (userError || !user) {
        return jsonResponse({ error: "جلسة الدخول غير صالحة. سجّل الدخول مرة أخرى." }, 401);
    }
    if (!user.email || !user.email_confirmed_at) {
        return jsonResponse({ error: "أكد بريدك الإلكتروني قبل فتح صفحة الوظائف." }, 403);
    }

    let body: { accessCode?: unknown };
    try {
        body = await request.json();
    } catch {
        return jsonResponse({ error: "بيانات الطلب غير صالحة." }, 400);
    }
    if (typeof body.accessCode !== "string" || body.accessCode.length > 200) {
        return jsonResponse({ error: "أدخل الرمز السري الذي حصلت عليه من المالك." }, 400);
    }

    const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
    const isValidCode = equalSecret(body.accessCode.trim(), ownerCode.trim());
    const { data: allowed, error: attemptError } = await serviceClient.rpc(
        "record_jobs_access_attempt",
        { p_user_id: user.id, p_succeeded: isValidCode },
    );
    if (attemptError) {
        console.error("Unable to record jobs access attempt:", attemptError.message);
        return jsonResponse({ error: "تعذر التحقق من الرمز. حاول مرة أخرى." }, 500);
    }
    if (!allowed) {
        return jsonResponse({ error: "محاولات كثيرة. انتظر 15 دقيقة ثم حاول مرة أخرى." }, 429);
    }
    if (!isValidCode) {
        return jsonResponse({ error: "الرمز السري غير صحيح." }, 400);
    }

    return jsonResponse({ success: true });
});
