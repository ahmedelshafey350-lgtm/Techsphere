import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSupabaseClient, isSupabaseConfigured } from "../login/supabase";
import { useLanguage } from "../i18n/language";
import Footer from "../Footer/Footer";
import "./AdminDashboard.css";

const requestStatuses = ["new", "reviewing", "contacted", "accepted", "rejected", "completed"];

function AdminDashboard() {
    const { language } = useLanguage();
    const isEnglish = language === "en";
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(isSupabaseConfigured());
    const [requests, setRequests] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [registeredNames, setRegisteredNames] = useState([]);
    const [activeTab, setActiveTab] = useState("requests");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isUpdating, setIsUpdating] = useState("");

    const loadData = useCallback(async () => {
        if (!isSupabaseConfigured()) {
            return;
        }
        const { data: sessionData, error: sessionError } = await getSupabaseClient().auth.getSession();
        setErrorMessage("");
        if (sessionError) {
            setErrorMessage(isEnglish ? "Could not verify your account session." : "تعذر التحقق من جلسة الحساب.");
            setIsLoading(false);
            return;
        }
        setUser(sessionData.session?.user ?? null);
        if (!sessionData.session?.user) {
            setIsLoading(false);
            return;
        }

        const { data, error } = await getSupabaseClient().functions.invoke(
            "admin-requests",
            { body: { action: "list" } },
        );
        if (error) {
            let message = isEnglish ? "You may not have access to the admin dashboard." : "قد لا يملك هذا الحساب صلاحية لوحة الإدارة.";
            if (error.context instanceof Response) {
                const response = await error.context.clone().json().catch(() => null);
                if (!isEnglish && response?.error) message = response.error;
            }
            setErrorMessage(message);
        } else {
            setRequests(data?.requests || []);
            setReviews(data?.reviews || []);
            setRegisteredNames(data?.registeredNames || []);
        }
        setIsLoading(false);
    }, [isEnglish]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const updateRequest = async (id, status) => {
        setIsUpdating(id);
        setErrorMessage("");
        setSuccessMessage("");
        const { data, error } = await getSupabaseClient().functions.invoke(
            "admin-requests",
            { body: { action: "update_request", id, status } },
        );
        if (error) {
            setErrorMessage(isEnglish ? "Could not update this request." : "تعذر تحديث حالة الطلب.");
        } else {
            setRequests((current) => current.map((request) => (
                request.id === id ? { ...request, status: data.request.status } : request
            )));
            setSuccessMessage(isEnglish ? "Request status updated." : "تم تحديث حالة الطلب.");
        }
        setIsUpdating("");
    };

    const moderateReview = async (id, status) => {
        setIsUpdating(id);
        setErrorMessage("");
        setSuccessMessage("");
        const { data, error } = await getSupabaseClient().functions.invoke(
            "admin-requests",
            { body: { action: "moderate_review", id, status } },
        );
        if (error) {
            setErrorMessage(isEnglish ? "Could not update this review." : "تعذر تحديث حالة التقييم.");
        } else {
            setReviews((current) => current.map((review) => (
                review.id === id ? { ...review, moderation_status: data.review.moderation_status } : review
            )));
            setSuccessMessage(isEnglish ? "Review moderation updated." : "تم تحديث حالة التقييم.");
        }
        setIsUpdating("");
    };

    const statusLabels = {
        new: isEnglish ? "New" : "جديد",
        reviewing: isEnglish ? "Under review" : "قيد المراجعة",
        contacted: isEnglish ? "Contacted" : "تم التواصل",
        accepted: isEnglish ? "Accepted" : "مقبول",
        rejected: isEnglish ? "Rejected" : "مرفوض",
        completed: isEnglish ? "Completed" : "مكتمل",
        pending: isEnglish ? "Pending review" : "بانتظار المراجعة",
        approved: isEnglish ? "Approved" : "تم الاعتماد",
    };
    const formatDate = (date) => new Intl.DateTimeFormat(
        isEnglish ? "en-US" : "ar-EG",
        { dateStyle: "medium", timeStyle: "short" },
    ).format(new Date(date));

    return (
        <>
            <main className="admin-page" dir={isEnglish ? "ltr" : "rtl"}>
                <div className="admin-content">
                    <header className="admin-heading">
                        <span>TECHSPHERE · ADMIN</span>
                        <h1>{isEnglish ? "Request management" : "إدارة الطلبات"}</h1>
                        <p>{isEnglish
                            ? "Review course and career-path submissions and moderate student reviews."
                            : "راجع طلبات الكورسات والمسارات المهنية واعتمد تقييمات الطلاب."}</p>
                    </header>
                    {isLoading ? (
                        <div className="admin-panel" role="status">{isEnglish ? "Loading..." : "جارٍ التحميل..."}</div>
                    ) : !isSupabaseConfigured() ? (
                        <div className="admin-panel" role="alert">{isEnglish
                            ? "Supabase is not configured."
                            : "إعداد Supabase غير مكتمل."}</div>
                    ) : !user ? (
                        <div className="admin-panel">
                            <p>{isEnglish ? "Sign in with the authorized admin account." : "سجّل الدخول بحساب الإدارة المصرح له."}</p>
                            <Link className="admin-button" to={{
                                pathname: "/login",
                                state: { from: "/admin" },
                            }}>
                                {isEnglish ? "Sign in" : "تسجيل الدخول"}
                            </Link>
                        </div>
                    ) : (
                        <>
                            {errorMessage && <p className="admin-alert" role="alert">{errorMessage}</p>}
                            {successMessage && <p className="admin-success" role="status">{successMessage}</p>}
                            {!errorMessage && (
                                <>
                                    <div className="admin-tabs" role="tablist">
                                        <button type="button" className={activeTab === "requests" ? "is-active" : ""}
                                            onClick={() => setActiveTab("requests")}>
                                            {isEnglish ? `Requests (${requests.length})` : `الطلبات (${requests.length})`}
                                        </button>
                                        <button type="button" className={activeTab === "reviews" ? "is-active" : ""}
                                            onClick={() => setActiveTab("reviews")}>
                                            {isEnglish ? `Reviews (${reviews.length})` : `التقييمات (${reviews.length})`}
                                        </button>
                                        <button type="button" className={activeTab === "users" ? "is-active" : ""}
                                            onClick={() => setActiveTab("users")}>
                                            {isEnglish
                                                ? `Registered names (${registeredNames.length})`
                                                : `أسماء المسجلين (${registeredNames.length})`}
                                        </button>
                                    </div>
                                    {activeTab === "requests" ? (
                                        <section className="admin-list">
                                            {requests.length === 0 && (
                                                <div className="admin-panel">{isEnglish ? "No requests yet." : "لا توجد طلبات حتى الآن."}</div>
                                            )}
                                            {requests.map((request) => (
                                                <article className="admin-panel admin-request" key={request.id}>
                                                    <div className="admin-request-heading">
                                                        <div>
                                                            <span className="admin-request-type">
                                                                {request.request_type === "course_enrollment"
                                                                    ? (isEnglish ? "Course enrollment" : "طلب اشتراك كورس")
                                                                    : (isEnglish ? "Career-path application" : "تقديم لمسار مهني")}
                                                            </span>
                                                            <h2>{request.course_name || request.job_title}</h2>
                                                        </div>
                                                        <time dateTime={request.created_at}>{formatDate(request.created_at)}</time>
                                                    </div>
                                                    <dl className="admin-request-details">
                                                        <div><dt>{isEnglish ? "Name" : "الاسم"}</dt><dd>{request.name}</dd></div>
                                                        <div><dt>{isEnglish ? "Email" : "البريد"}</dt><dd dir="ltr">{request.email}</dd></div>
                                                        <div><dt>{isEnglish ? "Phone" : "الهاتف"}</dt><dd dir="ltr">{request.phone}</dd></div>
                                                        {request.portfolio && <div><dt>{isEnglish ? "Portfolio" : "الأعمال"}</dt><dd><a href={request.portfolio} target="_blank" rel="noreferrer">{request.portfolio}</a></dd></div>}
                                                        {request.message && <div className="admin-request-message"><dt>{isEnglish ? "Details" : "التفاصيل"}</dt><dd>{request.message}</dd></div>}
                                                    </dl>
                                                    <label className="admin-status-field">
                                                        <span>{isEnglish ? "Request status" : "حالة الطلب"}</span>
                                                        <select value={request.status} disabled={isUpdating === request.id}
                                                            onChange={(event) => updateRequest(request.id, event.target.value)}>
                                                            {requestStatuses.map((status) => (
                                                                <option key={status} value={status}>{statusLabels[status]}</option>
                                                            ))}
                                                        </select>
                                                    </label>
                                                </article>
                                            ))}
                                        </section>
                                    ) : activeTab === "reviews" ? (
                                        <section className="admin-list">
                                            {reviews.length === 0 && (
                                                <div className="admin-panel">{isEnglish ? "No reviews have been submitted." : "لم تُرسل تقييمات بعد."}</div>
                                            )}
                                            {reviews.map((review) => (
                                                <article className="admin-panel admin-review" key={review.id}>
                                                    <div className="admin-request-heading">
                                                        <div>
                                                            <span className="admin-request-type">
                                                                {isEnglish ? `Course ${review.course_id + 1}` : `الكورس ${review.course_id + 1}`}
                                                            </span>
                                                            <h2>{review.reviewer_name} · {"★".repeat(review.rating)}</h2>
                                                        </div>
                                                        <span className="admin-status-badge">
                                                            {statusLabels[review.moderation_status] || review.moderation_status}
                                                        </span>
                                                    </div>
                                                    <p>{review.comment}</p>
                                                    <small>{isEnglish ? "Activated student account" : "حساب طالب مفعّل"} · {formatDate(review.created_at)}</small>
                                                    {review.moderation_status === "pending" && (
                                                        <div className="admin-review-actions">
                                                            <button type="button" className="admin-button"
                                                                disabled={isUpdating === review.id}
                                                                onClick={() => moderateReview(review.id, "approved")}>
                                                                {isEnglish ? "Approve" : "اعتماد"}
                                                            </button>
                                                            <button type="button" className="admin-button is-danger"
                                                                disabled={isUpdating === review.id}
                                                                onClick={() => moderateReview(review.id, "rejected")}>
                                                                {isEnglish ? "Reject" : "رفض"}
                                                            </button>
                                                        </div>
                                                    )}
                                                </article>
                                            ))}
                                        </section>
                                    ) : (
                                        <section className="admin-list" aria-label={isEnglish ? "Registered user names" : "أسماء المستخدمين المسجلين"}>
                                            {registeredNames.length === 0 ? (
                                                <div className="admin-panel">
                                                    {isEnglish ? "No registered names are available." : "لا توجد أسماء مسجلة للعرض."}
                                                </div>
                                            ) : (
                                                <ul className="admin-panel admin-name-list">
                                                    {registeredNames.map((name, index) => (
                                                        <li key={`${name}-${index}`}>{name}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </section>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}

export default AdminDashboard;
