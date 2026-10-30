import { getSupabaseClient } from "../login/supabase";

export async function submitSiteRequest(request) {
    const { data, error } = await getSupabaseClient().functions.invoke(
        "submit-request",
        { body: request },
    );
    if (error) {
        if (error.context instanceof Response) {
            const response = await error.context.clone().json().catch(() => null);
            throw new Error(response?.error || "تعذر حفظ الطلب في حسابك.");
        }
        throw new Error("تعذر الاتصال بخدمة حفظ الطلبات.");
    }
    if (!data?.success || !data.request?.id) {
        throw new Error(data?.error || "تعذر حفظ الطلب في حسابك.");
    }
    return data.request;
}

export async function forwardFormspreeSubmission(formId, payload) {
    const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.errors?.length) {
        throw new Error(result?.errors?.map((error) => error.message).join(", ")
            || `Formspree returned status ${response.status}.`);
    }
}
