import React, { useEffect, useState } from 'react'
import './PayMant.css'
import { Link, useHistory, useParams } from "react-router-dom";
import Detalis from '../Cards/CoursesDetalis';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';
import Footer from '../Footer/Footer';
import { useLanguage } from '../i18n/language';
import { getSupabaseClient, isSupabaseConfigured } from '../login/supabase';
import { forwardFormspreeSubmission, submitSiteRequest } from '../utils/requestSubmission';
function PayMant() {
    const {id} = useParams();
    const courseIndex = Number(id);
    const Courses = Number.isInteger(courseIndex) && Detalis[courseIndex]
        ? Detalis[courseIndex]
        : Detalis[0];
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(isSupabaseConfigured());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [submissionNotice, setSubmissionNotice] = useState('');
    const { language } = useLanguage();
    const courseCopy = {
        0: ['تطوير الواجهات الأمامية', 'تعلّم HTML وCSS وJavaScript وReact وتصميم المواقع المتجاوبة.'],
        1: ['تطوير الواجهات الخلفية', 'تعلّم Node.js وExpress.js وواجهات REST API وقواعد البيانات والمصادقة.'],
        2: ['تطوير Full-Stack', 'أنشئ تطبيقات ويب متكاملة باستخدام تقنيات الواجهات الأمامية والخلفية.'],
        3: ['أتمتة n8n', 'تعلّم أتمتة سير العمل، وربط واجهات API، وأتمتة إجراءات الأعمال.'],
        4: ['الإلكترونيات التناظرية', 'تعرّف على الدوائر التناظرية والثنائيات والترانزستورات ومضخمات العمليات.'],
        5: ['الإلكترونيات الرقمية', 'تعلّم البوابات المنطقية والجبر البولياني والدوائر الرقمية والأنظمة التتابعية.'],
        6: ['تصميم لوحات PCB', 'تعلّم تصميم المخططات وتخطيط لوحات PCB وتوصيل المسارات وتصميم لوحات الدوائر.'],
        7: ['الروبوتات', 'استكشف أساسيات الروبوتات والمستشعرات والمشغلات وأنظمة التحكم.'],
    };
    const courseName = language === 'en' ? (Courses.title || Courses.name) : (courseCopy[Courses.id]?.[0] || Courses.title || Courses.name);
    const courseDescription = language === 'en' ? Courses.description : (courseCopy[Courses.id]?.[1] || Courses.description);

    const navigate = useHistory();

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
                : 'تعذر التحقق من الحساب. حدّث الصفحة وحاول مرة أخرى.');
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

    const handleSubmitEnrollment = async (event) => {
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
                courseId: Courses.id,
                courseName,
                message: values.message,
            });
        } catch (error) {
            setErrorMessage(language === 'en'
                ? 'Could not save your enrollment request. Please try again.'
                : error.message || 'تعذر حفظ طلب الاشتراك. حاول مرة أخرى.');
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
            navigate.push(`/Success/${Courses.id}`);
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
                    <h1>{language === 'en' ? 'Complete your enrollment' : 'إتمام الاشتراك'}</h1>
                    <p>{language === 'en' ? 'Enter your details and our team will contact you to confirm your enrollment.' : 'أدخل بياناتك وسيتواصل معك فريقنا لتأكيد اشتراكك.'}</p>
                </header>

                {authLoading ? (
                    <section className="payment-form-card payment-access-card" role="status">
                        {language === 'en' ? 'Checking your account...' : 'جارٍ التحقق من حسابك...'}
                    </section>
                ) : !isSupabaseConfigured() ? (
                    <section className="payment-form-card payment-access-card" role="alert">
                        {language === 'en'
                            ? 'Account service is unavailable. Please contact the platform administrator.'
                            : 'خدمة الحسابات غير متاحة. تواصل مع إدارة المنصة.'}
                    </section>
                ) : !user ? (
                    <section className="payment-form-card payment-access-card">
                        <h2>{language === 'en' ? 'Sign in to request enrollment' : 'سجّل الدخول لطلب الاشتراك'}</h2>
                        <p>{language === 'en'
                            ? 'Your request will be saved to your account so you can follow its status.'
                            : 'سيُحفظ الطلب في حسابك حتى تتمكن من متابعة حالته.'}</p>
                        <Link className="payment-login-link" to={{
                            pathname: '/login',
                            state: { from: `/Payment/${Courses.id}` },
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
                        <div className="payment-course">
                            <span className="payment-course-label">{language === 'en' ? 'Selected course' : 'الدورة المختارة'}</span>
                            <h2>{courseName}</h2>
                            <p>{courseDescription}</p>
                        </div>

                        <div className="payment-coupon">
                            <Form.Label className="payment-label" htmlFor="coupon">
                                {language === 'en' ? 'Do you have a discount code?' : 'هل لديك كوبون خصم؟'}
                            </Form.Label>
                            <InputGroup>
                                <Button className="payment-coupon-button" variant="primary">
                                    {language === 'en' ? 'Apply' : 'تطبيق'}
                                </Button>
                                <Form.Control
                                    id="coupon"
                                    type="text"
                                    placeholder={language === 'en' ? 'Enter coupon code' : 'أدخل كود الكوبون'}
                                    aria-label={language === 'en' ? 'Discount coupon code' : 'كود كوبون الخصم'}
                                />
                            </InputGroup>
                        </div>

                        <div className="payment-totals">
                            <div className="payment-total-row">
                                <span>{language === 'en' ? 'Enrollment price' : 'سعر الاشتراك'}</span>
                                <span>{Courses.price}</span>
                            </div>
                            <div className="payment-total-row payment-grand-total">
                                <span>{language === 'en' ? 'Total' : 'الإجمالي'}</span>
                                <span>{Courses.price}</span>
                            </div>
                        </div>
                    </Card>

                    <section className="payment-form-card" aria-labelledby="payment-form-title">
                        <div className="payment-form-heading">
                            <h2 id="payment-form-title">{language === 'en' ? 'Your details' : 'بياناتك'}</h2>
                            <p>{language === 'en' ? 'Complete the details below so we can contact you about your enrollment.' : 'املأ البيانات التالية لنتواصل معك بشأن الاشتراك.'}</p>
                        </div>

                        {errorMessage && <p className="payment-submit-message is-error" role="alert">{errorMessage}</p>}
                        {submitted ? (
                            <div className="payment-submit-message" role="status" aria-live="polite">
                                <p>{language === 'en' ? 'Your request was saved. You can follow its status from your account.' : 'تم حفظ طلبك. يمكنك متابعة حالته من صفحة حسابك.'}</p>
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
                                <label className="fs-label" htmlFor="message">{language === 'en' ? 'Additional notes' : 'ملاحظات إضافية'}</label>
                                <textarea className="fs-textarea" id="message" name="message" rows="4"/>
                            </div>
                            <div className="fs-button-group">
                                <button className="fs-button" type="submit" disabled={isSubmitting}>
                                    {isSubmitting
                                        ? (language === 'en' ? 'Submitting...' : 'جارٍ الإرسال...')
                                        : (language === 'en' ? 'Submit enrollment details' : 'إرسال بيانات الاشتراك')}
                                </button>
                            </div>
                        </form>
                        )}
                    </section>
                </div>
                )}
            </div>
            <Footer />
        </main>
    )
}

export default PayMant
