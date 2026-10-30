import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSupabaseClient, isSupabaseConfigured } from "../login/supabase";
import { useLanguage } from "../i18n/language";
import "./VerifiedReviews.css";

const courses = [
    { id: 0, en: "Front-End Development", ar: "تطوير الواجهات الأمامية" },
    { id: 1, en: "Back-End Development", ar: "تطوير الواجهات الخلفية" },
    { id: 2, en: "Full-Stack Development", ar: "تطوير الواجهات المتكاملة" },
    { id: 3, en: "n8n Automation", ar: "أتمتة n8n" },
    { id: 4, en: "Analog Electronics", ar: "الإلكترونيات التناظرية" },
    { id: 5, en: "Digital Electronics", ar: "الإلكترونيات الرقمية" },
    { id: 6, en: "PCB Design", ar: "تصميم لوحات الدوائر المطبوعة" },
    { id: 7, en: "Robotics", ar: "الروبوتات" },
];

export default function VerifiedReviews() {
    const { language } = useLanguage();
    const isEnglish = language === "en";
    const [user, setUser] = useState(null);
    const [isActivated, setIsActivated] = useState(false);
    const [publicReviews, setPublicReviews] = useState([]);
    const [ownReviews, setOwnReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(isSupabaseConfigured());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [courseId, setCourseId] = useState("");
    const [rating, setRating] = useState("5");
    const [comment, setComment] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (!isSupabaseConfigured()) {
            return undefined;
        }

        const supabase = getSupabaseClient();
        let isActive = true;
        const loadReviews = async () => {
            const { data: reviews, error: reviewsError } = await supabase
                .from("course_reviews")
                .select("id, course_id, reviewer_name, rating, comment, is_verified, created_at")
                .eq("moderation_status", "approved")
                .order("created_at", { ascending: false })
                .limit(30);
            if (!isActive) return;
            if (reviewsError) {
                setErrorMessage(isEnglish ? "Could not load verified reviews." : "تعذر تحميل التقييمات الموثقة.");
            } else {
                setPublicReviews(reviews || []);
            }

            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (!isActive) return;
            if (sessionError) {
                setErrorMessage(isEnglish ? "Could not verify your account session." : "تعذر التحقق من جلسة الحساب.");
                setIsLoading(false);
                return;
            }
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser?.email_confirmed_at) {
                const [{ data: profile, error: profileError }, { data: userReviews, error: userReviewsError }] = await Promise.all([
                    supabase.from("profiles")
                        .select("individual_training_activated_at")
                        .eq("id", currentUser.id)
                        .maybeSingle(),
                    supabase.from("course_reviews")
                        .select("id, course_id, moderation_status")
                        .eq("user_id", currentUser.id),
                ]);
                if (!isActive) return;
                if (profileError || userReviewsError) {
                    setErrorMessage(isEnglish
                        ? "Could not load your review eligibility."
                        : "تعذر تحميل أهلية التقييم لحسابك.");
                } else {
                    setIsActivated(Boolean(profile?.individual_training_activated_at));
                    setOwnReviews(userReviews || []);
                }
            } else {
                setIsActivated(false);
                setOwnReviews([]);
            }
            setIsLoading(false);
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            if (isActive) loadReviews();
        });
        loadReviews();
        return () => {
            isActive = false;
            subscription.unsubscribe();
        };
    }, [isEnglish]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setIsSubmitting(true);
        try {
            const { data, error } = await getSupabaseClient().functions.invoke(
                "submit-review",
                { body: { courseId: Number(courseId), rating: Number(rating), comment, consent: true } },
            );
            if (error) {
                let serverMessage = "";
                if (error.context instanceof Response) {
                    const body = await error.context.clone().json().catch(() => null);
                    serverMessage = body?.error || "";
                }
                throw new Error(serverMessage || error.message);
            }
            if (!data?.success) {
                throw new Error(data?.error || (isEnglish
                    ? "Could not submit your review."
                    : "تعذر إرسال تقييمك."));
            }

            setSuccessMessage(isEnglish
                ? "Your review was submitted and is waiting for admin approval."
                : "تم إرسال تقييمك، وهو بانتظار اعتماد الإدارة.");
            setOwnReviews((current) => [...current, {
                id: data.review.id,
                course_id: Number(courseId),
                moderation_status: "pending",
            }]);
            setComment("");
        } catch (error) {
            const message = error instanceof Error ? error.message : "";
            setErrorMessage(message || (isEnglish
                ? "Could not submit your review. Check your connection and try again."
                : "تعذر إرسال تقييمك. تحقق من الاتصال وحاول مرة أخرى."));
        } finally {
            setIsSubmitting(false);
        }
    };

    const statusLabels = {
        pending: isEnglish ? "Pending review" : "بانتظار المراجعة",
        approved: isEnglish ? "Published" : "منشور",
        rejected: isEnglish ? "Needs a new submission" : "يمكنك إرسال تقييم جديد",
    };

    return (
        <section className="verified-reviews-section" dir={isEnglish ? "ltr" : "rtl"}>
            <div className="verified-reviews-heading">
                <span>TECHSPHERE</span>
                <h2>{isEnglish ? "Verified student reviews" : "تقييمات الطلاب الموثقة"}</h2>
                <p>{isEnglish
                    ? "Reviews are from activated student accounts and appear after admin approval."
                    : "التقييمات من حسابات طلاب مفعّلة، ولا تظهر إلا بعد اعتماد الإدارة."}</p>
            </div>

            {errorMessage && <p className="verified-review-alert" role="alert">{errorMessage}</p>}
            {successMessage && <p className="verified-review-success" role="status">{successMessage}</p>}

            {isLoading ? (
                <p className="verified-review-empty" role="status">{isEnglish ? "Loading reviews..." : "جارٍ تحميل التقييمات..."}</p>
            ) : publicReviews.length ? (
                <div className="verified-reviews-grid">
                    {publicReviews.map((review) => (
                        <article className="verified-review-card" key={review.id}>
                            <div className="verified-review-card-heading">
                                <span className="verified-review-avatar">{review.reviewer_name.trim().charAt(0)}</span>
                                <div>
                                    <h3>{review.reviewer_name}</h3>
                                    <span className="verified-review-badge">
                                        {isEnglish ? "Verified student account" : "حساب طالب مفعّل"}
                                    </span>
                                </div>
                            </div>
                            <div className="verified-review-stars" aria-label={`${review.rating} / 5`}>
                                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                            </div>
                            <p>{review.comment}</p>
                            <span className="verified-review-course">
                                {courses[review.course_id]?.[language]}
                            </span>
                        </article>
                    ))}
                </div>
            ) : null}

            <div className="verified-review-form-card">
                <h3>{isEnglish ? "Share your course experience" : "شارك تجربتك في الكورس"}</h3>
                {!user ? (
                    <p>
                        {isEnglish
                            ? "Sign in with a confirmed email and an activated student account to submit a review. "
                            : "سجّل الدخول ببريد مؤكد وحساب طالب مفعّل حتى تتمكن من إرسال تقييم. "}
                        <Link to={{ pathname: "/login", state: { from: "/opinins" } }}>
                            {isEnglish ? "Sign in" : "تسجيل الدخول"}
                        </Link>
                    </p>
                ) : !user.email_confirmed_at ? (
                    <p>
                        {isEnglish
                            ? "Confirm your account email before submitting a review. "
                            : "أكد البريد الإلكتروني لحسابك قبل إرسال تقييم. "}
                        <Link to="/traning/induvial">
                            {isEnglish ? "Open account activation" : "فتح صفحة تفعيل الحساب"}
                        </Link>
                    </p>
                ) : !isActivated ? (
                    <p>
                        {isEnglish
                            ? "Review submission is available to activated individual-training student accounts. "
                            : "إرسال التقييم متاح لحسابات طلاب تدريب الأفراد المفعّلة فقط. "}
                        <Link to="/traning/induvial">
                            {isEnglish ? "Activate your student account" : "فعّل حساب الطالب"}
                        </Link>
                    </p>
                ) : (
                    <>
                        <p>{isEnglish
                            ? "Your activated student account is verified. Reviews are moderated before publication; verification does not mean a paid purchase was confirmed."
                            : "تم التحقق من تفعيل حسابك. تُراجع التقييمات قبل نشرها؛ وهذا لا يعني إثبات شراء مدفوع."}</p>
                        {ownReviews.length > 0 && (
                            <ul className="verified-own-reviews">
                                {ownReviews.map((review) => (
                                    <li key={review.id}>
                                        {courses[review.course_id]?.[language]}: {statusLabels[review.moderation_status]}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {courses.some((course) => !ownReviews.some(
                            (review) => review.course_id === course.id && review.moderation_status !== "rejected",
                        )) && (
                            <form className="verified-review-form" onSubmit={handleSubmit}>
                                <label>
                                    {isEnglish ? "Course" : "الكورس"}
                                    <select value={courseId} onChange={(event) => setCourseId(event.target.value)} required>
                                        <option value="">{isEnglish ? "Choose a course" : "اختر الكورس"}</option>
                                        {courses.filter((course) => !ownReviews.some(
                                            (review) => review.course_id === course.id && review.moderation_status !== "rejected",
                                        )).map((course) => (
                                            <option key={course.id} value={course.id}>{course[language]}</option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    {isEnglish ? "Rating" : "التقييم"}
                                    <select value={rating} onChange={(event) => setRating(event.target.value)}>
                                        {[5, 4, 3, 2, 1].map((value) => (
                                            <option key={value} value={value}>{value} / 5</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="verified-review-comment">
                                    {isEnglish ? "Your review" : "تقييمك"}
                                    <textarea value={comment} onChange={(event) => setComment(event.target.value)}
                                        minLength={10} maxLength={1200} required rows={4} />
                                </label>
                                <label className="verified-review-consent">
                                    <input type="checkbox" required />
                                    {isEnglish
                                        ? "I agree to publish this review with my account name after moderation."
                                        : "أوافق على نشر التقييم باسمي الظاهر في الحساب بعد مراجعته."}
                                </label>
                                <button type="submit" disabled={isSubmitting || !courseId}>
                                    {isSubmitting
                                        ? (isEnglish ? "Submitting..." : "جارٍ الإرسال...")
                                        : (isEnglish ? "Submit review" : "إرسال التقييم")}
                                </button>
                            </form>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
