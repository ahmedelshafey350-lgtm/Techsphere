import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    CheckCircle2,
    Copy,
    GraduationCap,
    KeyRound,
    LoaderCircle,
    Mail,
    RefreshCw,
    ShieldCheck,
} from 'lucide-react';
import { getSupabaseClient, isSupabaseConfigured } from '../login/supabase';
import './Traning.css';
import './TrainingActivation.css';
import { useLanguage } from '../i18n/language';

const englishActivationMessages = {
    'تعذر إكمال الطلب. حاول مرة أخرى.': 'Could not complete the request. Please try again.',
    'تعذر الاتصال بخدمة التفعيل. حاول مرة أخرى.': 'Could not connect to the activation service. Please try again.',
    'خدمة الحسابات غير مهيأة. تواصل مع إدارة المنصة.': 'The account service is not configured. Please contact the platform administrator.',
    'تعذر التحقق من تسجيل الدخول. حاول تحديث الصفحة.': 'Could not verify your sign-in. Please refresh the page.',
    'تعذر تحميل حالة تدريب الأفراد. تأكد من تنفيذ إعدادات التفعيل في تعليمات Supabase.': 'Could not load individual training status. Make sure you have completed the activation setup in the Supabase instructions.',
    'أرسلنا رسالة تأكيد جديدة إلى بريدك الإلكتروني.': 'A new confirmation email has been sent to your inbox.',
    'تعذر إرسال رسالة التأكيد. حاول مرة أخرى.': 'Could not send the confirmation email. Please try again.',
    'تعذر تفعيل الحساب. حاول مرة أخرى.': 'Could not activate the account. Please try again.',
    'تعذر نسخ الرقم تلقائيًا. حدده وانسخه يدويًا.': 'Could not copy the ID automatically. Select and copy it manually.',
};

function localizeActivationMessage(message, language) {
    if (language !== 'en' || !message) return message;
    if (englishActivationMessages[message]) return englishActivationMessages[message];
    return /[\u0600-\u06FF]/.test(message)
        ? 'Could not complete activation. Please check the code and try again.'
        : message;
}

function getErrorMessage(error, language) {
    if (error?.context instanceof Response) {
        return error.context.clone().json()
            .then((body) => localizeActivationMessage(body.error || 'تعذر إكمال الطلب. حاول مرة أخرى.', language))
            .catch(() => localizeActivationMessage('تعذر الاتصال بخدمة التفعيل. حاول مرة أخرى.', language));
    }

    return Promise.resolve(
        localizeActivationMessage(error?.message || 'تعذر الاتصال بخدمة التفعيل. حاول مرة أخرى.', language)
    );
}

