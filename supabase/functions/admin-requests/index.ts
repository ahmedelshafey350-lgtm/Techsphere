import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const requestStatuses = new Set([
    "new",
    "reviewing",
    "contacted",
    "accepted",
    "rejected",
    "completed",
]);
const moderationStatuses = new Set(["approved", "rejected"]);

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
    const configuredAdmins = Deno.env.get("ADMIN_EMAILS");
    if (!supabaseUrl || !anonKey || !serviceRoleKey || !configuredAdmins) {
        console.error("Admin requests function is missing required Supabase secrets.");
        return jsonResponse({ error: "خدمة الإدارة غير مكتملة الإعداد." }, 500);
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
    const adminEmails = configuredAdmins.split(",").map((email) => email.trim().toLowerCase());
    const isAdmin = adminEmails.includes(user.email.toLowerCase());

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

    if (body.action === "check_admin") {
        return jsonResponse({ isAdmin });
    }
    if (!isAdmin) {
        return jsonResponse({ error: "هذا الحساب غير مصرح له بلوحة الإدارة." }, 403);
    }

    const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
    if (body.action === "list") {
        const { data, error } = await serviceClient
            .from("site_requests")
            .select("id, user_id, request_type, status, name, email, phone, course_id, course_name, job_title, portfolio, message, created_at, updated_at")
            .order("created_at", { ascending: false })
            .limit(250);
        if (error) {
            console.error("Unable to load site requests:", error.message);
            return jsonResponse({ error: "تعذر تحميل الطلبات." }, 500);
        }

        const { data: reviews, error: reviewError } = await serviceClient
            .from("course_reviews")
            .select("id, user_id, course_id, reviewer_name, rating, comment, moderation_status, is_verified, created_at")
            .order("created_at", { ascending: false })
            .limit(250);
        if (reviewError) {
            console.error("Unable to load course reviews:", reviewError.message);
            return jsonResponse({ error: "تعذر تحميل التقييمات." }, 500);
        }

        const { data: profiles, error: profilesError } = await serviceClient
            .from("profiles")
            .select("full_name")
            .neq("full_name", "")
            .order("full_name", { ascending: true })
            .limit(1000);
        if (profilesError) {
            console.error("Unable to load registered user names:", profilesError.message);
            return jsonResponse({ error: "تعذر تحميل أسماء المستخدمين." }, 500);
        }

        return jsonResponse({
            requests: data,
            reviews,
            registeredNames: (profiles || [])
                .map((profile) => profile.full_name.trim())
                .filter(Boolean),
        });
    }

    if (body.action === "update_request") {
        if (typeof body.id !== "string" || !requestStatuses.has(String(body.status))) {
            return jsonResponse({ error: "معرّف الطلب أو حالته غير صالحين." }, 400);
        }
        const { data, error } = await serviceClient
            .from("site_requests")
            .update({ status: body.status, updated_at: new Date().toISOString() })
            .eq("id", body.id)
            .select("id, status, updated_at")
            .maybeSingle();
        if (error) {
            console.error("Unable to update site request:", error.message);
            return jsonResponse({ error: "تعذر تحديث حالة الطلب." }, 500);
        }
        if (!data) return jsonResponse({ error: "الطلب غير موجود." }, 404);
        return jsonResponse({ success: true, request: data });
    }

    if (body.action === "moderate_review") {
        if (typeof body.id !== "string" || !moderationStatuses.has(String(body.status))) {
            return jsonResponse({ error: "معرّف التقييم أو حالته غير صالحين." }, 400);
        }
        const { data, error } = await serviceClient
            .from("course_reviews")
            .update({
                moderation_status: body.status,
                moderated_at: new Date().toISOString(),
                moderated_by: user.email,
            })
            .eq("id", body.id)
            .select("id, moderation_status, moderated_at")
            .maybeSingle();
        if (error) {
            console.error("Unable to moderate course review:", error.message);
            return jsonResponse({ error: "تعذر تحديث حالة التقييم." }, 500);
        }
        if (!data) return jsonResponse({ error: "التقييم غير موجود." }, 404);
        return jsonResponse({ success: true, review: data });
    }

    return jsonResponse({ error: "الإجراء المطلوب غير معروف." }, 400);
});
