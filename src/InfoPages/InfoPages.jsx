import React from "react";
import Footer from "../Footer/Footer";
import { useLanguage } from "../i18n/language";
import "./InfoPages.css";

const faqItems = [
    {
        question: { ar: "إزاي أطلب الاشتراك في كورس؟", en: "How do I request course enrollment?" },
        answer: {
            ar: "سجّل الدخول إلى حسابك، اختر الكورس، ثم أرسل بيانات طلب الاشتراك. سيظهر الطلب في صفحة حسابك ويمكنك متابعة حالته هناك.",
            en: "Sign in, choose a course, and submit your enrollment request. You can follow its status from your account page.",
        },
    },
    {
        question: { ar: "إمتى أتواصل مع فريق التدريب؟", en: "When will the training team contact me?" },
        answer: {
            ar: "بعد مراجعة الطلب، ستظهر حالته في حسابك. استخدم بيانات التواصل المنشورة بالموقع إذا احتجت متابعة مباشرة.",
            en: "After review, the request status will appear in your account. Use the contact details on the site if you need to follow up directly.",
        },
    },
    {
        question: { ar: "هل المسارات في صفحة الوظائف شواغر مؤكدة؟", en: "Are the career paths confirmed vacancies?" },
        answer: {
            ar: "لا. هي أمثلة لمسميات ومهارات مهنية مرتبطة بالكورسات، وليست إعلانًا عن وظيفة متاحة أو ضمانًا للتوظيف.",
            en: "No. They are examples of roles and skills related to courses, not confirmed vacancies or a guarantee of employment.",
        },
    },
    {
        question: { ar: "مين يقدر يقدم على مسار مهني؟", en: "Who can apply for a career path?" },
        answer: {
            ar: "يتطلب التقديم تسجيل الدخول إلى حساب ببريد مؤكد، ثم إدخال الرمز السري الذي يشاركه مالك المنصة. إرسال الطلب لا يعني وجود شاغر مؤكد.",
            en: "Applications require a signed-in account with a confirmed email and the access code shared by the platform owner. Applying does not imply a confirmed vacancy.",
        },
    },
    {
        question: { ar: "إزاي أضيف تقييم موثّق؟", en: "How do I submit a verified review?" },
        answer: {
            ar: "التقييم متاح للحسابات المفعّلة لتدريب الأفراد. يراجعه فريق الإدارة قبل ظهوره، والتوثيق هنا يعني تفعيل الحساب وليس إثبات شراء الكورس.",
            en: "Reviews are available to accounts activated for individual training. The team reviews each submission before publishing. Verification here means account activation, not proof of course purchase.",
        },
    },
    {
        question: { ar: "نسيت كلمة المرور، أعمل إيه؟", en: "What if I forgot my password?" },
        answer: {
            ar: "استخدم خيار استعادة كلمة المرور في صفحة تسجيل الدخول واتبع رابط الرسالة التي تصلك على بريد الحساب.",
            en: "Use the password recovery option on the sign-in page and follow the link sent to your account email.",
        },
    },
];

export function FAQPage() {
    const { language } = useLanguage();
    const isEnglish = language === "en";

    return (
        <>
            <main className="info-page" dir={isEnglish ? "ltr" : "rtl"}>
                <header className="info-page-heading">
                    <span>TECHSPHERE</span>
                    <h1>{isEnglish ? "Frequently asked questions" : "الأسئلة الشائعة"}</h1>
                    <p>{isEnglish
                        ? "Answers about courses, accounts, applications, and reviews."
                        : "إجابات عن الكورسات والحسابات وطلبات التقديم والتقييمات."}</p>
                </header>
                <section className="faq-list">
                    {faqItems.map((item) => (
                        <details className="faq-item" key={item.question.en}>
                            <summary>{item.question[language]}</summary>
                            <p>{item.answer[language]}</p>
                        </details>
                    ))}
                </section>
            </main>
            <Footer />
        </>
    );
}

