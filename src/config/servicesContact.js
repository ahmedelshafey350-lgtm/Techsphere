export const SERVICES_WHATSAPP_URL = "https://wa.me/201271611263?s=t";

export function servicesWhatsAppLink(message) {
    const url = new URL(SERVICES_WHATSAPP_URL);
    if (message) {
        url.searchParams.set("text", message);
    }
    return url.toString();
}

export function projectSupportMessage({ customer, projectName, projectCode, orderReference, language }) {
    const isEnglish = language === "en";
    const customerLabel = customer || (isEnglish ? "Customer" : "العميل");
    const lines = isEnglish
        ? [
            "Hello Techshpere, I need technical support regarding my purchased project.",
            "",
            `Customer: ${customerLabel}`,
            `Project: ${projectName}`,
            `Project ID: ${projectCode}`,
            ...(orderReference ? [`Order Reference: ${orderReference}`] : []),
            "",
            "My question:",
        ]
        : [
            "مرحبًا Techshpere، أحتاج إلى دعم فني بخصوص المشروع الذي اشتريته.",
            "",
            `العميل: ${customerLabel}`,
            `المشروع: ${projectName}`,
            `رقم المشروع: ${projectCode}`,
            ...(orderReference ? [`رقم الطلب: ${orderReference}`] : []),
            "",
            "استفساري:",
        ];
    return lines.join("\n");
}
