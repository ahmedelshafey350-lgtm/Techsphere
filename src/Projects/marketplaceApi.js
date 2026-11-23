import { getSupabaseClient, isSupabaseConfigured } from "../login/supabase";

async function responseError(error) {
    if (error?.context instanceof Response) {
        try {
            const body = await error.context.clone().json();
            if (typeof body?.error === "string") return new Error(body.error);
        } catch {
            return new Error(error.message || "تعذر الاتصال بخدمة المشاريع.");
        }
    }
    return new Error(error?.message || "تعذر الاتصال بخدمة المشاريع.");
}

export async function callProjectService(action, payload = {}) {
    if (!isSupabaseConfigured()) {
        throw new Error("إعداد Supabase غير مكتمل.");
    }
    const { data, error } = await getSupabaseClient().functions.invoke("service-projects", {
        body: { action, ...payload },
    });
    if (error) throw await responseError(error);
    if (data?.error) throw new Error(data.error);
    return data;
}

export async function downloadProjectFile(documentVersionId, fileName) {
    if (!isSupabaseConfigured()) throw new Error("إعداد Supabase غير مكتمل.");
    const supabase = getSupabaseClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!session?.access_token) throw new Error("سجّل الدخول أولًا لتنزيل الملف.");

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/service-projects`, {
        method: "POST",
        headers: {
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "download_private_file", documentVersionId, fileName }),
    });
    if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "تعذر تنزيل الملف الخاص.");
    }
    return await response.blob();
}

export async function uploadProjectPrivateFile(projectId, file) {
    const signed = await callProjectService("private_upload_url", {
        projectId,
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
    });
    const { error } = await getSupabaseClient().storage
        .from("techsphere-project-private")
        .uploadToSignedUrl(signed.path, signed.token, file, {
            contentType: file.type || "application/octet-stream",
            upsert: false,
        });
    if (error) throw error;
    return {
        file_name: file.name,
        content_type: file.type || "application/octet-stream",
        path: signed.path,
    };
}
