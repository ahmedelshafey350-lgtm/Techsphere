import { useMemo, useState } from "react";
import { WhatsApp } from "@mui/icons-material";
import { useLanguage } from "../i18n/language";
import { projectSupportMessage, servicesWhatsAppLink } from "../config/servicesContact";

export default function ProjectSupportContact({ customer, projectName, projectCode, orderReference }) {
    const { language } = useLanguage();
    const initialMessage = useMemo(() => projectSupportMessage({
        customer,
        projectName,
        projectCode,
        orderReference,
        language,
    }), [customer, language, orderReference, projectCode, projectName]);
    const [draft, setDraft] = useState({ initialMessage, message: initialMessage });
    const message = draft.initialMessage === initialMessage ? draft.message : initialMessage;
    const isEnglish = language === "en";

    return (
        <section className="project-support" aria-labelledby="project-support-title">
            <div>
                <p className="project-eyebrow">{isEnglish ? "ACTIVE PROJECT ACCESS" : "صلاحية مشروع فعّالة"}</p>
                <h2 id="project-support-title">
                    {isEnglish ? "Need technical help?" : "تحتاج إلى مساعدة فنية؟"}
                </h2>
                <p>
                    {isEnglish
                        ? "Edit the message below if you like, then continue to WhatsApp."
                        : "يمكنك تعديل الرسالة أدناه قبل فتح واتساب وإرسالها."}
                </p>
            </div>
            <label className="project-support-label" htmlFor="project-support-message">
                {isEnglish ? "Message" : "الرسالة"}
            </label>
            <textarea
                id="project-support-message"
                value={message}
                onChange={(event) => setDraft({ initialMessage, message: event.target.value })}
                rows={7}
                dir={isEnglish ? "ltr" : "rtl"}
            />
            <a
                className="project-button project-button-whatsapp"
                href={servicesWhatsAppLink(message)}
                target="_blank"
                rel="noopener noreferrer"
            >
                <WhatsApp aria-hidden="true" />
                {isEnglish ? "Contact Technical Support" : "تواصل مع الدعم الفني"}
            </a>
        </section>
    );
}
