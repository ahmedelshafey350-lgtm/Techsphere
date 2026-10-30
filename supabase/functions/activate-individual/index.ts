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
        console.error("Activation function is missing one or more required secrets.");
        return jsonResponse({ error: "خدمة التفعيل غير مكتملة الإعداد." }, 500);
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
        return jsonResponse({ error: "أكد بريدك الإلكتروني قبل تفعيل تدريب الأفراد." }, 403);
    }

    let body: { activationCode?: unknown };
    try {
        body = await request.json();
    } catch {
        return jsonResponse({ error: "بيانات الطلب غير صالحة." }, 400);
    }
    if (typeof body.activationCode !== "string" || body.activationCode.length > 200) {
        return jsonResponse({ error: "أدخل كود التفعيل الذي حصلت عليه من المالك." }, 400);
    }

    const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: allowed, error: limitError } = await serviceClient.rpc(
        "can_attempt_individual_activation",
        { p_user_id: user.id },
    );
    if (limitError) {
        console.error("Unable to check activation attempt limit:", limitError.message);
        return jsonResponse({ error: "تعذر التحقق من طلب التفعيل. حاول مرة أخرى." }, 500);
    }
    if (!allowed) {
        return jsonResponse({ error: "محاولات كثيرة. انتظر 15 دقيقة ثم حاول مرة أخرى." }, 429);
    }

    if (!equalSecret(body.activationCode.trim(), ownerCode.trim())) {
        const { error } = await serviceClient.rpc("record_individual_activation_attempt", {
            p_user_id: user.id,
            p_succeeded: false,
        });
        if (error) console.error("Unable to record failed activation attempt:", error.message);
        return jsonResponse({ error: "كود التفعيل غير صحيح. راجع المالك." }, 400);
    }

    const { error: clearAttemptsError } = await serviceClient.rpc(
        "record_individual_activation_attempt",
        { p_user_id: user.id, p_succeeded: true },
    );
    if (clearAttemptsError) {
        console.error("Unable to clear activation attempts:", clearAttemptsError.message);
        return jsonResponse({ error: "تعذر إكمال التفعيل. حاول مرة أخرى." }, 500);
    }

    const { data: activation, error: activationError } = await serviceClient
        .rpc("activate_individual_training", {
            p_user_id: user.id,
            p_full_name: String(user.user_metadata?.full_name ?? ""),
            p_email: user.email,
        })
        .maybeSingle();

    if (activationError || !activation?.student_id) {
        console.error("Unable to activate student:", activationError?.message ?? "Missing student ID");
        return jsonResponse({ error: "تعذر حفظ تفعيل الحساب. حاول مرة أخرى." }, 500);
    }

    return jsonResponse({
        success: true,
        studentId: activation.student_id,
        message: "تم تفعيل حسابك وحفظ رقمك التعريفي. احتفظ به لاستخدامه لاحقًا.",
    });
});
