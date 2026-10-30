import React, { useEffect, useState } from 'react';
import { useForm } from '@formspree/react';
import { useHistory } from 'react-router-dom';
import { getSupabaseClient, isSupabaseConfigured } from '../login/supabase';
import './FormIndivual.css';
import { useLanguage } from '../i18n/language';

function FormIndivual() {
    const history = useHistory();
    const { language } = useLanguage();
    const configured = isSupabaseConfigured();
    const [state, handleSubmit] = useForm('xppplnqp');
    const [student, setStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(configured);
    const [loadError, setLoadError] = useState(
        configured ? '' : 'تعذر الاتصال بخدمة الحسابات. حاول مرة أخرى لاحقًا.'
    );
    const englishErrors = {
        'تعذر الاتصال بخدمة الحسابات. حاول مرة أخرى لاحقًا.': 'Could not connect to the account service. Please try again later.',
        'تعذر التحقق من حسابك. أعد تسجيل الدخول وحاول مرة أخرى.': 'Could not verify your account. Sign in again and try once more.',
        'أكد بريدك الإلكتروني أولًا قبل إرسال طلب تدريب الأفراد.': 'Confirm your email address before submitting an individual training request.',
        'تعذر تحميل بيانات التفعيل. تأكد من إعداد جدول profiles في Supabase.': 'Could not load activation details. Make sure the profiles table is configured in Supabase.',
        'يجب تفعيل حسابك أولًا قبل إرسال طلب التسجيل.': 'You must activate your account before submitting a registration request.',
    };
    const localizeError = (message) => language === 'en' ? (englishErrors[message] || message) : message;

    useEffect(() => {
        if (!configured) return undefined;

        const supabase = getSupabaseClient();
        let isActive = true;
        const loadStudent = async () => {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (!isActive) return;
            if (sessionError) {
                setLoadError('تعذر التحقق من حسابك. أعد تسجيل الدخول وحاول مرة أخرى.');
                setIsLoading(false);
                return;
            }
            if (!session?.user) {
                history.replace('/login');
                return;
            }

            if (!session.user.email_confirmed_at) {
                setLoadError('أكد بريدك الإلكتروني أولًا قبل إرسال طلب تدريب الأفراد.');
                setIsLoading(false);
                return;
            }

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('full_name, email, student_id, individual_training_activated_at')
                .eq('id', session.user.id)
                .maybeSingle();

            if (!isActive) return;
            if (profileError) {
                setLoadError(
                    'تعذر تحميل بيانات التفعيل. تأكد من إعداد جدول profiles في Supabase.'
                );
            } else if (!profile?.student_id || !profile.individual_training_activated_at) {
                history.replace('/traning/induvial');
                return;
            } else {
                setStudent({
                    name: profile.full_name || session.user.user_metadata?.full_name || '',
                    email: profile.email || session.user.email || '',
                    studentId: profile.student_id,
                });
            }
            setIsLoading(false);
        };

        loadStudent();
        return () => {
            isActive = false;
        };
    }, [configured, history]);

    useEffect(() => {
        if (!state.succeeded) return undefined;

        const redirectTimer = window.setTimeout(() => {
            history.replace('/');
        }, 3000);

        return () => window.clearTimeout(redirectTimer);
    }, [state.succeeded, history]);

    if (isLoading) {
        return (
            <main className="individual-form-page" dir={language === 'en' ? 'ltr' : 'rtl'}>
                <section className="individual-form-card individual-form-loading" role="status">
                    {language === 'en' ? 'Checking your account activation...' : 'جارٍ التحقق من تفعيل حسابك...'}
                </section>
            </main>
        );
    }

    if (loadError || !student) {
        return (
            <main className="individual-form-page" dir={language === 'en' ? 'ltr' : 'rtl'}>
                <section className="individual-form-card individual-form-blocked">
                    <h1>{language === 'en' ? 'Individual Training Registration' : 'تسجيل تدريب الأفراد'}</h1>
                    <p className="individual-form-page-error" role="alert">
                        {localizeError(loadError || 'يجب تفعيل حسابك أولًا قبل إرسال طلب التسجيل.')}
                    </p>
                    <button
                        type="button"
                        className="individual-form-secondary-button"
                        onClick={() => history.push('/traning/induvial')}
                    >
                        {language === 'en' ? 'Go to the activation page' : 'الذهاب إلى صفحة التفعيل'}
                    </button>
                </section>
            </main>
        );
    }

    return (
        <main className="individual-form-page" dir={language === 'en' ? 'ltr' : 'rtl'}>
            <div className="individual-form-shell">
                <header className="individual-form-heading">
                    <span>{language === 'en' ? 'TECHSPHERE · Individual Training' : 'TECHSPHERE · تدريب الأفراد'}</span>
                    <h1>{language === 'en' ? 'Complete your registration' : 'أكمل بيانات التسجيل'}</h1>
                    <p>
                        {language === 'en' ? 'Your account is activated. Check your student ID and submit your details so the training team can contact you.' : 'تم تفعيل حسابك. راجع رقمك التعريفي وأرسل بياناتك حتى يصلك فريق التدريب.'}
                    </p>
                </header>

                <section className="individual-form-card">
                    {state.succeeded ? (
                        <div className="individual-form-complete" role="status" aria-live="polite">
                            <h2>{language === 'en' ? 'Your request was received' : 'تم استلام طلبك بنجاح'}</h2>
                            <p>
                                {language === 'en' ? 'We received your details and student ID. We will contact you soon, and you will be redirected to the home page shortly.' : 'وصلتنا بياناتك ورقمك التعريفي. هنتواصل معك قريبًا، وسيتم تحويلك للرئيسية بعد لحظات.'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="individual-form-student-id">
                                <span>{language === 'en' ? 'Student ID' : 'رقم الطالب التعريفي'}</span>
                                <strong dir="ltr">{student.studentId}</strong>
                            </div>

                            <form
                                className="individual-training-form fs-form"
                                onSubmit={handleSubmit}
                            >
                                <input
                                    type="hidden"
                                    name="student_id"
                                    value={student.studentId}
                                />

                                <div className="fs-field">
                                    <label className="fs-label" htmlFor="individual-name">
                                        {language === 'en' ? 'Full name' : 'الاسم الكامل'}
                                    </label>
                                    <input
                                        className="fs-input"
                                        id="individual-name"
                                        name="name"
                                        type="text"
                                        value={student.name}
                                        readOnly
                                        required
                                    />
                                </div>

                                <div className="fs-field">
                                    <label className="fs-label" htmlFor="individual-email">
                                        {language === 'en' ? 'Email address' : 'البريد الإلكتروني'}
                                    </label>
                                    <input
                                        className="fs-input"
                                        id="individual-email"
                                        name="email"
                                        type="email"
                                        value={student.email}
                                        readOnly
                                        required
                                        dir="ltr"
                                    />
                                </div>

                                <div className="fs-field">
                                    <label className="fs-label" htmlFor="individual-phone">
                                        {language === 'en' ? 'Phone number' : 'رقم الهاتف'}
                                    </label>
                                    <input
                                        className="fs-input"
                                        id="individual-phone"
                                        name="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        required
                                        dir="ltr"
                                    />
                                </div>

                                <div className="fs-field">
                                    <label className="fs-label" htmlFor="individual-portfolio">
                                        {language === 'en' ? 'Portfolio or professional profile URL (optional)' : 'رابط أعمالك أو حسابك المهني (اختياري)'}
                                    </label>
                                    <input
                                        className="fs-input"
                                        id="individual-portfolio"
                                        name="portfolio"
                                        type="url"
                                        placeholder="https://"
                                        dir="ltr"
                                    />
                                </div>

                                <div className="fs-field">
                                    <label className="fs-label" htmlFor="individual-message">
                                        {language === 'en' ? 'Training field or details (optional)' : 'المجال أو تفاصيل التدريب المطلوب (اختياري)'}
                                    </label>
                                    <textarea
                                        className="fs-textarea"
                                        id="individual-message"
                                        name="message"
                                        rows="5"
                                    />
                                </div>

                                {state.errors && (
                                    <div
                                        className="individual-form-error"
                                        role="alert"
                                        aria-live="assertive"
                                    >
                                        {state.errors.getFormErrors().map((formError, index) => (
                                            <p key={`form-error-${index}`}>{formError.message}</p>
                                        ))}
                                        {state.errors.getAllFieldErrors().map(([field, fieldErrors]) => (
                                            <p key={`field-error-${field}`}>
                                                {language === 'en'
                                                    ? `${({ name: 'Name', email: 'Email address', phone: 'Phone number', portfolio: 'Portfolio', message: 'Message' })[field] || field}: ${fieldErrors.map((fieldError) => fieldError.message).join(', ')}`
                                                    : `${field}: ${fieldErrors.map((fieldError) => fieldError.message).join(', ')}`}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                <button
                                    className="fs-button individual-submit-button"
                                    type="submit"
                                    disabled={state.submitting || state.succeeded}
                                >
                                    {state.submitting
                                        ? (language === 'en' ? 'Submitting your details...' : 'جارٍ إرسال بياناتك...')
                                        : (language === 'en' ? 'Submit registration request' : 'إرسال طلب التسجيل')}
                                </button>
                            </form>
                        </>
                    )}
                </section>
            </div>
        </main>
    );
}

export default FormIndivual;
