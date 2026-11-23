import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSupabaseClient, isSupabaseConfigured } from "../login/supabase";
import { useLanguage } from "../i18n/language";
import Footer from "../Footer/Footer";
import AdminProjectManagement from "./AdminProjectManagement";
import AdminCourseManagement from "./AdminCourseManagement";
import "./AdminDashboard.css";

const requestStatuses = ["new", "reviewing", "contacted", "accepted", "rejected", "completed"];

function AdminDashboard() {
    const { language } = useLanguage();
    const isEnglish = language === "en";
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(isSupabaseConfigured());
    const [requests, setRequests] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [usersSearch, setUsersSearch] = useState("");
    const [projectRequests, setProjectRequests] = useState([]);
    const [viewingProjectRequest, setViewingProjectRequest] = useState(null);
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
            setRegisteredUsers(data?.registeredUsers || []);
            setProjectRequests(data?.projectRequests || []);
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

    const updateProjectRequest = async (id, status) => {
        setIsUpdating(id);
        setErrorMessage("");
        setSuccessMessage("");
        const { data, error } = await getSupabaseClient().functions.invoke(
            "admin-requests",
            { body: { action: "update_project_request", id, status } },
        );
        if (error) {
            setErrorMessage(isEnglish ? "Could not update this project request." : "تعذر تحديث حالة طلب المشروع.");
        } else {
            setProjectRequests((current) => current.map((req) => (
                req.id === id ? { ...req, status: data.request.status } : req
            )));
            setSuccessMessage(isEnglish ? "Project request status updated." : "تم تحديث حالة طلب المشروع.");
        }
        setIsUpdating("");
    };

    const grantProjectAccess = async (id) => {
        setIsUpdating(id);
        setErrorMessage("");
        setSuccessMessage("");
        const { data, error } = await getSupabaseClient().functions.invoke(
            "admin-requests",
            { body: { action: "grant_project_access", id } },
        );
        if (error) {
            setErrorMessage(isEnglish ? "Could not grant project access." : "تعذر منح الوصول للمشروع.");
        } else {
            setProjectRequests((current) => current.map((req) => (
                req.id === id ? { ...req, access_granted: true, access_granted_at: new Date().toISOString() } : req
            )));
            setSuccessMessage(isEnglish ? "Project access granted." : "تم منح الوصول للمشروع.");
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
        pending_review: isEnglish ? "Pending review" : "بانتظار المراجعة",
        negotiating: isEnglish ? "Negotiating" : "قيد التفاوض",
        in_progress: isEnglish ? "In progress" : "قيد التنفيذ",
    };
    const formatDate = (date) => new Intl.DateTimeFormat(
        isEnglish ? "en-US" : "ar-EG",
        { dateStyle: "medium", timeStyle: "short" },
    ).format(new Date(date));

    const tabLabels = {
        requests: isEnglish ? "Requests" : "الطلبات",
        reviews: isEnglish ? "Reviews" : "التقييمات",
        users: isEnglish ? "Users" : "المستخدمون",
        projects: isEnglish ? "Projects & Marketplace" : "المشاريع والسوق",
        courses: isEnglish ? "Courses" : "الدورات",
        projectRequests: isEnglish ? "Project Requests" : "طلبات المشاريع",
    };

    return (
        <>
            <main className="admin-page" dir={isEnglish ? "ltr" : "rtl"}>
                <div className="admin-content">
                    <header className="admin-heading">
                        <span>TECHSPHERE · ADMIN</span>
                        <h1>{activeTab === "projects" ? (isEnglish ? "Services & project management" : "إدارة الخدمات والمشاريع") : activeTab === "courses" ? (isEnglish ? "Course management" : "إدارة الدورات") : activeTab === "projectRequests" ? (isEnglish ? "Project requests management" : "إدارة طلبات المشاريع") : (isEnglish ? "Request management" : "إدارة الطلبات")}</h1>
                        <p>{activeTab === "projects"
                            ? (isEnglish
                                ? "Manage project categories, documentation, orders, access grants, and activation codes."
                                : "إدارة فئات المشاريع والتوثيق والطلبات وصلاحيات الوصول ورموز التفعيل.")
                            : activeTab === "courses"
                            ? (isEnglish
                                ? "Create and manage courses, chapters, topics, and learning content."
                                : "إنشاء وإدارة الدورات والفصول والمحتوى التعليمي.")
                            : activeTab === "projectRequests"
                            ? (isEnglish
                                ? "Review and manage project requests from buyers, update statuses, and grant access."
                                : "مراجعة وإدارة طلبات المشاريع من المشترين، وتحديث الحالات، ومنح الوصول.")
                            : (isEnglish
                                ? "Review course and career-path submissions and moderate student reviews."
                                : "راجع طلبات الكورسات والمسارات المهنية واعتمد تقييمات الطلاب.")}</p>
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
                                            {isEnglish ? `Users (${registeredUsers.length})` : `المستخدمون (${registeredUsers.length})`}
                                        </button>
                                        <button type="button" className={activeTab === "projects" ? "is-active" : ""}
                                            onClick={() => setActiveTab("projects")}>
                                            {tabLabels.projects}
                                        </button>
                                        <button type="button" className={activeTab === "courses" ? "is-active" : ""}
                                            onClick={() => setActiveTab("courses")}>
                                            {tabLabels.courses}
                                        </button>
                                        <button type="button" className={activeTab === "projectRequests" ? "is-active" : ""}
                                            onClick={() => setActiveTab("projectRequests")}>
                                            {isEnglish ? `Project Requests (${projectRequests.length})` : `طلبات المشاريع (${projectRequests.length})`}
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
                                    ) : activeTab === "users" ? (
                                        <section className="admin-list" aria-label={isEnglish ? "Registered users" : "المستخدمون المسجلون"}>
                                            <div className="admin-search-wrap">
                                                <input type="text"
                                                    className="admin-search-input"
                                                    placeholder={isEnglish ? "Search users by name or email..." : "البحث عن المستخدمين بالاسم أو البريد الإلكتروني..."}
                                                    value={usersSearch}
                                                    onChange={(e) => setUsersSearch(e.target.value)}
                                                    dir="ltr"
                                                />
                                            </div>
                                            {registeredUsers.length === 0 ? (
                                                <div className="admin-panel">{isEnglish ? "No registered users are available." : "لا توجد مستخدمين مسجلين للعرض."}</div>
                                            ) : (
                                                <table className="admin-users-table">
                                                    <thead>
                                                        <tr>
                                                            <th>{isEnglish ? "Name" : "الاسم"}</th>
                                                            <th>{isEnglish ? "Email" : "البريد الإلكتروني"}</th>
                                                            <th>{isEnglish ? "Student ID" : "رقم الطالب"}</th>
                                                            <th>{isEnglish ? "Joined" : "تاريخ الانضمام"}</th>
                                                            <th>{isEnglish ? "Status" : "الحالة"}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {registeredUsers
                                                            .filter((user) => {
                                                                const term = usersSearch.toLowerCase();
                                                                return (
                                                                    (user.full_name || "").toLowerCase().includes(term) ||
                                                                    (user.email || "").toLowerCase().includes(term)
                                                                );
                                                            })
                                                            .map((user) => (
                                                                <tr key={user.id}>
                                                                    <td>{user.full_name || user.email}</td>
                                                                    <td dir="ltr">{user.email}</td>
                                                                    <td dir="ltr">{user.student_id || "—"}</td>
                                                                    <td dir="ltr">{user.created_at ? formatDate(user.created_at) : "—"}</td>
                                                                    <td>
                                                                        <span className="admin-status-badge">
                                                                            {user.individual_training_activated_at
                                                                                ? (isEnglish ? "Active" : "مفعل")
                                                                                : (isEnglish ? "Pending" : "في انتظار التفعيل")}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        {registeredUsers.filter((user) => {
                                                            const term = usersSearch.toLowerCase();
                                                            return (
                                                                (user.full_name || "").toLowerCase().includes(term) ||
                                                                (user.email || "").toLowerCase().includes(term)
                                                            );
                                                        }).length === 0 && usersSearch && (
                                                            <tr>
                                                                <td colSpan={5} className="admin-empty-row">
                                                                    {isEnglish ? "No users found." : "لم يتم العثور على مستخدمين."}
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            )}
                                        </section>
                                    ) : activeTab === "projects" ? (
                                        <AdminProjectManagement />
                                    ) : activeTab === "courses" ? (
                                        <AdminCourseManagement />
                                    ) : activeTab === "projectRequests" ? (
                                        <section className="admin-list" aria-label={isEnglish ? "Project requests" : "طلبات المشاريع"}>
                                            {projectRequests.length === 0 && (
                                                <div className="admin-panel">{isEnglish ? "No project requests yet." : "لا توجد طلبات مشاريع حتى الآن."}</div>
                                            )}
                                            <table className="admin-project-requests-table">
                                                <thead>
                                                    <tr>
                                                        <th>{isEnglish ? "Order #" : "رقم الطلب"}</th>
                                                        <th>{isEnglish ? "Buyer" : "المشتري"}</th>
                                                        <th>{isEnglish ? "Email" : "البريد"}</th>
                                                        <th>{isEnglish ? "Project" : "المشروع"}</th>
                                                        <th>{isEnglish ? "Budget" : "الميزانية"}</th>
                                                        <th>{isEnglish ? "Date" : "التاريخ"}</th>
                                                        <th>{isEnglish ? "Status" : "الحالة"}</th>
                                                        <th>{isEnglish ? "Access" : "وصول"}</th>
                                                        <th>{isEnglish ? "Actions" : "الإجراءات"}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {projectRequests.map((req) => (
                                                        <tr key={req.id}>
                                                            <td dir="ltr">{req.order_number || `PROJ-${req.id.slice(-6)}`}</td>
                                                            <td>{req.buyer_name}</td>
                                                            <td dir="ltr">{req.buyer_email}</td>
                                                            <td>{req.service_projects?.title_ar || req.service_projects?.title_en || "—"}</td>
                                                            <td dir="ltr">{req.min_budget ? `${req.min_budget} – ${req.max_budget} ${req.budget_currency || "EGP"}` : "—"}</td>
                                                            <td dir="ltr">{req.created_at ? formatDate(req.created_at) : "—"}</td>
                                                            <td>
                                                                <span className="admin-status-badge">
                                                                    {statusLabels[req.status] || req.status}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                {req.access_granted ? (
                                                                    <span className="admin-badge-success">
                                                                        {isEnglish ? "Granted" : "ممنوح"}
                                                                    </span>
                                                                ) : (
                                                                    <span className="admin-badge-warning">
                                                                        {isEnglish ? "Pending" : "معلق"}
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <div className="admin-request-actions">
                                                                    {req.buyer_phone && (
                                                                        <a href={`https://wa.me/${req.buyer_phone.replace(/\s+/g, "")}`} target="_blank" rel="noopener noreferrer"
                                                                            className="admin-btn-whatsapp" title={isEnglish ? "WhatsApp" : "واتساب"}>
                                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
                                                                                <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6zm-2 0l-6 1.5V19l5 1.5 5-6V6h-4zM12 22c-5.5 0-10-4.5-10-10S6.5 2 12 2c1.7 0 3.3.4 4.8 1.2l-2.6 5.2c-.4.2-.8.4-1.3.4-1.1 0-2-.9-2-2 0-.2.1-.5.1-.8l1.7-3.4c.2-.4.7-.7 1.2-.8.6-.1 1.2-.1 1.8.1.7.2 1.4.6 2 1.2l-2.6 5.2c-.6 1.2-1.7 2-3 2.2z"/>
                                                                            </svg>
                                                                        </a>
                                                                    )}
                                                                    {!req.access_granted && (
                                                                        <button type="button" className="admin-btn-grant"
                                                                            disabled={isUpdating === req.id}
                                                                            onClick={() => grantProjectAccess(req.id)}
                                                                            title={isEnglish ? "Grant Access" : "منح وصول"}>
                                                                            {isEnglish ? "Grant Access" : "منح وصول"}
                                                                        </button>
                                                                    )}
                                                                    <button type="button" className="admin-btn-details"
                                                                        onClick={() => {
                                                                            setViewingProjectRequest(req);
                                                                        }}
                                                                        title={isEnglish ? "View details" : "عرض التفاصيل"}>
                                                                        {isEnglish ? "Details" : "التفاصيل"}
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </section>
                                    ) : null}
                                    {viewingProjectRequest && (
                                        <section className="admin-modal-overlay" onClick={() => setViewingProjectRequest(null)}>
                                            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                                                <button type="button" className="admin-modal-close" onClick={() => setViewingProjectRequest(null)}>&times;</button>
                                                <h2>{isEnglish ? "Project Request Details" : "تفاصيل طلب المشروع"}</h2>
                                                <dl className="admin-modal-details">
                                                    <div className="admin-modal-row">
                                                        <dt>{isEnglish ? "Order Number" : "رقم الطلب"}</dt>
                                                        <dd dir="ltr">{viewingProjectRequest.order_number || `PROJ-${viewingProjectRequest.id.slice(-6)}`}</dd>
                                                    </div>
                                                    <div className="admin-modal-row">
                                                        <dt>{isEnglish ? "Buyer Name" : "اسم المشتري"}</dt>
                                                        <dd>{viewingProjectRequest.buyer_name}</dd>
                                                    </div>
                                                    <div className="admin-modal-row">
                                                        <dt>{isEnglish ? "Email" : "البريد الإلكتروني"}</dt>
                                                        <dd dir="ltr">{viewingProjectRequest.buyer_email}</dd>
                                                    </div>
                                                    <div className="admin-modal-row">
                                                        <dt>{isEnglish ? "Phone" : "الهاتف"}</dt>
                                                        <dd dir="ltr">{viewingProjectRequest.buyer_phone || "—"}</dd>
                                                    </div>
                                                    <div className="admin-modal-row">
                                                        <dt>{isEnglish ? "Project" : "المشروع"}</dt>
                                                        <dd>{viewingProjectRequest.service_projects?.title_ar || viewingProjectRequest.service_projects?.title_en || "—"}</dd>
                                                    </div>
                                                    <div className="admin-modal-row">
                                                        <dt>{isEnglish ? "Category" : "الفئة"}</dt>
                                                        <dd>{viewingProjectRequest.service_project_categories?.title_ar || viewingProjectRequest.service_project_categories?.title_en || "—"}</dd>
                                                    </div>
                                                    <div className="admin-modal-row">
                                                        <dt>{isEnglish ? "Budget" : "الميزانية"}</dt>
                                                        <dd dir="ltr">{viewingProjectRequest.min_budget ? `${viewingProjectRequest.min_budget} – ${viewingProjectRequest.max_budget} ${viewingProjectRequest.budget_currency || "EGP"}` : "—"}</dd>
                                                    </div>
                                                    <div className="admin-modal-row">
                                                        <dt>{isEnglish ? "Delivery Deadline" : "موعد التسليم"}</dt>
                                                        <dd dir="ltr">{viewingProjectRequest.delivery_deadline || "—"}</dd>
                                                    </div>
                                                    <div className="admin-modal-row">
                                                        <dt>{isEnglish ? "Address" : "العنوان"}</dt>
                                                        <dd>{viewingProjectRequest.delivery_address || "—"}</dd>
                                                    </div>
                                                    <div className="admin-modal-row">
                                                        <dt>{isEnglish ? "Message" : "الرسالة"}</dt>
                                                        <dd>{viewingProjectRequest.additional_message || "—"}</dd>
                                                    </div>
                                                    <div className="admin-modal-row">
                                                        <dt>{isEnglish ? "Status" : "الحالة"}</dt>
                                                        <dd>
                                                            <span className="admin-status-badge">
                                                                {statusLabels[viewingProjectRequest.status] || viewingProjectRequest.status}
                                                            </span>
                                                        </dd>
                                                    </div>
                                                    <div className="admin-modal-row">
                                                        <dt>{isEnglish ? "Access Granted" : "تم منح الوصول"}</dt>
                                                        <dd>
                                                            {viewingProjectRequest.access_granted ? (
                                                                <span style={{ color: "#166534", fontWeight: 600 }}>
                                                                    {isEnglish ? "Yes" : "نعم"}
                                                                </span>
                                                            ) : (
                                                                <span style={{ color: "#b45309", fontWeight: 600 }}>
                                                                    {isEnglish ? "No" : "لا"}
                                                                </span>
                                                            )}
                                                            {viewingProjectRequest.access_granted_at && (
                                                                <>
                                                                    <br />
                                                                    <small dir="ltr">{formatDate(viewingProjectRequest.access_granted_at)}</small>
                                                                </>
                                                            )}
                                                        </dd>
                                                    </div>
                                                    <div className="admin-modal-row">
                                                        <dt>{isEnglish ? "Created" : "تاريخ الإنشاء"}</dt>
                                                        <dd dir="ltr">{viewingProjectRequest.created_at ? formatDate(viewingProjectRequest.created_at) : "—"}</dd>
                                                    </div>
                                                </dl>
                                                <div className="admin-modal-actions">
                                                    {viewingProjectRequest.buyer_phone && (
                                                        <a href={`https://wa.me/${viewingProjectRequest.buyer_phone.replace(/\s+/g, "")}`} target="_blank" rel="noopener noreferrer"
                                                            className="admin-btn-whatsapp admin-modal-btn">
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
                                                                <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6zm-2 0l-6 1.5V19l5 1.5 5-6V6h-4zM12 22c-5.5 0-10-4.5-10-10S6.5 2 12 2c1.7 0 3.3.4 4.8 1.2l-2.6 5.2c-.4.2-.8.4-1.3.4-1.1 0-2-.9-2-2 0-.2.1-.5.1-.8l1.7-3.4c.2-.4.7-.7 1.2-.8.6-.1 1.2-.1 1.8.1.7.2 1.4.6 2 1.2l-2.6 5.2c-.6 1.2-1.7 2-3 2.2z"/>
                                                            </svg>
                                                            {isEnglish ? "WhatsApp Contact" : "تواصل عبر واتساب"}
                                                        </a>
                                                    )}
                                                    <button type="button" className="admin-modal-btn" onClick={() => setViewingProjectRequest(null)}>
                                                        {isEnglish ? "Close" : "إغلاق"}
                                                    </button>
                                                </div>
                                            </div>
                                        </section>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </main>
        </>
    );
}

export default AdminDashboard;
