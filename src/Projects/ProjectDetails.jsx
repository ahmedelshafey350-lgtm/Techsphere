import { useEffect, useMemo, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Boxes, KeyRound, MessageCircle, ShoppingBag } from "lucide-react";
import { getSupabaseClient, isSupabaseConfigured } from "../login/supabase";
import { useLanguage } from "../i18n/language";
import { servicesWhatsAppLink } from "../config/servicesContact";
import { callProjectService } from "./marketplaceApi";
import { projectDescription } from "./projectSummary";
import "./Projects.css";

export default function ProjectDetails() {
    const { slug } = useParams();
    const history = useHistory();
    const location = useLocation();
    const { language } = useLanguage();
    const isEnglish = language === "en";
    const [project, setProject] = useState(null);
    const [category, setCategory] = useState(null);
    const [failedImageUrl, setFailedImageUrl] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [order, setOrder] = useState(null);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [orderForm, setOrderForm] = useState({
        customerName: "",
        phone: "",
        budgetRange: "",
        deliveryWindow: "",
        address: "",
        notes: "",
    });
    const isRenewal = useMemo(
        () => new URLSearchParams(location.search).get("renew") === "1",
        [location.search],
    );

    useEffect(() => {
        let isActive = true;
        setIsLoading(true);
        setProject(null);
        setOrder(null);
        setErrorMessage("");
        Promise.all([
            callProjectService("public_project", { slug }),
            callProjectService("catalog"),
        ])
            .then(([projectData, catalog]) => {
                if (!isActive) return;
                setProject(projectData.project);
                setCategory(catalog.categories?.find((item) => item.id === projectData.project.category_id) || null);
            })
            .catch((error) => {
                if (isActive) setErrorMessage(error.message);
            })
            .finally(() => {
                if (isActive) setIsLoading(false);
            });
        return () => { isActive = false; };
    }, [slug]);

    const beginOrder = async () => {
        setErrorMessage("");
        if (!isSupabaseConfigured()) {
            setErrorMessage(isEnglish ? "Project requests are not available right now." : "طلبات المشاريع غير متاحة حاليًا.");
            return;
        }
        const { data: { session }, error } = await getSupabaseClient().auth.getSession();
        if (error) {
            setErrorMessage(error.message);
            return;
        }
        if (!session?.user) {
            history.push("/login", { from: `${location.pathname}${location.search}` });
            return;
        }
        if (isRenewal) {
            setIsCreatingOrder(true);
            try {
                const result = await callProjectService("create_order", {
                    projectId: project.id,
                    orderType: "renewal",
                });
                setOrder(result.order);
            } catch (requestError) {
                setErrorMessage(requestError.message);
            } finally {
                setIsCreatingOrder(false);
            }
            return;
        }
        setShowOrderForm(true);
    };

    const handleOrder = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        const { data: { session }, error } = await getSupabaseClient().auth.getSession();
        if (error) {
            setErrorMessage(error.message);
            return;
        }
        if (!session?.user) {
            history.push("/login", { from: `${location.pathname}${location.search}` });
            return;
        }
        setIsCreatingOrder(true);
        try {
            const result = await callProjectService("create_order", {
                projectId: project.id,
                orderType: "purchase",
                requestDetails: {
                    customerName: orderForm.customerName.trim(),
                    phone: orderForm.phone.trim(),
                    budgetRange: orderForm.budgetRange,
                    deliveryWindow: orderForm.deliveryWindow,
                    address: orderForm.address.trim(),
                    notes: orderForm.notes.trim(),
                },
            });
            setOrder(result.order);
            setShowOrderForm(false);
        } catch (requestError) {
            setErrorMessage(requestError.message);
        } finally {
            setIsCreatingOrder(false);
        }
    };

    const title = project ? (isEnglish ? project.title_en : project.title_ar) : "";
    const description = project
        ? projectDescription({ ...project, category_slug: category?.slug }, isEnglish)
        : "";
    const contactMessage = project && order
        ? (isEnglish
            ? `Hello Techshpere, I created a project order and would like help with payment confirmation.\n\nProject: ${project.title_en}\nProject ID: ${project.project_code}\nOrder Reference: ${order.order_reference}`
            : `مرحبًا Techshpere، أنشأت طلب مشروع وأحتاج إلى المساعدة في تأكيد الدفع.\n\nالمشروع: ${project.title_ar}\nرقم المشروع: ${project.project_code}\nرقم الطلب: ${order.order_reference}`)
        : "";

    return (
        <>
            <main className="project-page" dir={isEnglish ? "ltr" : "rtl"}>
                <article className="project-detail-shell">
                    <Link className="project-back-link" to="/services">
                        {isEnglish ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}
                        {isEnglish ? "All projects" : "كل المشاريع"}
                    </Link>
                    {isLoading ? (
                        <div className="services-state" role="status">{isEnglish ? "Loading project..." : "جارٍ تحميل المشروع..."}</div>
                    ) : errorMessage && !project ? (
                        <div className="project-alert" role="alert">{errorMessage}</div>
                    ) : project && (
                        <>
                            <header className="project-detail-heading">
                                <span className="project-eyebrow">{category ? (isEnglish ? category.title_en : category.title_ar) : ""}</span>
                                <h1>{title}</h1>
                            </header>
                            {project.image_url && failedImageUrl !== project.image_url ? (
                                <img
                                    className="project-detail-image"
                                    src={project.image_url}
                                    alt={project.image_alt_text || title}
                                    onError={() => setFailedImageUrl(project.image_url)}
                                />
                            ) : (
                                <div className="project-detail-image-placeholder" role="img" aria-label={title}>
                                    <Boxes size={42} aria-hidden="true" />
                                    <span>{isEnglish ? "Project image is not available yet" : "صورة المشروع غير متاحة حتى الآك"}</span>
                                </div>
                            )}
                            <p className="project-detail-copy" lang={language}>{description}</p>

                            {project.is_for_sale && Number(project.price) > 0 ? (
                                <>
                                    <p className="project-detail-price">
                                        {new Intl.NumberFormat(isEnglish ? "en-US" : "ar-EG").format(project.price)} {project.currency_code}
                                    </p>
                                    <div className="project-order-box">
                                        <h2>{isEnglish ? "Request this project" : "اطلب هذا المشروع"}</h2>
                                        <p>
                                            {isEnglish
                                                ? "Send your project request with contact and delivery details. The displayed project price remains the amount due; your budget range is only a preference. Access is enabled after the administrator confirms payment."
                                                : "أرسل طلبك مع بيانات التواصل والتسليم. سعر المشروع المعروض هو مبلغ الطلب، والميزانية التي تختارها مجرد توقع. يتم فتح التفاصيل بعد تأكيد الأدمن استلام الدفع."}
                                        </p>
                                        {errorMessage && <div className="project-alert" role="alert">{errorMessage}</div>}
                                        {order ? (
                                            <div className="project-order-result" role="status">
                                                {isEnglish
                                                    ? "Your request is pending. Keep this reference and contact us if you need help arranging payment."
                                                    : "طلبك قيد المراجعة. احتفظ برقم الطلب وتواصل معنا إذا احتجت للمساعدة في ترتيب الدفع."}
                                                <span className="project-order-reference">{order.order_reference}</span>
                                                <p>
                                                    {isEnglish
                                                        ? `Requested amount: ${new Intl.NumberFormat("en-US").format(order.amount)} ${order.currency_code}. Your request is waiting for administrator review and payment confirmation.`
                                                        : `قيمة الطلب: ${new Intl.NumberFormat("ar-EG").format(order.amount)} ${order.currency_code}. طلبك بانتظار مراجعة الأدمن وتأكيد الدفع.`}
                                                </p>
                                                <div className="my-project-actions">
                                                    <Link className="project-button project-button-primary" to="/my-projects">
                                                        {isEnglish ? "My projects and orders" : "مشاريعي وطلباتي"}
                                                    </Link>
                                                    <a
                                                        className="project-button project-button-whatsapp"
                                                        href={servicesWhatsAppLink(contactMessage)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <MessageCircle size={18} />
                                                        {isEnglish ? "Contact Services" : "تواصل مع الخدمات"}
                                                    </a>
                                                </div>
                                            </div>
                                        ) : isRenewal ? (
                                            <button
                                                className="project-button project-button-primary"
                                                type="button"
                                                onClick={beginOrder}
                                                disabled={isCreatingOrder}
                                            >
                                                <ShoppingBag size={18} aria-hidden="true" />
                                                {isEnglish ? "Request renewal" : "طلب تجديد الصلاحية"}
                                            </button>
                                        ) : showOrderForm ? (
                                            <form className="project-request-form" onSubmit={handleOrder}>
                                                <label>
                                                    <span>{isEnglish ? "Customer name" : "الاسم"}</span>
                                                    <input
                                                        autoComplete="name"
                                                        maxLength={120}
                                                        minLength={2}
                                                        required
                                                        value={orderForm.customerName}
                                                        onChange={(event) => setOrderForm((current) => ({ ...current, customerName: event.target.value }))}
                                                    />
                                                </label>
                                                <label>
                                                    <span>{isEnglish ? "Project" : "المشروع"}</span>
                                                    <input value={title} readOnly />
                                                </label>
                                                <label>
                                                    <span>{isEnglish ? "Expected budget range" : "حدود الميزانية المتوقعة"}</span>
                                                    <select
                                                        required
                                                        value={orderForm.budgetRange}
                                                        onChange={(event) => setOrderForm((current) => ({ ...current, budgetRange: event.target.value }))}
                                                    >
                                                        <option value="">{isEnglish ? "Choose a range" : "اختر النطات"}</option>
                                                        <option value="under_3000">{isEnglish ? `Under 3,000 ${project.currency_code}` : `أقل من ٣٬٠٠٠ ${project.currency_code}`}</option>
                                                        <option value="3000_7000">{isEnglish ? `3,000–7,000 ${project.currency_code}` : `من ٣٬٠٠٠ إلى ٧٬٠٠٠ ${project.currency_code}`}</option>
                                                        <option value="7000_15000">{isEnglish ? `7,000–15,000 ${project.currency_code}` : `من ٧٬٠٠٠ إلى ١٥٬٠٠٠ ${project.currency_code}`}</option>
                                                        <option value="over_15000">{isEnglish ? `Over 15,000 ${project.currency_code}` : `أكثر من ١٥٬٠٠٠ ${project.currency_code}`}</option>
                                                        <option value="flexible">{isEnglish ? "Flexible / discuss with me" : "مرنة / أفضّل مناقشتها"}</option>
                                                    </select>
                                                </label>
                                                <label>
                                                    <span>{isEnglish ? "Phone number" : "رقم الهاتف"}</span>
                                                    <input
                                                        autoComplete="tel"
                                                        maxLength={30}
                                                        minLength={7}
                                                        required
                                                        type="tel"
                                                        value={orderForm.phone}
                                                        onChange={(event) => setOrderForm((current) => ({ ...current, phone: event.target.value }))}
                                                    />
                                                </label>
                                                <label>
                                                    <span>{isEnglish ? "Preferred delivery time" : "الوقت المناسب للتسليم"}</span>
                                                    <select
                                                        required
                                                        value={orderForm.deliveryWindow}
                                                        onChange={(event) => setOrderForm((current) => ({ ...current, deliveryWindow: event.target.value }))}
                                                    >
                                                        <option value="">{isEnglish ? "Choose a time frame" : "اختر الوقت المناسب"}</option>
                                                        <option value="within_1_week">{isEnglish ? "Within one week" : "خلال أسبوع"}</option>
                                                        <option value="within_2_weeks">{isEnglish ? "Within two weeks" : "خلال أسبوعيك"}</option>
                                                        <option value="within_1_month">{isEnglish ? "Within one month" : "خلال شهر"}</option>
                                                        <option value="flexible">{isEnglish ? "Flexible / to be agreed" : "مرن / ؊تم الاتفاق عليه"}</option>
                                                    </select>
                                                </label>
                                                <label className="project-request-field-full">
                                                    <span>{isEnglish ? "Detailed address" : "العنوان بالتفصيل"}</span>
                                                    <textarea
                                                        autoComplete="street-address"
                                                        maxLength={350}
                                                        minLength={8}
                                                        required
                                                        rows={3}
                                                        value={orderForm.address}
                                                        onChange={(event) => setOrderForm((current) => ({ ...current, address: event.target.value }))}
                                                    />
                                                </label>
                                                <label className="project-request-field-full">
                                                    <span>{isEnglish ? "Project notes (optional)" : "أي ملاحظات عن المشروع (اختياري)"}</span>
                                                    <textarea
                                                        maxLength={500}
                                                        rows={3}
                                                        value={orderForm.notes}
                                                        onChange={(event) => setOrderForm((current) => ({ ...current, notes: event.target.value }))}
                                                    />
                                                </label>
                                                <p className="project-request-price-note project-request-field-full">
                                                    {isEnglish
                                                        ? `Order amount: ${new Intl.NumberFormat("en-US").format(project.price)} ${project.currency_code}. Budget selection does not change the listed price.`
                                                        : `قيمة الطلب: ${new Intl.NumberFormat("ar-EG").format(project.price)} ${project.currency_code}. اختيار الميزانية لا يغيّر سعر المشروع المعروض.`}
                                                </p>
                                                <div className="project-request-actions project-request-field-full">
                                                    <button className="project-button project-button-primary" type="submit" disabled={isCreatingOrder}>
                                                        <ShoppingBag size={18} aria-hidden="true" />
                                                        {isCreatingOrder
                                                            ? (isEnglish ? "Submitting..." : "جارٍ إرسال الطلب...")
                                                            : (isEnglish ? "Submit project request" : "إرسال طلب المشروع")}
                                                    </button>
                                                    <button
                                                        className="project-button project-button-secondary"
                                                        type="button"
                                                        onClick={() => setShowOrderForm(false)}
                                                        disabled={isCreatingOrder}
                                                    >
                                                        {isEnglish ? "Cancel" : "إلغاء"}
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <button
                                                className="project-button project-button-primary"
                                                type="button"
                                                onClick={beginOrder}
                                            >
                                                <ShoppingBag size={18} aria-hidden="true" />
                                                {isEnglish ? "Continue to request form" : "استكمال بيانات الطلب"}
                                            </button>
                                        )}
                                        <button
                                            className="project-button project-button-primary project-request-button"
                                            type="button"
                                            onClick={() => history.push(`/project-request?projectId=${project.id}`)}
                                        >
                                            <ArrowRight size={18} aria-hidden="true" />
                                            {isEnglish ? "Request This Project" : "اطلب هذا المشروع"}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="project-order-box">
                                    <h2>{isEnglish ? "Request a price quote" : "اطلب عرض سعر"}</h2>
                                    <p>
                                        {isEnglish
                                            ? "This project is priced per order. Submit a quotation request with your budget, delivery address, and deadline, and the administrator will contact you with a final quote."
                                            : "سعر هذا المشروع يتم تحديده لكل طلب على حدة. أرسل طلب عرض سعر مع الميزانية وعنوان التسليم وموعد التسليم المطلوب، وسيتواصل معك الأدمن بالسعر النهائي."}
                                    </p>
                                    <button
                                        className="project-button project-button-primary"
                                        type="button"
                                        onClick={() => history.push(`/project-request?projectId=${project.id}`)}
                                    >
                                        <ShoppingBag size={18} aria-hidden="true" />
                                        {isEnglish ? "Submit a price request" : "أرسل طلب عرض سعر"}
                                    </button>
                                    <a
                                        className="project-button project-button-whatsapp"
                                        href={servicesWhatsAppLink(isEnglish
                                            ? `Hello Techshpere, I want a price quote for the project: ${title} (${project.project_code}).`
                                            : `مرحبًا Techshpere، عايز عرض سعر للمشروع: ${title} (${project.project_code}).`)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <MessageCircle size={18} />
                                        {isEnglish ? "Ask on WhatsApp" : "اسأل على واتساب"}
                                    </a>
                                </div>
                            )}
                            <a
                                className="project-back-link"
                                href={servicesWhatsAppLink(isEnglish
                                    ? `Hello Techshpere, I have a question about ${title} (${project.project_code}).`
                                    : `مرحبًا Techshpere، لدي استفسار عك ${title} (${project.project_code}).`)}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {isEnglish ? "Ask about this project" : "استفسر عن هذا المشروع"}
                                <ArrowUpRight size={16} />
                            </a>
                        </>
                    )}
                </article>
            </main>
        </>
    );
}