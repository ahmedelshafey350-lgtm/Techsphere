import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Boxes, KeyRound, RefreshCw, ShieldCheck } from "lucide-react";
import { getSupabaseClient, isSupabaseConfigured } from "../login/supabase";
import { useLanguage } from "../i18n/language";
import { callProjectService } from "./marketplaceApi";
import {
    ACTIVATION_CODE_MAX_LENGTH,
    ACTIVATION_CODE_PLACEHOLDER,
    formatActivationCodeInput,
    normalizeActivationCode,
} from "./activationCode";
import "./Projects.css";

function formatDate(value, isEnglish) {
    if (!value) return "—";
    return new Intl.DateTimeFormat(isEnglish ? "en-US" : "ar-EG", { dateStyle: "medium" })
        .format(new Date(value));
}

function projectStatus(order, access, isEnglish, now) {
    if (access?.status === "revoked") return isEnglish ? "Revoked" : "متوقفة";
    if (access?.status === "active" && new Date(access.activated_at).getTime() <= now
        && new Date(access.expires_at).getTime() > now) {
        return isEnglish ? "Active" : "فعّالة";
    }
    if (access?.status === "active" && new Date(access.activated_at).getTime() > now) {
        return isEnglish ? "Upcoming" : "تبدأ لاحقًا";
    }
    if (!access && order?.payment_status === "confirmed" && order.payment_method === "activation_code") {
        return isEnglish ? "Purchased — Not Activated" : "تم الشراء — لم يتم التفعيل";
    }
    if (access || order?.payment_status === "confirmed") {
        return isEnglish ? "Expired / activation needed" : "منتهية / تحتاج تفعيلًا";
    }
    if (order?.payment_status === "pending") return isEnglish ? "Payment pending" : "بانتظار الدفع";
    if (order?.payment_status === "rejected") return isEnglish ? "Payment rejected" : "تم رفض الدفع";
    return isEnglish ? "Purchased" : "تم الشراء";
}

