import { useEffect, useMemo, useState, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ArrowLeft, AlertCircle, CheckCircle2, Loader2, Phone, Mail, MapPin, Hash, Calendar, FileText } from "lucide-react";
import { getSupabaseClient, isSupabaseConfigured } from "../login/supabase";
import { useLanguage } from "../i18n/language";
import { callProjectService } from "./marketplaceApi";
import "./Projects.css";
import "./ProjectRequest.css";

function formatMoney(value, isEnglish) {
    const num = Number(value);
    if (!isEnglish) {
        return new Intl.NumberFormat("ar-EG", { style: "currency", currency: "EGP" }).format(num);
    }
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "EGP" }).format(num);
}

function formatDate(value, isEnglish) {
    if (!value) return "—";
    return new Intl.DateTimeFormat(isEnglish ? "en-US" : "ar-EG", { dateStyle: "medium" }).format(new Date(value));
}

export default function ProjectRequestForm() {
    const { language } = useLanguage();
    const isEnglish = language === "en";
    const history = useHistory();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [project, setProject] = useState(null);
    const [category, setCategory] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [orderNumber, setOrderNumber] = useState("");

    const urlParams = new URLSearchParams(location.search);
    const projectId = urlParams.get("projectId") || urlParams.get("slug") || urlParams.get("id") || "";

    const [form, setForm] = useState({
        buyer_name: "",
        buyer_phone: "",
        buyer_email: "",
        delivery_address: "",
        min_budget: "",
        max_budget: "",
        budget_currency: "EGP",
        delivery_deadline: "14",
        additional_message: "",
    });

    const deliveryOptions = useMemo(() => [
        { value: "7", label: isEnglish ? "7 Days" : "7 أيام" },
        { value: "14", label: isEnglish ? "14 Days" : "14 يومًا" },
        { value: "30", label: isEnglish ? "30 Days" : "30 يومًا" },
        { value: "45", label: isEnglish ? "45 Days" : "45 يومًا" },
        { value: "custom", label: isEnglish ? "Custom Duration" : "مدة مخصصة" },
    ], [isEnglish]);

    const [customDays, setCustomDays] = useState("");

    const loadProject = useCallback(async () => {
        if (!projectId) {
            setErrorMessage(isEnglish
                ? "No project specified. Please return to the project details page and try again."
                : "لم يتم تحديد مشروع. يرجى العودة إلى صفحة تفاصيل المشروع والمحاولة مرة أخرت.");
            setIsLoading(false);
            return;
        }
        try {
            setErrorMessage("");
            const [projectData, catalog] = await Promise.all([
                callProjectService("public_project", { slug: projectId }),
                callProjectService("catalog"),
            ]);
            const proj = projectData.project;
            const cat = catalog.categories?.find((item) => item.id === proj.category_id) || null;
            setProject(proj);
            setCategory(cat);

            const supabase = getSupabaseClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setForm((prev) => ({
                    ...prev,
                    buyer_name: prev.buyer_name || session.user.user_metadata?.full_name || "",
                    buyer_email: prev.buyer_email || session.user.email || "",
                }));
            }
        } catch (err) {
            setErrorMessage(err.message || (isEnglish ? "Failed to load project." : "فشل تحميل المشروع."));
        } finally {
            setIsLoading(false);
        }
    }, [projectId, isEnglish]);

    useEffect(() => {
        loadProject();
    }, [loadProject]);

    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrorMessage("");
    };

    const handleCustomDaysChange = (event) => {
        setCustomDays(event.target.value);
        handleChange("delivery_deadline", event.target.value);
    };

    const validate = () => {
        const { buyer_name, buyer_phone, buyer_email, delivery_address, min_budget, max_budget, delivery_deadline } = form;
        if (!buyer_name || buyer_name.trim().length < 2) {
            return isEnglish ? "Please enter your full name (at least 2 characters)." : "يرجى إدخال الاسم الكامل (حرفان على الأقل).";
        }
        if (!buyer_phone || buyer_phone.trim().length < 7) {
            return isEnglish ? "Please enter a valid phone number." : "يرجى إدخال رقم هاتف صالح.";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!buyer_email || !emailRegex.test(buyer_email.trim())) {
            return isEnglish ? "Please enter a valid email address." : "يرجى إدخال بريد إلكتروني صالح.";
        }
        if (!delivery_address || delivery_address.trim().length < 8) {
            return isEnglish ? "Please enter your delivery address." : "يرجى إدخال عنوان التسليم.";
        }
        const min = Number(min_budget);
        const max = Number(max_budget);
        if (!min_budget || !max_budget || isNaN(min) || isNaN(max) || min < 0 || max < 0) {
            return isEnglish ? "Please enter valid non-negative budget values." : "يرجى إدخال قيم ميزانية صحيحة وغير سالبة.";
        }
        if (min > max) {
            return isEnglish ? "Minimum budget cannot exceed maximum budget." : "لا يمكن أن تتجاوز الميزانية الدنيا الميزانية العليا.";
        }
        const deadline = delivery_deadline === "custom" ? customDays : delivery_deadline;
        if (!deadline || isNaN(Number(deadline)) || Number(deadline) <= 0) {
            return isEnglish ? "Please select or enter a valid delivery deadline." : "يرجى اختيار أو إدخال موعد تسليم صالح.";
        }
        return null;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!isSupabaseConfigured()) {
            setErrorMessage(isEnglish ? "Project requests are not available right now." : "طلبات المشاريع غير متاحة حاليًا.");
            return;
        }

        const validationError = validate();
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        const { data: { session }, error: sessionError } = await getSupabaseClient().auth.getSession();
        if (sessionError) {
            setErrorMessage(sessionError.message);
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                project_id: project.id,
                category_id: project.category_id || (category ? category.id : ""),
                buyer_name: form.buyer_name.trim(),
                buyer_phone: form.buyer_phone.trim(),
                buyer_email: form.buyer_email.trim(),
                delivery_address: form.delivery_address.trim(),
                min_budget: Number(form.min_budget),
                max_budget: Number(form.max_budget),
                budget_currency: "EGP",
                delivery_deadline: form.delivery_deadline === "custom" ? `${customDays} days` : `${form.delivery_deadline} days`,
                additional_message: form.additional_message.trim(),
            };

            const result = await callProjectService("project_request_submit", payload);
            if (result.request) {
                setOrderNumber(result.request.order_number);
                setSubmitted(true);
                setSuccessMessage(isEnglish
                    ? "Your project request has been submitted successfully."
                    : "تم إرسال طلب مشروعك بنجاح.");
            } else if (result.error && result.error.status === 409) {
                // Duplicate pending request detected
                setErrorMessage(isEnglish
                    ? "You already have a pending project request for this project. Order Number: " + result.error.order_number
                    : "لديك طلب قيد المراجعة بالفعل لهذا المشروع. رقم الطلب: " + result.error.order_number);
            } else if (result.error) {
                setErrorMessage(result.error.message || (isEnglish ? "Submission failed. Please try again." : "فشل الإرسال. يرجى المحاولة مرة أخرت."));
            }
        } catch (err) {
            setErrorMessage(err.message || (isEnglish ? "Submission failed. Please try again." : "فشل الإرسال. يرجى المحاولة مرة أخرت."));
        } finally {
            setIsSubmitting(false);
        }
    };

    const projectTitle = (p) => (isEnglish ? p.title_en : p.title_ar) || (isEnglish ? "Untitled Project" : "مشروع بدون عنواك");
    const projectDesc = (p) => (isEnglish ? p.public_description_en : p.public_description_ar) || "";
    const categoryTitle = (c) => (isEnglish ? c.title_en : c.title_ar) || (isEnglish ? "General Category" : "تصنيف عام");

    if (isLoading) {
        return (
            <>
                <main className="services-page" dir={isEnglish ? "ltr" : "rtl"}>
                    <div className="services-state" role="status">
                        <Loader2 size={24} aria-hidden="true" />
                        <p>{isEnglish ? "Loading project details..." : "جارٍ تحميل تفاصيل المشروع..."}</p>
                    </div>
                </main>
            </>
        );
    }

    if (errorMessage && !project) {
        return (
            <>
                <main className="services-page" dir={isEnglish ? "ltr" : "rtl"}>
                    <div className="services-state is-error" role="alert">
                        <AlertCircle size={28} aria-hidden="true" />
                        <p>{errorMessage}</p>
                        <button className="project-button project-button-primary" onClick={() => history.goBack()}>
                            {isEnglish ? "Back" : "العودة"}
                        </button>
                    </div>
                </main>
            </>
        );
    }

    if (submitted) {
        const whatsappText = isEnglish
            ? `Hello Techshpere, I submitted a project quotation request.\n\nOrder Number: ${orderNumber}\nProject: ${projectTitle(project)}\nPlease confirm my order and contact me to discuss details.`
            : `مرحبًا Techshpere، قمت بإرسال طلب عرض سعر لمشروع.\n\nرقم الطلب: ${orderNumber}\nالمشروع: ${projectTitle(project)}\nيرجى تأكيد الطلب والتواصل معي لمناقشة التفاصيل.`;
        const whatsappLink = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
        return (
            <>
                <main className="services-page" dir={isEnglish ? "ltr" : "rtl"}>
                    <section className="request-success">
                        <div className="request-success-card">
                            <div className="success-icon">
                                <CheckCircle2 size={56} aria-hidden="true" />
                            </div>
                            <h1>{isEnglish ? "Order Confirmed" : "تم تأكيد طلبف"}</h1>
                            <p className="success-lead">{isEnglish
                                ? "Your quotation request has been received and is now pending administrator review."
                                : "تم استلام طلب عرض السعر الخاص بك وهو الآن قيد مراجعة المسؤول."}</p>

                            <div className="order-reference-box">
                                <span className="order-ref-label">{isEnglish ? "Order Number" : "رقم الطلب"}</span>
                                <span className="order-ref-value">{orderNumber}</span>
                            </div>

                            <div className="success-details">
                                <div className="detail-item">
                                    <span className="detail-label">{isEnglish ? "Project" : "المشروع"}</span>
                                    <span className="detail-value">{projectTitle(project)}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">{isEnglish ? "Category" : "التصنيف"}</span>
                                    <span className="detail-value">{categoryTitle(category)}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">{isEnglish ? "Status" : "الحالة"}</span>
                                    <span className="detail-value detail-status">{isEnglish ? "Pending Review" : "قيد المراجعة"}</span>
                                </div>
                            </div>

                            <p className="success-note">{isEnglish
                                ? "An administrator will contact you shortly to discuss requirements, budget, and delivery."
                                : "سيتواصل معك مسؤول لمناقشة المتطلبات والميزانية وموعد التسليم قريبًا."}</p>

                            <div className="success-actions">
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="project-button project-button-whatsapp success-whatsapp"
                                >
                                    <Mail size={18} aria-hidden="true" />
                                    {isEnglish ? "Contact Admin on WhatsApp" : "تواصل مع المسؤول على واتساب"}
                                </a>
                                <div className="success-actions-secondary">
                                    <button className="project-button project-button-secondary" onClick={() => history.push("/my-projects")}>
                                        {isEnglish ? "My Projects" : "مشاريعي"}
                                    </button>
                                    <button className="project-button project-button-secondary" onClick={() => history.push("/services")}>
                                        {isEnglish ? "Browse More" : "استعرض المزيد"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </>
        );
    }

    return (
        <>
            <main className="services-page request-form-page" dir={isEnglish ? "ltr" : "rtl"}>
                <section className="request-hero">
                    <div className="request-hero-copy">
                        <span className="project-eyebrow">{isEnglish ? "PROJECT REQUEST FORM" : "نموذج طلب مشروع"}</span>
                        <h1>{isEnglish ? "Request This Project" : "اطلب هذا المشروع"}</h1>
                        <p>{isEnglish
                            ? "Submit a quotation request for the selected project. An administrator will contact you to discuss details."
                            : "قدم طلب عرض سعر للمشروع المحدد. سيتواصل معك مسؤول لمناقشة التفاصيل."}</p>
                    </div>
                </section>

                <section className="request-form-section">
                    <div className="request-form-container">
                        <article className="request-panel">
                            <h2>{isEnglish ? "Selected Project" : "المشروع المحدد"}</h2>
                            <div className="request-project-row">
                                {project.image_url ? (
                                    <img src={project.image_url} alt={projectTitle(project)} className="request-project-image" />
                                ) : (
                                    <span className="request-project-placeholder" aria-hidden="true"><Hash size={32} /></span>
                                )}
                                <div className="request-project-details">
                                    <div className="request-field">
                                        <dt>{isEnglish ? "Project Name" : "اسم المشروع"}</dt>
                                        <dd>{projectTitle(project)}</dd>
                                    </div>
                                    <div className="request-field">
                                        <dt>{isEnglish ? "Project Code / ID" : "رقم المشروع / المعرف"}</dt>
                                        <dd>{project.project_code || project.id}</dd>
                                    </div>
                                    <div className="request-field">
                                        <dt>{isEnglish ? "Category" : "التصنيف"}</dt>
                                        <dd>{categoryTitle(category)}</dd>
                                    </div>
                                    <div className="request-field request-field-full">
                                        <dt>{isEnglish ? "Description" : "الوصف"}</dt>
                                        <dd>{projectDesc(project)}</dd>
                                    </div>
                                </div>
                            </div>
                            <p className="request-notice">{isEnglish
                                ? "The selected project cannot be changed from this form."
                                : "لا يمكن تغيير المشروع المحدد من هذا النموذج."}</p>
                        </article>
                        <form onSubmit={handleSubmit} className="request-form">
                            <article className="request-panel">
                                <h2>{isEnglish ? "Buyer Information" : "بيانات المشتري"}</h2>
                                <div className="request-grid">
                                    <div className="request-field request-field-full">
                                        <label htmlFor="req-name">{isEnglish ? "Full Name" : "الاسم الكامل"}</label>
                                        <input
                                            type="text"
                                            id="req-name"
                                            name="buyer_name"
                                            value={form.buyer_name}
                                            onChange={(e) => handleChange("buyer_name", e.target.value)}
                                            placeholder={isEnglish ? "Enter your full name" : "أدخل اسمك الكامل"}
                                            required
                                            aria-required="true"
                                        />
                                        <span className="hint">{isEnglish ? "Your full name as it appears on your ID." : "اسمك الكامل كما يظهر في بطاقة الهوية."}</span>
                                    </div>
                                    <div className="request-field">
                                        <label htmlFor="req-phone">{isEnglish ? "Phone Number" : "رقم الهاتف"}</label>
                                        <input
                                            type="tel"
                                            id="req-phone"
                                            name="buyer_phone"
                                            dir="ltr"
                                            value={form.buyer_phone}
                                            onChange={(e) => handleChange("buyer_phone", e.target.value)}
                                            placeholder={isEnglish ? "e.g. +20 101 234 5678" : "+20 101 234 5678"}
                                            required
                                            aria-required="true"
                                        />
                                        <Phone size={16} className="field-icon" aria-hidden="true" />
                                    </div>
                                    <div className="request-field">
                                        <label htmlFor="req-email">{isEnglish ? "Email Address" : "البريد الإلكتروني"}</label>
                                        <input
                                            type="email"
                                            id="req-email"
                                            name="buyer_email"
                                            dir="ltr"
                                            value={form.buyer_email}
                                            onChange={(e) => handleChange("buyer_email", e.target.value)}
                                            placeholder="name@example.com"
                                            required
                                            aria-required="true"
                                        />
                                        <Mail size={16} className="field-icon" aria-hidden="true" />
                                    </div>
                                    <div className="request-field request-field-full">
                                        <label htmlFor="req-address">{isEnglish ? "Delivery Address" : "عنوان التسليم"}</label>
                                        <textarea
                                            id="req-address"
                                            name="delivery_address"
                                            value={form.delivery_address}
                                            onChange={(e) => handleChange("delivery_address", e.target.value)}
                                            rows={3}
                                            placeholder={isEnglish ? "Enter your delivery address" : "أدخل عنوان التسليم"}
                                            required
                                            aria-required="true"
                                        />
                                        <MapPin size={16} className="field-icon" aria-hidden="true" />
                                    </div>
                                </div>
                            </article>
                            <article className="request-panel request-panel-budget">
                            <h2>{isEnglish ? "Budget Range" : "نطاق الميزانية"}</h2>
                            <div className="budget-controls">
                                <div className="request-field">
                                    <label htmlFor="req-min-budget">{isEnglish ? "Minimum Budget" : "الحد الأدنى للميزانية"}</label>
                                    <input
                                        type="number"
                                        id="req-min-budget"
                                        name="min_budget"
                                        dir="ltr"
                                        value={form.min_budget}
                                        onChange={(e) => handleChange("min_budget", e.target.value)}
                                        min="0"
                                        step="0.01"
                                        placeholder="0"
                                        required
                                        aria-required="true"
                                    />
                                    <span className="currency">{form.budget_currency}</span>
                                </div>
                                <div className="request-field">
                                    <label htmlFor="req-max-budget">{isEnglish ? "Maximum Budget" : "الحد الأقصى للميزانية"}</label>
                                    <input
                                        type="number"
                                        id="req-max-budget"
                                        name="max_budget"
                                        dir="ltr"
                                        value={form.max_budget}
                                        onChange={(e) => handleChange("max_budget", e.target.value)}
                                        min="0"
                                        step="0.01"
                                        placeholder="0"
                                        required
                                        aria-required="true"
                                    />
                                    <span className="currency">{form.budget_currency}</span>
                                </div>
                                <div className="request-field request-budget-currency">
                                    <label htmlFor="req-currency">{isEnglish ? "Currency" : "العملة"}</label>
                                    <select
                                        id="req-currency"
                                        name="budget_currency"
                                        value={form.budget_currency}
                                        onChange={(e) => handleChange("budget_currency", e.target.value)}
                                    >
                                        <option value="EGP">EGP</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                        <option value="SAR">SAR</option>
                                        <option value="AED">AED</option>
                                        <option value="GBP">GBP</option>
                                    </select>
                                </div>
                            </div>
                            <p className="budget-hint">{isEnglish
                                ? "Tell us what you can afford — your budget is a starting point for the quote, not a commitment."
                                : "اكتب الميزانية اللي تقدر عليها — الميزانية نقطة بداية للعرض النهائي، مش التزام."}</p>
                        </article>
                        <article className="request-panel request-panel-delivery">
                            <h2>{isEnglish ? "Delivery Deadline" : "موعد التسليم المطلوب"}</h2>
                            <div className="deadline-options">
                                {deliveryOptions.map((opt) => (
                                    <label key={opt.value} className={`deadline-option ${form.delivery_deadline === opt.value ? "is-active" : ""}`}>
                                        <input
                                            type="radio"
                                            name="delivery_deadline"
                                            value={opt.value}
                                            checked={form.delivery_deadline === opt.value}
                                            onChange={() => {
                                                handleChange("delivery_deadline", opt.value);
                                                if (opt.value !== "custom") setCustomDays("");
                                            }}
                                            required
                                        />
                                        <span>{opt.label}</span>
                                    </label>
                                ))}
                                {form.delivery_deadline === "custom" && (
                                    <div className="request-field custom-days-field">
                                        <label htmlFor="req-custom-days">{isEnglish ? "Custom Days" : "أيام مخصصة"}</label>
                                        <input
                                            type="number"
                                            id="req-custom-days"
                                            value={customDays}
                                            onChange={handleCustomDaysChange}
                                            min="1"
                                            placeholder={isEnglish ? "e.g. 21" : "مثال: ٢١"}
                                            required
                                        />
                                        <span className="unit">{isEnglish ? "days" : "يومًا"}</span>
                                    </div>
                                )}
                            </div>
                        </article>
                        <article className="request-panel request-panel-notes">
                            <h2>{isEnglish ? "Additional Requirements" : "متطلبات إضافية"}</h2>
                            <label className="notes-label" htmlFor="req-notes">{isEnglish ? "Describe any special requirements, modifications, or preferred technologies." : "صف أي متطلبات خاصة أو تعديلات أو تقنيات مفضلة."}</label>
                            <textarea
                                id="req-notes"
                                name="additional_message"
                                value={form.additional_message}
                                onChange={(e) => handleChange("additional_message", e.target.value)}
                                rows={5}
                                placeholder={isEnglish ? "Optional additional notes..." : "ملاحظات إضافية اختيارية..."}
                            />
                            <FileText size={16} className="field-icon notes-icon" aria-hidden="true" />
                        </article>

                        <div className="request-form-actions">
                            {isSubmitting ? (
                                <button type="button" className="project-button project-button-primary request-submit-button" disabled>
                                    <Loader2 size={18} aria-hidden="true" />
                                    {isEnglish ? "Submitting..." : "جارٍ الإرسال..."}
                                </button>
                            ) : (
                                <>
                                    <button type="submit" className="project-button project-button-primary request-submit-button">
                                        <FileText size={18} aria-hidden="true" />
                                        {isEnglish ? "Submit Price Request" : "إرسال طلب عرض السعر"}
                                    </button>
                                    <button type="button" className="project-button project-button-secondary" onClick={() => history.goBack()}>
                                        {isEnglish ? "Cancel" : "إلغاء"}
                                    </button>
                                </>
                            )}
                        </div>
                        </form>
                    </div>
                </section>
            </main>
        </>
    );
}