export default function Induvuial() {
    const history = useHistory();
    const { language } = useLanguage();
    const configured = isSupabaseConfigured();
    const [user, setUser] = useState(null);
    const [activation, setActivation] = useState(null);
    const [isLoading, setIsLoading] = useState(configured);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activationCode, setActivationCode] = useState('');
    const [errorMessage, setErrorMessage] = useState(
        configured ? '' : 'خدمة الحسابات غير مهيأة. تواصل مع إدارة المنصة.'
    );
    const [successMessage, setSuccessMessage] = useState('');
    const [verificationSent, setVerificationSent] = useState(false);
    const [copied, setCopied] = useState(false);
    const [hasCopiedStudentId, setHasCopiedStudentId] = useState(false);

    useEffect(() => {
        if (!configured) return undefined;

        const supabase = getSupabaseClient();
        let isActive = true;
        const acceptSessionUser = (currentUser) => {
            if (!currentUser) {
                history.replace('/login');
                return;
            }

            setUser(currentUser);
            if (!currentUser.email_confirmed_at) {
                setActivation(null);
            }
            setIsLoading(Boolean(currentUser.email_confirmed_at));
        };

        const initialize = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (!isActive) return;
            if (error) {
                setErrorMessage('تعذر التحقق من تسجيل الدخول. حاول تحديث الصفحة.');
                setIsLoading(false);
                return;
            }
            acceptSessionUser(data.session?.user);
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (!isActive || event === 'INITIAL_SESSION') return;
                if (!session?.user) {
                    history.replace('/login');
                    return;
                }
                acceptSessionUser(session.user);
            }
        );

        initialize();
        return () => {
            isActive = false;
            subscription.unsubscribe();
        };
    }, [configured, history]);

    useEffect(() => {
        if (!user?.email_confirmed_at) return undefined;

        let isActive = true;
        const loadActivation = async () => {
            const { data, error } = await getSupabaseClient()
                .from('profiles')
                .select('student_id, individual_training_activated_at')
                .eq('id', user.id)
                .maybeSingle();

            if (!isActive) return;
            if (error) {
                setErrorMessage(
                    'تعذر تحميل حالة تدريب الأفراد. تأكد من تنفيذ إعدادات التفعيل في تعليمات Supabase.'
                );
            } else {
                setActivation(data);
            }
            setIsLoading(false);
        };

        loadActivation();
        return () => {
            isActive = false;
        };
    }, [user]);

    const handleResendVerification = async () => {
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const { error } = await getSupabaseClient().auth.resend({
                type: 'signup',
                email: user?.email || '',
            });
            if (error) throw error;

            setVerificationSent(true);
            setSuccessMessage('أرسلنا رسالة تأكيد جديدة إلى بريدك الإلكتروني.');
        } catch (error) {
            setErrorMessage(error?.message || 'تعذر إرسال رسالة التأكيد. حاول مرة أخرى.');
        }
    };

    const handleActivation = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setIsSubmitting(true);

        try {
            const supabase = getSupabaseClient();
            const { data, error } = await supabase.functions.invoke(
                'activate-individual',
                { body: { activationCode: activationCode.trim() } }
            );
            if (error) throw error;
            if (!data?.success || !data.studentId) {
                throw new Error(data?.error || 'تعذر تفعيل الحساب. حاول مرة أخرى.');
            }

            setActivation({
                student_id: data.studentId,
                individual_training_activated_at: new Date().toISOString(),
            });
            setSuccessMessage(data.message);
            setActivationCode('');
        } catch (error) {
            setErrorMessage(await getErrorMessage(error, language));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopyStudentId = async () => {
        if (!activation?.student_id) return;

        try {
            await navigator.clipboard.writeText(activation.student_id);
            setCopied(true);
            setHasCopiedStudentId(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setErrorMessage('تعذر نسخ الرقم تلقائيًا. حدده وانسخه يدويًا.');
        }
    };

    const handleContinueToRegistration = () => {
        if (!activation?.student_id) return;
        history.push('/FormIndivuail');
    };

    if (isLoading) {
        return (
            <main className="training-individual-page individual-activation-page" dir={language === 'en' ? 'ltr' : 'rtl'}>
                <section className="individual-activation-card" role="status">
                    <LoaderCircle className="individual-activation-spinner" size={28} />
                    <p>{language === 'en' ? 'Loading your account status...' : 'جارٍ تحميل حالة حسابك...'}</p>
                </section>
            </main>
        );
    }

    const isVerified = Boolean(user?.email_confirmed_at);
    const isActivated = Boolean(
        activation?.student_id && activation?.individual_training_activated_at
    );

    return (
        <main className="training-individual-page individual-activation-page" dir={language === 'en' ? 'ltr' : 'rtl'}>
            <div className="individual-activation-glow" aria-hidden="true" />
            <div className="individual-activation-content">
                <header className="individual-activation-heading">
                    <span className="individual-activation-icon">
                        <GraduationCap size={30} aria-hidden="true" />
                    </span>
                    <span className="individual-activation-eyebrow">{language === 'en' ? 'TECHSPHERE · STUDENT PORTAL' : 'TECHSPHERE · بوابة الطلاب'}</span>
                    <h1>{language === 'en' ? 'Activate Individual Training' : 'تفعيل تدريب الأفراد'}</h1>
                    <p>
                        {language === 'en' ? 'Activate your account once and keep your student ID to follow your learning journey.' : 'فعّل حسابك مرة واحدة، واحتفظ برقمك التعريفي لمتابعة رحلتك التعليمية.'}
                    </p>
                </header>

                {errorMessage && (
                    <div className="individual-activation-alert" role="alert">
                        {localizeActivationMessage(errorMessage, language)}
                    </div>
                )}
                {successMessage && (
                    <div className="individual-activation-success" role="status">
                        <CheckCircle2 size={19} aria-hidden="true" />
                        <span>{language === 'en' && successMessage && /[\u0600-\u06FF]/.test(successMessage)
                            ? 'Your account has been activated successfully.'
                            : localizeActivationMessage(successMessage, language)}</span>
                    </div>
                )}

                <section className="individual-activation-card">
                    <div className="individual-activation-account">
                        <span className="individual-activation-account-icon">
                            {isVerified ? <ShieldCheck size={19} /> : <Mail size={19} />}
                        </span>
                        <div>
                            <span className="individual-activation-caption">{language === 'en' ? 'Current account' : 'الحساب الحالي'}</span>
                            <strong dir="ltr">{user?.email}</strong>
                        </div>
                    </div>

                    {!isVerified ? (
                        <div className="individual-activation-step">
                            <h2>{language === 'en' ? 'Confirm your email first' : 'أكد بريدك الإلكتروني أولًا'}</h2>
                            <p>
                                {language === 'en' ? 'We sent a verification link when you created your account. Open the email, confirm your address, and return to this page.' : 'أرسلنا رابط التحقق عند إنشاء الحساب. افتح الرسالة، وبعد تأكيد البريد ارجع لهذه الصفحة.'}
                            </p>
                            <div className="individual-activation-actions">
                                <button
                                    className="individual-activation-button"
                                    type="button"
                                    onClick={handleResendVerification}
                                >
                                    <Mail size={18} />
                                    {verificationSent
                                        ? (language === 'en' ? 'Resend confirmation email' : 'إعادة إرسال رسالة التأكيد')
                                        : (language === 'en' ? 'Send confirmation email' : 'إرسال رسالة التأكيد')}
                                </button>
                                <button
                                    className="individual-activation-button is-secondary"
                                    type="button"
                                    onClick={() => window.location.reload()}
                                >
                                    <RefreshCw size={17} />
                                    {language === 'en' ? 'I confirmed my email' : 'تحققت من بريدي'}
                                </button>
                            </div>
                        </div>
                    ) : isActivated ? (
                        <div className="individual-activation-step">
                            <div className="individual-activation-complete">
                                <CheckCircle2 size={24} aria-hidden="true" />
                                <div>
                                    <h2>{language === 'en' ? 'Individual training is activated' : 'حساب تدريب الأفراد مفعّل'}</h2>
                                    <p>{language === 'en' ? 'Your activation is saved to your account, so you will not need to enter the administrator code again.' : 'تفعيلك محفوظ على حسابك، ولن تحتاج لإدخال كود المالك مرة أخرى.'}</p>
                                </div>
                            </div>
                            <div className="individual-student-id">
                                <div>
                                    <span className="individual-activation-caption">{language === 'en' ? 'Your student ID' : 'رقمك التعريفي'}</span>
                                    <strong dir="ltr">{activation.student_id}</strong>
                                </div>
                                <button
                                    type="button"
                                    className="individual-copy-button"
                                    onClick={handleCopyStudentId}
                                    aria-label={language === 'en' ? 'Copy student ID' : 'نسخ الرقم التعريفي'}
                                >
                                    {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                                    {copied
                                        ? (language === 'en' ? 'Copied' : 'تم النسخ')
                                        : (language === 'en' ? 'Copy' : 'نسخ')}
                                </button>
                            </div>
                            <div className="individual-registration-next">
                                <p>
                                    {language === 'en' ? 'Copy and keep your student ID, then complete the registration form.' : 'انسخ رقمك التعريفي واحتفظ به، ثم أكمل بيانات التسجيل في الفورم.'}
                                </p>
                                <button
                                    className="individual-activation-button"
                                    type="button"
                                    disabled={!hasCopiedStudentId}
                                    onClick={handleContinueToRegistration}
                                >
                                    {hasCopiedStudentId
                                        ? (language === 'en' ? 'Continue to registration' : 'متابعة إلى تسجيل الأفراد')
                                        : (language === 'en' ? 'Copy your student ID to continue' : 'انسخ رقم الطالب أولًا للمتابعة')}
                                    <GraduationCap size={18} aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form className="individual-activation-form" onSubmit={handleActivation}>
                            <div className="individual-activation-step">
                                <h2>{language === 'en' ? 'Enter the activation code from the administrator' : 'أدخل كود التفعيل من المالك'}</h2>
                                <p>
                                    {language === 'en' ? 'After verification, we will create a unique student ID and save the activation to your account. Then copy the ID and continue to the registration form.' : 'بعد التحقق، هننشئ لك رقمًا تعريفيًا خاصًا ونحفظ التفعيل على حسابك. بعدها انسخ الرقم وانتقل لفورم التسجيل.'}
                                </p>
                            </div>
                            <label htmlFor="individual-activation-code">{language === 'en' ? 'Administrator code' : 'كود المالك'}</label>
                            <div className="individual-activation-input">
                                <KeyRound size={18} aria-hidden="true" />
                                <input
                                    id="individual-activation-code"
                                    type="password"
                                    value={activationCode}
                                    onChange={(event) => setActivationCode(event.target.value)}
                                    placeholder={language === 'en' ? 'Enter the code you received from the administrator' : 'أدخل الكود الذي استلمته من المالك'}
                                    autoComplete="off"
                                    required
                                />
                            </div>
                            <p className="individual-activation-hint">
                                {language === 'en' ? 'The code is not stored on this website; it is verified on the Supabase server.' : 'الكود لا يُحفظ في الموقع؛ يتم التحقق منه على خادم Supabase.'}
                            </p>
                            <button
                                className="individual-activation-button"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? <LoaderCircle className="individual-activation-spinner" size={18} />
                                    : <ShieldCheck size={18} />}
                                {isSubmitting
                                    ? (language === 'en' ? 'Verifying and activating...' : 'جارٍ التحقق والتفعيل...')
                                    : (language === 'en' ? 'Verify and activate my account' : 'تحقق وفعّل حسابي')}
                            </button>
                        </form>
                    )}
                </section>

                <p className="individual-activation-footer">
                    <ShieldCheck size={15} aria-hidden="true" />
                    {language === 'en' ? 'The administrator code is never shown in the browser and is required only once per account.' : 'كود المالك لا يظهر في المتصفح، ويُطلب مرة واحدة لكل حساب.'}
                </p>
            </div>
        </main>
    );
}
