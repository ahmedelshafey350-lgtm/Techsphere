import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, KeyRound, LockKeyhole } from "lucide-react";
import { getSupabaseClient, isSupabaseConfigured } from "../login/supabase";
import { useLanguage } from "../i18n/language";
import { forwardFormspreeSubmission, submitSiteRequest } from "../utils/requestSubmission";
import Footer from "../Footer/Footer";
import "./Jobs.css";

const careerPaths = [
    {
        id: "frontend",
        title: { ar: "مطور واجهات أمامية", en: "Front-End Developer" },
        course: { ar: "تطوير الواجهات الأمامية", en: "Front-End Development" },
        summary: {
            ar: "تحويل التصاميم إلى واجهات ويب سريعة ومتجاوبة وسهلة الاستخدام.",
            en: "Turn product designs into fast, responsive, and accessible web interfaces.",
        },
        responsibilities: {
            ar: ["بناء صفحات تفاعلية باستخدام React.", "تطبيق التصميم المتجاوب ودعم مختلف الشاشات.", "التعاون مع المصممين ومطوري الواجهات الخلفية."],
            en: ["Build interactive pages with React.", "Create responsive interfaces for different screen sizes.", "Work with designers and back-end developers."],
        },
        requirements: {
            ar: ["أساسيات HTML وCSS وJavaScript.", "معرفة React ومفاهيم المكونات والحالة.", "القدرة على عرض مشروعات أو نماذج من أعمالك."],
            en: ["Working knowledge of HTML, CSS, and JavaScript.", "Familiarity with React components and state.", "Projects or work samples to share."],
        },
    },
    {
        id: "backend",
        title: { ar: "مطور واجهات خلفية", en: "Back-End Developer" },
        course: { ar: "تطوير الواجهات الخلفية", en: "Back-End Development" },
        summary: {
            ar: "إنشاء خدمات وواجهات API موثوقة تدعم تطبيقات الويب.",
            en: "Build reliable services and APIs that power web applications.",
        },
        responsibilities: {
            ar: ["تطوير خدمات باستخدام Node.js وExpress.", "تصميم واجهات REST API وربطها بقواعد البيانات.", "تطبيق أساسيات التحقق من البيانات والمصادقة."],
            en: ["Develop services with Node.js and Express.", "Design REST APIs and connect them to databases.", "Apply input validation and authentication fundamentals."],
        },
        requirements: {
            ar: ["أساسيات JavaScript وNode.js.", "فهم HTTP وواجهات API وقواعد البيانات.", "القدرة على توثيق مشروعاتك البرمجية."],
            en: ["Fundamentals of JavaScript and Node.js.", "Understanding of HTTP, APIs, and databases.", "Ability to document your software projects."],
        },
    },
    {
        id: "fullstack",
        title: { ar: "مطور تطبيقات ويب متكاملة", en: "Full-Stack Developer" },
        course: { ar: "تطوير الواجهات المتكاملة", en: "Full-Stack Development" },
        summary: {
            ar: "المساهمة في بناء تطبيقات ويب متكاملة من الواجهة حتى الخدمات الخلفية.",
            en: "Contribute to complete web applications from the interface to the server.",
        },
        responsibilities: {
            ar: ["تنفيذ واجهات المستخدم وربطها بالخدمات.", "بناء نقاط API والتعامل مع البيانات.", "اختبار تدفقات التطبيق ومعالجة الأخطاء."],
            en: ["Implement user interfaces and connect them to services.", "Build API endpoints and work with application data.", "Test application flows and troubleshoot issues."],
        },
        requirements: {
            ar: ["أساسيات React وJavaScript.", "معرفة أولية بـNode.js وواجهات API.", "مشروع ويب متكامل أو نماذج عملية."],
            en: ["Fundamentals of React and JavaScript.", "Introductory knowledge of Node.js and APIs.", "A complete web project or practical samples."],
        },
    },
    {
        id: "automation",
        title: { ar: "متخصص أتمتة سير العمل", en: "Workflow Automation Specialist" },
        course: { ar: "أتمتة n8n", en: "n8n Automation" },
        summary: {
            ar: "ربط الخدمات الرقمية وبناء تدفقات عمل تقلل المهام اليدوية.",
            en: "Connect digital services and build workflows that reduce manual tasks.",
        },
        responsibilities: {
            ar: ["تصميم تدفقات عمل على n8n.", "ربط الخدمات عبر APIs وWebhooks.", "اختبار التدفقات وتوثيقها ومتابعة الأعطال."],
            en: ["Design workflows in n8n.", "Connect services using APIs and webhooks.", "Test, document, and troubleshoot workflows."],
        },
        requirements: {
            ar: ["فهم أساسيات منطق سير العمل.", "معرفة أولية بـJSON وواجهات API.", "الاهتمام بحل المشكلات وتوثيق الخطوات."],
            en: ["Understanding of workflow logic.", "Introductory knowledge of JSON and APIs.", "Interest in troubleshooting and clear documentation."],
        },
    },
    {
        id: "analog-electronics",
        title: { ar: "فني إلكترونيات تناظرية", en: "Analog Electronics Technician" },
        course: { ar: "الإلكترونيات التناظرية", en: "Analog Electronics" },
        summary: {
            ar: "المساعدة في فحص الدوائر التناظرية وتجميع النماذج الإلكترونية.",
            en: "Assist with testing analog circuits and assembling electronic prototypes.",
        },
        responsibilities: {
            ar: ["قراءة مخططات الدوائر الأساسية.", "المساعدة في تجميع وقياس الدوائر.", "تسجيل نتائج الاختبارات وملاحظات الأعطال."],
            en: ["Read basic circuit schematics.", "Assist with assembling and measuring circuits.", "Record test results and troubleshooting notes."],
        },
        requirements: {
            ar: ["معرفة المكونات والدوائر التناظرية الأساسية.", "القدرة على استخدام أدوات القياس الأساسية.", "الالتزام بإجراءات السلامة في المعمل."],
            en: ["Knowledge of basic analog components and circuits.", "Ability to use basic measurement tools.", "Commitment to laboratory safety procedures."],
        },
    },
    {
        id: "digital-electronics",
        title: { ar: "فني إلكترونيات رقمية", en: "Digital Electronics Technician" },
        course: { ar: "الإلكترونيات الرقمية", en: "Digital Electronics" },
        summary: {
            ar: "المساهمة في اختبار الدوائر المنطقية والأنظمة الرقمية.",
            en: "Contribute to testing logic circuits and digital systems.",
        },
        responsibilities: {
            ar: ["تحليل الدوائر باستخدام البوابات المنطقية.", "المساعدة في تجميع واختبار نماذج رقمية.", "توثيق النتائج ومتابعة المشكلات."],
            en: ["Analyze circuits built from logic gates.", "Assist with assembling and testing digital prototypes.", "Document results and track issues."],
        },
        requirements: {
            ar: ["فهم البوابات المنطقية والجبر البولياني.", "معرفة أساسيات الدوائر الرقمية.", "الدقة والقدرة على اتباع خطوات الاختبار."],
            en: ["Understanding of logic gates and Boolean algebra.", "Knowledge of digital circuit fundamentals.", "Care and attention when following test procedures."],
        },
    },
    {
        id: "pcb",
        title: { ar: "مصمم لوحات دوائر مطبوعة مبتدئ", en: "Junior PCB Designer" },
        course: { ar: "تصميم لوحات الدوائر المطبوعة", en: "PCB Design" },
        summary: {
            ar: "تحويل المخططات الإلكترونية إلى تخطيطات PCB قابلة للمراجعة والتصنيع.",
            en: "Turn electronic schematics into PCB layouts ready for review and fabrication.",
        },
        responsibilities: {
            ar: ["إعداد المخططات والرموز الإلكترونية.", "تخطيط المكونات ومسارات التوصيل.", "مراجعة التصميم وتصدير ملفات التصنيع."],
            en: ["Prepare schematics and electronic symbols.", "Arrange components and route board traces.", "Review designs and export fabrication files."],
        },
        requirements: {
            ar: ["معرفة أساسيات المخططات الإلكترونية.", "القدرة على استخدام برنامج تصميم PCB.", "الانتباه للتفاصيل وقواعد تصميم اللوحات."],
            en: ["Knowledge of electronic schematic fundamentals.", "Ability to use a PCB design tool.", "Attention to detail and board design rules."],
        },
    },
    {
        id: "robotics",
        title: { ar: "مساعد تطوير روبوتات", en: "Robotics Development Assistant" },
        course: { ar: "الروبوتات", en: "Robotics" },
        summary: {
            ar: "المساعدة في بناء نماذج روبوتية تربط المستشعرات بالمشغلات وأنظمة التحكم.",
            en: "Help build robotic prototypes that connect sensors, actuators, and control systems.",
        },
        responsibilities: {
            ar: ["تجميع نماذج أولية واختبار مكوناتها.", "ربط المستشعرات والمشغلات بوحدات التحكم.", "تسجيل نتائج التجارب والمساهمة في حل المشكلات."],
            en: ["Assemble prototypes and test their components.", "Connect sensors and actuators to controllers.", "Record experiment results and help troubleshoot."],
        },
        requirements: {
            ar: ["أساسيات الإلكترونيات والروبوتات.", "معرفة أولية بالمستشعرات والمشغلات.", "الاستعداد للتعلم والعمل العملي ضمن فريق."],
            en: ["Fundamentals of electronics and robotics.", "Introductory knowledge of sensors and actuators.", "Willingness to learn and work hands-on in a team."],
        },
    },
];