export function PoliciesPage() {
    const { language } = useLanguage();
    const isEnglish = language === "en";

    return (
        <>
            <main className="info-page policy-page" dir={isEnglish ? "ltr" : "rtl"}>
                <header className="info-page-heading">
                    <span>TECHSPHERE</span>
                    <h1>{isEnglish ? "Privacy and enrollment policies" : "الخصوصية وسياسات التسجيل"}</h1>
                    <p>{isEnglish
                        ? "A draft for owner review. Confirm the final terms before treating them as official."
                        : "مسودة للمراجعة من إدارة المنصة. يجب اعتماد الشروط النهائية قبل اعتبارها سياسة رسمية."}</p>
                </header>
                <div className="policy-draft-notice" role="note">
                    {isEnglish
                        ? "Draft notice: the platform owner must confirm the final cancellation, refund, and retention terms and check applicable local requirements."
                        : "تنبيه: يجب على مالك المنصة اعتماد شروط الإلغاء والاسترداد ومدة الاحتفاظ بالبيانات، ومراجعتها وفق المتطلبات المحلية، قبل اعتماد هذه المسودة."}
                </div>
                <section className="policy-section">
                    <h2>{isEnglish ? "Information and use" : "البيانات واستخدامها"}</h2>
                    <p>{isEnglish
                        ? "Account and application details are used to operate the site, respond to course and career-path requests, and show request status. Authentication and request records are handled through Supabase. Course and job application forms also send a copy to Formspree so the team can receive submissions."
                        : "تُستخدم بيانات الحساب وطلبات التقديم لتشغيل الموقع والرد على طلبات الكورسات والمسارات المهنية وعرض حالة الطلب. تتم إدارة تسجيل الدخول وسجلات الطلبات عبر Supabase، كما ترسل نماذج الكورسات والوظائف نسخة إلى Formspree حتى يستقبلها الفريق."}</p>
                    <p>{isEnglish
                        ? "Do not include passwords, payment-card information, or other sensitive data in free-text fields. The site does not process course payments through these request forms."
                        : "لا تكتب كلمات المرور أو بيانات البطاقات البنكية أو معلومات حساسة أخرى في حقول الرسائل. نماذج الطلبات لا تنفذ دفعًا إلكترونيًا للكورسات."}</p>
                </section>
                <section className="policy-section">
                    <h2>{isEnglish ? "Cancellation and refunds — draft" : "الإلغاء والاسترداد — مسودة"}</h2>
                    <p>{isEnglish
                        ? "Contact the team using the published contact details as early as possible if you need to cancel or ask about a refund. Eligibility, deadlines, and any deductions have not yet been confirmed by the platform owner; ask the team for the applicable terms before paying or beginning a course."
                        : "تواصل مع الفريق عبر بيانات التواصل المنشورة في أقرب وقت إذا أردت إلغاء الاشتراك أو الاستفسار عن استرداد. لم يعتمد مالك المنصة بعد شروط الأهلية أو المدد أو أي خصومات؛ اطلب الشروط المطبقة من الفريق قبل الدفع أو بدء الكورس."}</p>
                </section>
                <section className="policy-section">
                    <h2>{isEnglish ? "Reviews and career paths" : "التقييمات والمسارات المهنية"}</h2>
                    <p>{isEnglish
                        ? "Verified reviews are submitted by activated student accounts and published only after moderation. This verification does not by itself confirm a paid purchase. Career paths are illustrative and do not promise a job or represent confirmed vacancies."
                        : "تُرسل التقييمات الموثقة من حسابات طلاب مفعّلة ولا تُنشر إلا بعد مراجعتها. هذا التوثيق لا يثبت وحده شراء كورس مدفوع. المسارات المهنية استرشادية ولا تضمن وظيفة ولا تمثل شواغر مؤكدة."}</p>
                </section>
            </main>
            <Footer />
        </>
    );
}
