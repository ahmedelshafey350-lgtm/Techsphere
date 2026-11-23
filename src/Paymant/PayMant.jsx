import React, { useEffect, useState } from 'react'
import './PayMant.css'
import { Link, useHistory, useParams } from "react-router-dom";
import { Card, Form, Button, InputGroup } from 'react-bootstrap';
import { useLanguage } from '../i18n/language';
import { getSupabaseClient, isSupabaseConfigured } from '../login/supabase';
import { forwardFormspreeSubmission, submitSiteRequest } from '../utils/requestSubmission';
import { formatCoursePrice, loadCourseDetails } from '../utils/courses';
function PayMant({ projectId }) {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loadedCourseId, setLoadedCourseId] = useState('');
    const [courseLoadError, setCourseLoadError] = useState('');
    const [project, setProject] = useState(null)
    const [projectLoadError, setProjectLoadError] = useState('')
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(isSupabaseConfigured());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [submissionNotice, setSubmissionNotice] = useState('');
    const { language } = useLanguage();
    const navigate = useHistory();

    useEffect(() => {
        let isActive = true;
        loadCourseDetails(id)
            .then((loadedCourse) => {
                if (isActive) {
                    setCourse(loadedCourse);
                    setCourseLoadError('');
                }
            })
            .catch((error) => {
                if (isActive) setCourseLoadError(error.message);
            })
            .finally(() => {
                if (isActive) setLoadedCourseId(id);
            });
        return () => {
            isActive = false;
        };
    }, [id]);

    useEffect(() => {
        if (!projectId) return;

        let isActive = true;

        const fetchProject = async () => {
            // Fetch project details from supabase
            const supa = getSupabaseClient();
            const { data, error } = await supa.from('projects').select('*').eq('id', projectId).maybeSingle();

            if (!isActive) return;

            if (error) {
                setProjectLoadError(error.message);
            } else {
                setProject(data);
            }
        };

        fetchProject();

        return () => {
            isActive = false;
        };
    }, [projectId]);

    useEffect(() => {
        if (!isSupabaseConfigured()) {
            return undefined;
        }

        const supabase = getSupabaseClient();
        let isActive = true;
        const loadSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (!isActive) return;
            if (error) setErrorMessage(language === 'en'
                ? 'Could not verify your account. Refresh the page and try again.'
                : 'تعذر التحقق من الحساب. حدّث الصفحة وحاول مرة أخرت.');
            setUser(session?.user ?? null);
            setAuthLoading(false);
        };
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!isActive) return;
            setUser(session?.user ?? null);
        });
        loadSession();
        return () => {
            isActive = false;
            subscription.unsubscribe();
        };
    }, [language]);

    const courseName = project ? (language === 'en' ? project.title_en : project.title_ar) : (course ? (language === 'en' ? course.name : course.nameAr) : '');
    const courseDescription = course ? (language === 'en' ? course.description : course.descriptionAr) : '';

    const handleSubmitEnrollment = async (event) => {
        if (!course) return;
        event.preventDefault();
        setErrorMessage('');
        setSubmissionNotice('');
        setIsSubmitting(true);
        const values = Object.fromEntries(new FormData(event.currentTarget).entries());
        try {
            await submitSiteRequest({
                requestType: 'course_enrollment',
                name: values.name,
                phone: values.phone,
                courseId: course.routeId,
                courseName,
                message: values.message,
            });
        } catch (error) {
            setErrorMessage(language === 'en'
                ? 'Could not save your enrollment request. Please try again.'
                : error.message || 'تعذر حفظ طلب الاشتراك. حاول مرة أخرت.');
            setIsSubmitting(false);
            return;
        }

        try {
            await forwardFormspreeSubmission('xyeepobk', {
                'name-Course': courseName,
                name: values.name,
                email: user.email,
                phone: values.phone,
                message: values.message,
            });
            navigate.push(`/Success/${course.routeId}`);
        } catch {
            setSubmitted(true);
            setSubmissionNotice(language === 'en'
                ? 'Your request is saved in your account, but the email notification could not be sent.'
                : 'تم حفظ الطلب في حسابك، لكن تعذر إرسال نسخة البريد.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="payment-page" dir={language === 'en' ? 'ltr' : 'rtl'}>
            <div className="payment-container">
                <header className="payment-heading">
                    <span className="payment-eyebrow">{language === 'en' ? 'One step away from learning' : 'خطوة واحدة تفصلك عن التعلم'}</span>
                    <h1>{language === 'en' ? 'Complete your enrollment' : 'إتمام الاشتراف'}</h1>
                    <p>{language === 'en' ? 'Enter your details and our team will contact you to confirm your enrollment.' : 'أدخل بياناتك وسيتواصل معك فريقنا لتأكيد اشتراكف.'}</p>
                </header>

                {loadedCourseId !== id ? (
                    <section className="payment-form-card payment-access-card" role="status">
                        {language === 'en' ? 'Loading course information...' : 'جارٍ تحميل معلومات الكورس...'}
                    </section>
                ) : courseLoadError || !course ? (
                    <section className="payment-form-card payment-access-card" role="alert">
                        <h2>{language === 'en' ? 'Course unavailable' : 'الكورس غير متاح'}</h2>
                        <p>{courseLoadError || (language === 'en' ? 'This course could not be found.' : 'لم يتم العثور على هذا الكورس.')}</p>
                        <Link className="payment-login-link" to="/Courses">
                            {language === 'en' ? 'Browse courses' : 'تصفح الكورسات'}
                        </Link>
                    </section>
                ) : (
                    <>
                        <section className="payment-course-preview" aria-label={language === 'en' ? 'Selected course information' : 'معلومات الكورس المختار'}>
                            {course.image && <img src={course.image} alt={courseName} />}
                            <div className="payment-course-preview-content">
                                <span className="payment-course-label">{language === 'en' ? 'Selected course' : 'الكورس المختار'}</span>
                                <h2>{courseName}</h2>
                                <p>{courseDescription}</p>
                                <strong>
                                    {language === 'en' ? 'Price' : 'السعر'}: {formatCoursePrice(course.current_price, course.currency_code, language)}
                                    {course.discount_percentage > 0 && (
                                        <del className="payment-original-price">
                                            {formatCoursePrice(course.original_price, course.currency_code, language)}
                                        </del>
                                    )}
                                </strong>
                                <Link className="payment-course-details-link" to={`/Courses/${course.routeId}`}>
                                    {language === 'en' ? 'View course details' : 'عرض تفاصيل الكورس'}
                                </Link>
                            </div>
                        </section>

                        {authLoading ? (
                            <section className="payment-form-card payment-access-card" role="status">
                                {language === 'en' ? 'Checking your account...' : 'جارٍ التحقق من حسابف...'}
                            </section>
                        ) : !isSupabaseConfigured() ? (
                            <section className="payment-form-card payment-access-card" role="alert">
                                {language === 'en'
                                    ? 'Account service is unavailable. Please contact the platform administrator.'
                                    : 'خدمة الحسابات غير متاحة. تواصل مع إدارة المنصة.'}
                            </section>
                        ) : !user ? (
                            <section className="payment-form-card payment-access-card">
                                <h2>{language === 'en' ? 'Sign in to request enrollment' : 'سجّل الدخول لطلب الاشتراف'}</h2>
                                <p>{language === 'en'
                                    ? 'Your request will be saved to your account so you can follow its status.'
                                    : 'سيُحفظ الطلب في حسابك حتى تتمكن من متابعة حالته.'}</p>
                                <Link className="payment-login-link" to={{
                                    pathname: '/login',
                                    state: { from: `/Payment/${course.routeId}` },
                                }}>
                                    {language === 'en' ? 'Sign in' : 'تسجيل الدخول'}
                                </Link>
                            </section>
                        ) : !user.email_confirmed_at ? (
                            <section className="payment-form-card payment-access-card">
                                <h2>{language === 'en' ? 'Confirm your email first' : 'أكد بريدك الإلكتروني أولًا'}</h2>
                                <p>{language === 'en'
                                    ? 'Confirm the email address linked to your account before submitting a request.'
                                    : 'أكد البريد الإلكتروني المرتبط بحسابك قبل إرسال الطلب.'}</p>
                            </section>
                        ) : (
                            <div className="payment-layout">
                                <Card className="payment-summary">
                                    <div className="payment-coupon">
                                        <Form.Label className="payment-label" htmlFor="coupon">
                                            {language === 'en' ? 'Do you have a discount code?' : 'هل لديك كوبون خصمة'}
                                        </Form.Label>
                                        <InputGroup>
                                            <Button className="payment-coupon-button" variant="primary">
                                                {language === 'en' ? 'Apply' : 'تطبيت'}
                                            </Button>
                                            <Form.Control
                                                id="coupon"
                                                type="text"
                                                placeholder={language === 'en' ? 'Enter coupon code' : 'أدخل كود الكوبوك'}
                                                aria-label={language === 'en' ? 'Discount coupon code' : 'كود كوبون الخصم'}
                                            />
                                        </InputGroup>
                                    </div>

                                    <div className="payment-totals">
                                        <div className="payment-total-row">
                                            <span>{language === 'en' ? 'Enrollment price' : 'سعر الاشتراف'}</span>
                                            <span>{formatCoursePrice(course.current_price, course.currency_code, language)}</span>
                                        </div>
                                        <div className="payment-total-row payment-grand-total">
                                            <span>{language === 'en' ? 'Total' : 'الإجمالي'}</span>
                                            <span>{formatCoursePrice(course.current_price, course.currency_code, language)}</span>
                                        </div>
                                    </div>
                                </Card>

                                <section className="payment-form-card" aria-labelledby="payment-form-title">
                                    <div className="payment-form-heading">
                                        <h2 id="payment-form-title">{language === 'en' ? 'Your details' : 'بياناتف'}</h2>
                                        <p>{language === 'en' ? 'Complete the details below so we can contact you about your enrollment.' : 'املأ البيانات التالية لنتواصل معك بشأن الاشتراف.'}</p>
                                    </div>

                                    {errorMessage && <p className="payment-submit-message is-error" role="alert">{errorMessage}</p>}
                                    {submitted ? (
                                        <div className="payment-submit-message" role="status" aria-live="polite">
                                            <p>{language === 'en' ? 'Your request was saved. You can follow its status from your account.' : 'تم حفظ طلبك. يمكنك متابعة حالته من صفحة حسابف.'}</p>
                                            {submissionNotice && <p>{submissionNotice}</p>}
                                        </div>
                                    ) : (
                                        <form className="payment-form fs-form" onSubmit={handleSubmitEnrollment}>
                                            <div className="fs-field">
                                                <label className="fs-label" htmlFor="name-course">{language === 'en' ? 'Course name' : 'اسم الكورس'}</label>
                                                <input className="fs-input" id="name-course" name="name-Course" value={courseName} readOnly />
                                            </div>
                                            <div className="fs-field">
                                                <label className="fs-label" htmlFor="name">{language === 'en' ? 'Full name' : 'الاسم بالكامل'}</label>
                                                <input className="fs-input" id="name" name="name" autoComplete="name" required />
                                            </div>
                                            <div className="fs-field">
                                                <label className="fs-label" htmlFor="email">{language === 'en' ? 'Email address' : 'البريد الإلكتروني'}</label>
                                                <input className="fs-input" id="email" name="email" type="email" autoComplete="email" required />
                                            </div>
                                            <input type="hidden" name="email" value={user.email} />
                                            <div className="fs-field">
                                                <label className="fs-label" htmlFor="phone">{language === 'en' ? 'Phone number' : 'رقم الهاتف'}</label>
                                                <input className="fs-input" type="tel" id="phone" name="phone" autoComplete="tel" required />
                                            </div>
                                            <div className="fs-field">
                                                <label className="fs-label" htmlFor="expectedPrice">{language === 'en' ? 'Expected price limits' : 'السعر المتوقع'}</label>
                                                <input className="fs-input" type="number" id="expectedPrice" name="expectedPrice" placeholder={language === 'en' ? 'Enter price' : 'أدخل السعر'} />
                                            </div>
                                            <div className="fs-field">
                                                <label className="fs-label" htmlFor="deliveryTime">{language === 'en' ? 'Delivery time' : 'وقت التسليم'}</label>
                                                <input className="fs-input" type="text" id="deliveryTime" name="deliveryTime" placeholder={language === 'en' ? 'e.g. 2-3 weeks' : 'مثال: من 2-3 أسابيع'} />
                                            </div>
                                            <div className="fs-field">
                                                <label className="fs-label" htmlFor="address">{language === 'en' ? 'Detailed address' : 'العنوان التفصيلي'}</label>
                                                <textarea className="fs-textarea" id="address" name="address" rows="3"></textarea>
                                            </div>
                                            <div className="fs-field">
                                                <label className="fs-label" htmlFor="message">{language === 'en' ? 'Additional notes' : 'ملاحظات إضافية'}</label>
                                                <textarea className="fs-textarea" id="message" name="message" rows="4" />
                                            </div>
                                            <div className="fs-button-group">
                                                <button className="fs-button" type="submit" disabled={isSubmitting}>
                                                    {isSubmitting
                                                        ? (language === 'en' ? 'Submitting...' : 'جارٍ الإرسال...')
                                                        : (language === 'en' ? 'Submit enrollment details' : 'إرسال بيانات الاشتراف')}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </section>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    )
}

export default PayMant