function Jobs() {
    const { language } = useLanguage();
    const isEnglish = language === "en";
    const configured = isSupabaseConfigured();
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(configured);
    const [hasAccess, setHasAccess] = useState(false);
    const [activationCode, setActivationCode] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationError, setVerificationError] = useState("");
    const [selectedJobId, setSelectedJobId] = useState(null);

    useEffect(() => {
        if (!selectedJobId) return;

        document.getElementById(`job-details-${selectedJobId}`)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [selectedJobId]);

    useEffect(() => {
        if (!configured) return undefined;

        const supabase = getSupabaseClient();
        let isActive = true;
        const loadSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (!isActive) return;
            if (error) {
                setVerificationError(isEnglish
                    ? "Could not verify your account session. Please refresh the page."
                    : "تعذر التحقق من جلسة حسابك. حدّث الصفحة وحاول مرة أخرى.");
            } else {
                setUser(session?.user ?? null);
            }
            setAuthLoading(false);
        };
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!isActive || event === "INITIAL_SESSION") return;
            setUser(session?.user ?? null);
            setHasAccess(false);
        });

        loadSession();
        return () => {
            isActive = false;
            subscription.unsubscribe();
        };
    }, [configured, isEnglish]);

    const handleVerifyCode = async (event) => {
        event.preventDefault();
        setVerificationError("");
        setIsVerifying(true);

        try {
            const { data, error } = await getSupabaseClient().functions.invoke(
                "verify-jobs-access",
                { body: { accessCode: activationCode.trim() } },
            );
            if (error) {
                if (error.context instanceof Response) {
                    const response = await error.context.clone().json().catch(() => null);
                    if (isEnglish) {
                        const messages = {
                            400: "The secret code is incorrect.",
                            401: "Please sign in before entering the code.",
                            403: "Confirm your email address before continuing.",
                            429: "Too many attempts. Please wait 15 minutes and try again.",
                        };
                        setVerificationError(messages[error.context.status]
                            || "The code could not be verified. Please try again later.");
                    } else {
                        setVerificationError(response?.error || "تعذر التحقق من الرمز. حاول مرة أخرى.");
                    }
                } else {
                    setVerificationError(isEnglish
                        ? "Could not connect to the verification service. Please try again."
                        : "تعذر الاتصال بخدمة التحقق. حاول مرة أخرى.");
                }
                return;
            }
            if (!data?.success) {
                setVerificationError(isEnglish
                    ? "The code could not be verified. Please try again."
                    : "تعذر التحقق من الرمز. حاول مرة أخرى.");
                return;
            }

            setHasAccess(true);
            setActivationCode("");
            setVerificationError("");
        } catch {
            setVerificationError(isEnglish
                ? "Could not connect to the verification service. Please try again."
                : "تعذر الاتصال بخدمة التحقق. حاول مرة أخرى.");
        } finally {
            setIsVerifying(false);
        }
    };

    const title = isEnglish ? "Career paths" : "الفرص المهنية";
    const intro = isEnglish
        ? "Explore career paths connected to our courses. These are role profiles, not confirmed vacancies."
        : "تعرّف على المسارات المهنية المرتبطة بكورساتنا. هذه نماذج للمسميات والمهام وليست إعلانًا عن شواغر مؤكدة.";
    const Arrow = isEnglish ? ArrowRight : ArrowLeft;

    return (
        <>
            <main className="jobs-page" dir={isEnglish ? "ltr" : "rtl"}>
                {authLoading ? (
                    <section className="jobs-access-card" role="status">
                        <span className="jobs-access-icon"><LockKeyhole aria-hidden="true" /></span>
                        <p>{isEnglish ? "Checking your account..." : "جارٍ التحقق من حسابك..."}</p>
                    </section>
                ) : !configured ? (
                    <section className="jobs-access-card" role="alert">
                        <span className="jobs-access-icon"><LockKeyhole aria-hidden="true" /></span>
                        <h1>{isEnglish ? "Jobs access is unavailable" : "الدخول إلى الوظائف غير متاح"}</h1>
                        <p>{isEnglish
                            ? "The account service is not configured. Please contact the platform administrator."
                            : "خدمة الحسابات غير مهيأة. تواصل مع إدارة المنصة."}</p>
                    </section>
                ) : !user ? (
                    <section className="jobs-access-card">
                        <span className="jobs-access-icon"><LockKeyhole aria-hidden="true" /></span>
                        <h1>{isEnglish ? "Sign in to view career paths" : "سجّل الدخول لعرض الوظائف"}</h1>
                        <p>{isEnglish
                            ? "Sign in with a confirmed email address, then enter the administrator code."
                            : "سجّل الدخول ببريد إلكتروني مؤكد، ثم أدخل الرمز السري الذي حصلت عليه من المالك."}</p>
                        {verificationError && (
                            <p className="jobs-alert" role="alert">{verificationError}</p>
                        )}
                        <Link className="jobs-primary-button" to="/login">
                            {isEnglish ? "Sign in" : "تسجيل الدخول"}
                            <Arrow aria-hidden="true" />
                        </Link>
                    </section>
                ) : !user.email_confirmed_at ? (
                    <section className="jobs-access-card">
                        <span className="jobs-access-icon"><LockKeyhole aria-hidden="true" /></span>
                        <h1>{isEnglish ? "Confirm your email" : "أكد بريدك الإلكتروني"}</h1>
                        <p>{isEnglish
                            ? "Confirm your account email before entering the administrator code."
                            : "أكد البريد الإلكتروني لحسابك قبل إدخال الرمز السري."}</p>
                        <Link className="jobs-primary-button" to="/traning/induvial">
                            {isEnglish ? "Go to account verification" : "الذهاب إلى صفحة تأكيد الحساب"}
                            <Arrow aria-hidden="true" />
                        </Link>
                    </section>
                ) : !hasAccess ? (
                    <section className="jobs-access-card">
                        <span className="jobs-access-icon"><KeyRound aria-hidden="true" /></span>
                        <p className="jobs-eyebrow">TECHSPHERE · {isEnglish ? "PRIVATE ACCESS" : "دخول خاص"}</p>
                        <h1>{isEnglish ? "Enter the administrator code" : "أدخل الرمز السري"}</h1>
                        <p>{isEnglish
                            ? "This page is available to signed-in users with a confirmed email and the code shared by the administrator."
                            : "الصفحة متاحة للحسابات المسجلة ببريد مؤكد وبعد إدخال الرمز الذي يشاركه المالك."}</p>
                        {verificationError && (
                            <p className="jobs-alert" role="alert">{verificationError}</p>
                        )}
                        <form className="jobs-code-form" onSubmit={handleVerifyCode}>
                            <label htmlFor="jobs-access-code">{isEnglish ? "Secret code" : "الرمز السري"}</label>
                            <input
                                id="jobs-access-code"
                                type="password"
                                autoComplete="one-time-code"
                                value={activationCode}
                                onChange={(event) => setActivationCode(event.target.value)}
                                required
                            />
                            <button className="jobs-primary-button" type="submit" disabled={isVerifying}>
                                {isVerifying
                                    ? (isEnglish ? "Verifying..." : "جارٍ التحقق...")
                                    : (isEnglish ? "View career paths" : "عرض الوظائف")}
                                <Arrow aria-hidden="true" />
                            </button>
                        </form>
                        <p className="jobs-security-note">
                            <LockKeyhole aria-hidden="true" />
                            {isEnglish
                                ? "The code is verified securely and does not activate your training account."
                                : "يتم التحقق من الرمز بأمان، ولا يؤدي إدخاله إلى تفعيل حساب التدريب."}
                        </p>
                    </section>
                ) : (
                    <div className="jobs-content">
                        <header className="jobs-heading">
                            <span className="jobs-eyebrow"><BriefcaseBusiness aria-hidden="true" /> TECHSPHERE</span>
                            <h1>{title}</h1>
                            <p>{intro}</p>
                        </header>

                        <section className="jobs-list" aria-label={isEnglish ? "Career paths" : "الفرص المهنية"}>
                            {careerPaths.map((job) => (
                                <article className="jobs-card" key={job.id}>
                                    <span className="jobs-card-icon"><BriefcaseBusiness aria-hidden="true" /></span>
                                    <span className="jobs-career-label">
                                        {isEnglish ? "Career path · Not a confirmed vacancy" : "مسار مهني · ليس شاغرًا مؤكدًا"}
                                    </span>
                                    <p className="jobs-course">{job.course[language]}</p>
                                    <h2>{job.title[language]}</h2>
                                    <p className="jobs-summary">{job.summary[language]}</p>
                                    <button
                                        type="button"
                                        className="jobs-secondary-button"
                                        aria-expanded={selectedJobId === job.id}
                                        aria-controls={`job-details-${job.id}`}
                                        onClick={() => setSelectedJobId(
                                            selectedJobId === job.id ? null : job.id,
                                        )}
                                    >
                                        {selectedJobId === job.id
                                            ? (isEnglish ? "Hide details" : "إخفاء التفاصيل")
                                            : (isEnglish ? "View details and apply" : "عرض التفاصيل والتقديم")}
                                        <Arrow aria-hidden="true" />
                                    </button>
                                </article>
                            ))}
                        </section>

                        {selectedJobId && (
                            <JobDetails
                                key={selectedJobId}
                                job={careerPaths.find((job) => job.id === selectedJobId)}
                                user={user}
                                language={language}
                            />
                        )}
                        <button
                            type="button"
                            className="jobs-lock-button"
                            onClick={() => {
                                setHasAccess(false);
                                setSelectedJobId(null);
                            }}
                        >
                            {isEnglish ? "Lock this page" : "قفل الصفحة"}
                        </button>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}

function JobDetails({ job, user, language }) {
    const isEnglish = language === "en";
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formError, setFormError] = useState("");
    const [submissionNotice, setSubmissionNotice] = useState("");
    const sectionLabel = isEnglish ? "Role details" : "تفاصيل الفرصة المهنية";
    const listHeading = (english, arabic) => isEnglish ? english : arabic;

    const handleApply = async (event) => {
        event.preventDefault();
        setFormError("");
        setSubmissionNotice("");
        setIsSubmitting(true);
        const values = Object.fromEntries(new FormData(event.currentTarget).entries());
        const payload = {
            requestType: "job_application",
            name: values.name,
            phone: values.phone,
            jobTitle: job.title[language],
            courseName: job.course[language],
            portfolio: values.portfolio,
            message: values.message,
        };
        try {
            await submitSiteRequest(payload);
        } catch (error) {
            setFormError(language === "en"
                ? "We could not save your application. Please try again."
                : error.message || "تعذر حفظ طلب التقديم. حاول مرة أخرى.");
            setIsSubmitting(false);
            return;
        }

        try {
            await forwardFormspreeSubmission("mbggkeyd", {
                application_type: "Career path application",
                job_title: job.title[language],
                course_name: job.course[language],
                name: values.name,
                email: user.email,
                phone: values.phone,
                portfolio: values.portfolio,
                message: values.message,
            });
        } catch {
            setSubmissionNotice(isEnglish
                ? "Your application is saved in your account, but the email notification could not be sent."
                : "تم حفظ طلبك في حسابك، لكن تعذر إرسال نسخة البريد.");
        }
        setIsSubmitted(true);
        setIsSubmitting(false);
    };

    return (
        <section className="jobs-details" id={`job-details-${job.id}`} aria-labelledby="job-details-title">
            <div className="jobs-details-heading">
                <p className="jobs-course">{job.course[language]}</p>
                <h2 id="job-details-title">{job.title[language]}</h2>
                <p>{job.summary[language]}</p>
            </div>
            <div className="jobs-details-columns">
                <div>
                    <h3>{listHeading("Typical responsibilities", "المهام المتوقعة")}</h3>
                    <ul>{job.responsibilities[language].map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
                <div>
                    <h3>{listHeading("Useful skills", "المهارات المناسبة")}</h3>
                    <ul>{job.requirements[language].map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
            </div>
            <div className="jobs-application">
                <h3>{listHeading("Apply for this career path", "قدّم على هذه الفرصة المهنية")}</h3>
                <p>{isEnglish
                    ? "Send your details and portfolio. Our team will review your application and contact you if a suitable opportunity is available."
                    : "أرسل بياناتك ورابط أعمالك. سيراجع فريقنا طلبك ويتواصل معك عند توفر فرصة مناسبة."}</p>
                {isSubmitted ? (
                    <div className="jobs-success" role="status" aria-live="polite">
                        {isEnglish
                            ? "Your application was saved. You can follow its status from your account."
                            : "تم حفظ طلبك. يمكنك متابعة حالته من صفحة حسابك."}
                        {submissionNotice && <p>{submissionNotice}</p>}
                    </div>
                ) : (
                    <form className="jobs-application-form fs-form" onSubmit={handleApply}>
                        <input type="hidden" name="application_type" value="Career path application" />
                        <input type="hidden" name="job_title" value={job.title[language]} />
                        <input type="hidden" name="course_name" value={job.course[language]} />
                        <div className="jobs-form-grid">
                            <div className="jobs-field">
                                <label htmlFor={`jobs-name-${job.id}`}>{isEnglish ? "Full name" : "الاسم بالكامل"}</label>
                                <input
                                    className="fs-input"
                                    id={`jobs-name-${job.id}`}
                                    name="name"
                                    autoComplete="name"
                                    defaultValue={user.user_metadata?.full_name || ""}
                                    required
                                />
                            </div>
                            <div className="jobs-field">
                                <label htmlFor={`jobs-email-${job.id}`}>{isEnglish ? "Email address" : "البريد الإلكتروني"}</label>
                                <input
                                    className="fs-input"
                                    id={`jobs-email-${job.id}`}
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    defaultValue={user.email || ""}
                                    required
                                    dir="ltr"
                                />
                            </div>
                            <div className="jobs-field">
                                <label htmlFor={`jobs-phone-${job.id}`}>{isEnglish ? "Phone number" : "رقم الهاتف"}</label>
                                <input
                                    className="fs-input"
                                    id={`jobs-phone-${job.id}`}
                                    name="phone"
                                    type="tel"
                                    autoComplete="tel"
                                    required
                                    dir="ltr"
                                />
                            </div>
                            <div className="jobs-field">
                                <label htmlFor={`jobs-portfolio-${job.id}`}>{isEnglish ? "Portfolio or profile link" : "رابط معرض الأعمال أو الملف المهني"}</label>
                                <input
                                    className="fs-input"
                                    id={`jobs-portfolio-${job.id}`}
                                    name="portfolio"
                                    type="url"
                                    placeholder="https://"
                                    dir="ltr"
                                />
                            </div>
                            <div className="jobs-field jobs-field-wide">
                                <label htmlFor={`jobs-message-${job.id}`}>{isEnglish ? "Tell us about your experience" : "أخبرنا عن خبراتك"}</label>
                                <textarea
                                    className="fs-textarea"
                                    id={`jobs-message-${job.id}`}
                                    name="message"
                                    rows="4"
                                />
                            </div>
                        </div>
                        {formError && (
                            <div className="jobs-alert" role="alert">
                                {formError}
                            </div>
                        )}
                        <button
                            className="jobs-primary-button"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? (isEnglish ? "Sending..." : "جارٍ الإرسال...")
                                : (isEnglish ? "Submit application" : "إرسال طلب التقديم")}
                        </button>
                    </form>
                )}
            </div>
            <span className="sr-only">{sectionLabel}</span>
        </section>
    );
}

export default Jobs;