export default function MyProjects() {
    const history = useHistory();
    const { language } = useLanguage();
    const isEnglish = language === "en";
    const [data, setData] = useState({ orders: [], access: [], projects: [] });
    const [isLoading, setIsLoading] = useState(isSupabaseConfigured());
    const [now, setNow] = useState(() => Date.now());
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [activationCode, setActivationCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [copiedError, setCopiedError] = useState(false);

    const loadProjects = useCallback(async () => {
        if (!isSupabaseConfigured()) {
            setErrorMessage(isEnglish ? "Supabase is not configured." : "إعداد Supabase غير مكتمل.");
            setIsLoading(false);
            return;
        }
        const { data: { session }, error } = await getSupabaseClient().auth.getSession();
        if (error) {
            setErrorMessage(error.message);
            setIsLoading(false);
            return;
        }
        if (!session?.user) {
            history.replace("/login", { from: "/my-projects" });
            return;
        }
        try {
            const result = await callProjectService("my_projects");
            setData({
                orders: result.orders || [],
                access: result.access || [],
                projects: result.projects || [],
            });
            setErrorMessage("");
        } catch (requestError) {
            setErrorMessage(requestError.message);
        } finally {
            setIsLoading(false);
        }
    }, [history, isEnglish]);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    useEffect(() => {
        const timer = window.setInterval(() => setNow(Date.now()), 60_000);
        return () => window.clearInterval(timer);
    }, []);

    const projectRows = useMemo(() => {
        const projectsById = new Map(data.projects.map((project) => [project.id, project]));
        const ordersByProject = new Map();
        for (const order of data.orders) {
            const rows = ordersByProject.get(order.project_id) || [];
            rows.push(order);
            ordersByProject.set(order.project_id, rows);
        }
        const accessByProject = new Map();
        for (const access of data.access) {
            const rows = accessByProject.get(access.project_id) || [];
            rows.push(access);
            accessByProject.set(access.project_id, rows);
        }
        const projectIds = new Set([...ordersByProject.keys(), ...accessByProject.keys()]);
        return [...projectIds].map((projectId) => {
            const orders = ordersByProject.get(projectId) || [];
            const accessRows = accessByProject.get(projectId) || [];
            const currentAccess = accessRows.find((row) => row.status === "active"
                && new Date(row.activated_at).getTime() <= now
                && new Date(row.expires_at).getTime() > now);
            const latestAccess = currentAccess || accessRows.sort((left, right) => (
                new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
            ))[0] || null;
            const latestOrder = orders[0] || null;
            return { project: projectsById.get(projectId), orders, access: latestAccess, order: latestOrder };
        }).filter((row) => row.project);
    }, [data, now]);

    const redeemCode = async (event) => {
        event.preventDefault();
        setSuccessMessage("");
        const code = normalizeActivationCode(activationCode);
        if (!code) {
            setErrorMessage(isEnglish
                ? "The code is incomplete. It starts with TXH and has three groups of four characters."
                : "الرمز غير مكتمل. يبدأ بـ TXH ويتكون من ثلاث مجموعات من أربعة حروف أو أرقام.");
            return;
        }
        setErrorMessage("");
        setIsRedeeming(true);
        try {
            await callProjectService("redeem_activation_code", { code });
            setActivationCode("");
            setSuccessMessage(isEnglish ? "Project access activated successfully." : "تم تفعيل صلاحية المشروع بنجاح.");
            await loadProjects();
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsRedeeming(false);
        }
    };

    const copyErrorMessage = async () => {
        try {
            await navigator.clipboard.writeText(errorMessage);
            setCopiedError(true);
            window.setTimeout(() => setCopiedError(false), 2500);
        } catch {
            // Clipboard access can be denied; the alert text stays selectable on the page.
        }
    };

    const isCurrentlyActive = (access) => access?.status === "active"
        && new Date(access.activated_at).getTime() <= now
        && new Date(access.expires_at).getTime() > now;

    return (
        <>
            <main className="my-projects-page" dir={isEnglish ? "ltr" : "rtl"}>
                <section className="my-projects-shell">
                    <header className="my-projects-heading">
                        <span className="project-eyebrow">{isEnglish ? "CUSTOMER AREA" : "مساحة العميل"}</span>
                        <h1>{isEnglish ? "My projects" : "مشاريعي"}</h1>
                        <p>{isEnglish
                            ? "Review orders and access periods for projects linked to your account."
                            : "تابع طلباتك وفترات الوصول للمشاريع المرتبطة بحسابف."}</p>
                    </header>

                    {errorMessage && (
                        <div className="project-alert" role="alert">
                            <span>{errorMessage}</span>
                            <button type="button" className="project-alert-copy" onClick={copyErrorMessage}>
                                {copiedError
                                    ? (isEnglish ? "Copied" : "تم النسخ")
                                    : (isEnglish ? "Copy message" : "نسخ الرسالة")}
                            </button>
                        </div>
                    )}
                    {successMessage && <div className="project-success" role="status">{successMessage}</div>}

                    <section className="project-redeem-form">
                        <h2>{isEnglish ? "Activate a project code" : "فعّل رمز مشروع"}</h2>
                        <p>{isEnglish
                            ? "If an administrator gave you a paid activation code, enter it here. Codes work once and only for their assigned project."
                            : "إذا سلّمك الأدمن رمز تفعيل مدفوعًا، أدخله هنا. يعمل الرمز مرة واحدة ولمشروعه المحدد فقط."}</p>
                        <form onSubmit={redeemCode}>
                            <label>
                                {isEnglish ? "Activation code" : "رمز التفعيل"}
                                <input
                                    className="project-code-input"
                                    value={activationCode}
                                    onChange={(event) => setActivationCode(formatActivationCodeInput(event.target.value))}
                                    placeholder={ACTIVATION_CODE_PLACEHOLDER}
                                    autoComplete="off"
                                    autoCapitalize="characters"
                                    spellCheck={false}
                                    inputMode="text"
                                    maxLength={ACTIVATION_CODE_MAX_LENGTH}
                                    dir="ltr"
                                    required
                                />
                                <span className="project-redeem-hint">
                                    {isEnglish
                                        ? "Single use, and only for the account that placed the order. Paste it as-is."
                                        : "يعمل مرة واحدة، ولحساب صاحب الطلب نفسه فقط. الصقه كما هو دون مسافات."}
                                </span>
                            </label>
                            <button className="project-button project-button-primary" type="submit" disabled={isRedeeming}>
                                <KeyRound size={17} aria-hidden="true" />
                                {isRedeeming
                                    ? (isEnglish ? "Activating..." : "جارٍ التفعيل...")
                                    : (isEnglish ? "Activate" : "تفعيل")}
                            </button>
                        </form>
                    </section>

                    {isLoading ? (
                        <div className="services-state" role="status">{isEnglish ? "Loading your projects..." : "جارٍ تحميل مشاريعف..."}</div>
                    ) : projectRows.length ? (
                        <div className="my-projects-grid">
                            {projectRows.map(({ project, orders, access, order }) => {
                                const active = isCurrentlyActive(access);
                                const title = isEnglish ? project.title_en : project.title_ar;
                                const status = projectStatus(order, access, isEnglish, now);
                                const isExpired = Boolean(access && !active && access.status !== "revoked");
                                return (
                                    <article className="my-project-card" key={project.id}>
                                        <div className="my-project-image">
                                            {project.image_url
                                                ? <img src={project.image_url} alt={project.image_alt_text || (isEnglish ? project.title_en : project.title_ar)} loading="lazy" />
                                                : <span className="service-project-placeholder"><Boxes size={32} /></span>}
                                        </div>
                                        <div className="my-project-body">
                                            <span className="my-project-code">{project.project_code}</span>
                                            <h2>{title}</h2>
                                            <span className={`my-project-status${active ? " is-active" : isExpired ? " is-expired" : ""}`}>
                                                {status}
                                            </span>
                                            <dl className="my-project-details">
                                                <div>
                                                    <dt>{isEnglish ? "Latest order" : "أحدث طلب"}</dt>
                                                    <dd>{formatDate(order?.created_at, isEnglish)}</dd>
                                                </div>
                                                {order?.order_reference && (
                                                    <div>
                                                        <dt>{isEnglish ? "Order reference" : "رقم الطلب"}</dt>
                                                        <dd dir="ltr">{order.order_reference}</dd>
                                                    </div>
                                                )}
                                                {access && (
                                                    <>
                                                        <div>
                                                            <dt>{isEnglish ? "Activated" : "تاريخ التفعيل"}</dt>
                                                            <dd>{formatDate(access.activated_at, isEnglish)}</dd>
                                                        </div>
                                                        <div>
                                                            <dt>{isEnglish ? "Expires" : "تاريخ الانتهاء"}</dt>
                                                            <dd>{formatDate(access.expires_at, isEnglish)}</dd>
                                                        </div>
                                                    </>
                                                )}
                                                {orders.length > 1 && (
                                                    <div>
                                                        <dt>{isEnglish ? "Order history" : "سجل الطلبات"}</dt>
                                                        <dd>{orders.length}</dd>
                                                    </div>
                                                )}
                                            </dl>
                                            <div className="my-project-actions">
                                                {active && (
                                                    <Link className="project-button project-button-primary" to={`/projects/${project.project_code}`}>
                                                        <ShieldCheck size={16} aria-hidden="true" />
                                                        {isEnglish ? "Open project" : "افتح المشروع"}
                                                    </Link>
                                                )}
                                                {!active && project.status === "published" && order?.payment_status !== "pending" && (
                                                    <Link className="project-button project-button-secondary" to={`/services/${project.slug}?renew=1`}>
                                                        <RefreshCw size={16} aria-hidden="true" />
                                                        {isEnglish ? (isExpired ? "Renew access" : "Request project") : (isExpired ? "جدد الصلاحية" : "اطلب المشروع")}
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="services-state">
                            <Boxes size={32} aria-hidden="true" />
                            <p>{isEnglish ? "No project orders or access are linked to your account yet." : "لا توجد طلبات أو صلاحيات مشاريع مرتبطة بحسابك حتى الآك."}</p>
                            <Link className="project-button project-button-primary" to="/services">
                                {isEnglish ? "Browse projects" : "استكشف المشاريع"}
                            </Link>
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}
