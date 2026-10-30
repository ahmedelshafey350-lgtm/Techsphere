import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    ArrowLeft,
    Eye,
    EyeOff,
    KeyRound,
    LoaderCircle,
    LockKeyhole,
    Mail,
    ShieldCheck,
    Sparkles,
    UserRound,
} from 'lucide-react';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import './Login.css';
import { useLanguage } from '../i18n/language';

const supabaseErrorMessages = {
    invalid_credentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    email_not_confirmed: 'أكد بريدك الإلكتروني من الرسالة التي أرسلناها إليك أولًا.',
    user_already_exists: 'هذا البريد مسجل بالفعل. سجّل الدخول بدلًا من إنشاء حساب جديد.',
    weak_password: 'كلمة المرور ضعيفة. استخدم 6 أحرف على الأقل.',
    signup_disabled: 'إنشاء الحسابات متوقف حاليًا. تواصل مع إدارة الموقع.',
    over_email_send_rate_limit: 'تم إرسال رسائل كثيرة. انتظر قليلًا ثم حاول مرة أخرى.',
    email_address_invalid: 'صيغة البريد الإلكتروني غير صحيحة.',
};

const supabaseErrorMessagesEn = {
    invalid_credentials: 'The email address or password is incorrect.',
    email_not_confirmed: 'Please confirm your email address using the message we sent you.',
    user_already_exists: 'An account already exists for this email. Sign in instead.',
    weak_password: 'The password is too weak. Use at least 6 characters.',
    signup_disabled: 'Account registration is currently unavailable. Please contact the site administrator.',
    over_email_send_rate_limit: 'Too many emails have been sent. Wait a little and try again.',
    email_address_invalid: 'The email address format is invalid.',
};

function getErrorMessage(error, language) {
    if (error?.code && supabaseErrorMessages[error.code]) {
        return language === 'en'
            ? supabaseErrorMessagesEn[error.code]
            : supabaseErrorMessages[error.code];
    }

    if (error?.message?.toLowerCase().includes('fetch')) {
        return language === 'en'
            ? 'Could not connect to Supabase. Check the project URL and your internet connection.'
            : 'تعذر الاتصال بـSupabase. تحقق من رابط المشروع والإنترنت.';
    }

    return error?.message || (language === 'en'
        ? 'An unexpected error occurred. Please try again.'
        : 'حدث خطأ غير متوقع. حاول مرة أخرى.');
}

function localizeLoginMessage(message, language) {
    if (language !== 'en' || !message) return message;
    const mappedError = Object.keys(supabaseErrorMessages).find(
        (code) => supabaseErrorMessages[code] === message
    );
    if (mappedError) return supabaseErrorMessagesEn[mappedError];
    const translations = {
        'تعذر الاتصال بـSupabase. تحقق من رابط المشروع والإنترنت.': 'Could not connect to Supabase. Check the project URL and your internet connection.',
        'حدث خطأ غير متوقع. حاول مرة أخرى.': 'An unexpected error occurred. Please try again.',
        'أرسلنا رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.': 'A password-reset link has been sent to your email address.',
        'تم إنشاء الحساب. راجع بريدك الإلكتروني لتأكيده، ثم سجّل الدخول.': 'Your account has been created. Check your email to confirm it, then sign in.',
    };
    return translations[message] || message;
}

export default function Login() {
    const history = useHistory();
    const { language } = useLanguage();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isResetMode, setIsResetMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const supabaseConfigured = isSupabaseConfigured();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setIsSubmitting(true);

        try {
            const supabase = getSupabaseClient();
            const normalizedEmail = email.trim();

            if (isResetMode) {
                const { error } = await supabase.auth.resetPasswordForEmail(
                    normalizedEmail,
                    { redirectTo: `${window.location.origin}/login` }
                );
                if (error) throw error;

                setSuccessMessage(language === 'en'
                    ? 'A password-reset link has been sent to your email address.'
                    : 'أرسلنا رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.');
            } else if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email: normalizedEmail,
                    password,
                    options: {
                        data: { full_name: fullName.trim() },
                    },
                });
                if (error) throw error;

                if (data.session) {
                    history.replace(history.location.state?.from || '/');
                } else {
                    setSuccessMessage(
                        language === 'en'
                            ? 'Your account has been created. Check your email to confirm it, then sign in.'
                            : 'تم إنشاء الحساب. راجع بريدك الإلكتروني لتأكيده، ثم سجّل الدخول.'
                    );
                    setIsSignUp(false);
                    setPassword('');
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email: normalizedEmail,
                    password,
                });
                if (error) throw error;

                history.replace(history.location.state?.from || '/');
            }
        } catch (error) {
            setErrorMessage(getErrorMessage(error, language));
        } finally {
            setIsSubmitting(false);
        }
    };

    const clearMessages = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };

    const handleResetMode = () => {
        clearMessages();
        setIsResetMode((currentMode) => !currentMode);
    };

    const handleSignUpMode = () => {
        clearMessages();
        setIsSignUp((currentMode) => !currentMode);
    };

    return (
        <main className="login-page" dir={language === 'en' ? 'ltr' : 'rtl'}>
            <div className="login-orb login-orb-one" aria-hidden="true" />
            <div className="login-orb login-orb-two" aria-hidden="true" />

            <section className="login-card" aria-labelledby="login-title">
                <div className="login-brand">
                    <span className="login-brand-icon">
                        <Sparkles size={24} aria-hidden="true" />
                    </span>
                    <span>Techsphere</span>
                </div>

                <div className="login-heading">
                    <span className="login-heading-icon">
                        <ShieldCheck size={26} aria-hidden="true" />
                    </span>
                    <h1 id="login-title">
                        {isResetMode
                            ? (language === 'en' ? 'Reset your password' : 'استعادة كلمة المرور')
                            : isSignUp
                                ? (language === 'en' ? 'Create a new account' : 'إنشاء حساب جديد')
                                : (language === 'en' ? 'Welcome back' : 'أهلًا بعودتك')}
                    </h1>
                    <p>
                        {isResetMode
                            ? (language === 'en' ? 'Enter your email address and we will send you a secure password-reset link.' : 'اكتب بريدك الإلكتروني وسنرسل لك رابطًا آمنًا لإعادة تعيين كلمة المرور.')
                            : isSignUp
                                ? (language === 'en' ? 'Create an account to save your details and return to them at any time.' : 'أنشئ حسابك واحفظ بياناتك للعودة إليها في أي وقت.')
                                : (language === 'en' ? 'Sign in to continue your learning journey.' : 'سجّل دخولك لمتابعة رحلتك التعليمية.')}
                    </p>
                </div>

                {!supabaseConfigured && (
                    <div className="login-message login-message-warning" role="alert">
                        {language === 'en'
                            ? 'Sign-in is not configured yet. Add your Supabase project URL and key to the environment file to enable the service.'
                            : <>تسجيل الدخول غير مهيأ بعد. أضف رابط مشروع Supabase ومفتاحه إلى ملف البيئة لتفعيل الخدمة.</>}
                    </div>
                )}

                {errorMessage && (
                    <div className="login-message login-message-error" role="alert">
                        {localizeLoginMessage(errorMessage, language)}
                    </div>
                )}

                {successMessage && (
                    <div className="login-message login-message-success" role="status">
                        {localizeLoginMessage(successMessage, language)}
                    </div>
                )}

                <form className="login-form" onSubmit={handleSubmit}>
                    {isSignUp && !isResetMode && (
                        <div className="login-field">
                            <label htmlFor="login-full-name">{language === 'en' ? 'Name' : 'الاسم'}</label>
                            <div className="login-input-wrap">
                                <UserRound size={19} aria-hidden="true" />
                                <input
                                    id="login-full-name"
                                    name="fullName"
                                    type="text"
                                    autoComplete="name"
                                    placeholder={language === 'en' ? 'Enter your name' : 'اكتب اسمك'}
                                    value={fullName}
                                    onChange={(event) => setFullName(event.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="login-field">
                        <label htmlFor="login-email">{language === 'en' ? 'Email address' : 'البريد الإلكتروني'}</label>
                        <div className="login-input-wrap">
                            <Mail size={19} aria-hidden="true" />
                            <input
                                id="login-email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                                dir="ltr"
                            />
                        </div>
                    </div>

                    {!isResetMode && (
                        <div className="login-field">
                            <div className="login-password-label">
                                <label htmlFor="login-password">{language === 'en' ? 'Password' : 'كلمة المرور'}</label>
                                {!isSignUp && (
                                    <button
                                        className="login-text-button"
                                        type="button"
                                        onClick={handleResetMode}
                                    >
                                        {language === 'en' ? 'Forgot password?' : 'نسيت كلمة المرور؟'}
                                    </button>
                                )}
                            </div>
                            <div className="login-input-wrap">
                                <LockKeyhole size={19} aria-hidden="true" />
                                <input
                                    id="login-password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                                    placeholder={language === 'en' ? 'Enter your password' : 'أدخل كلمة المرور'}
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    minLength={isSignUp ? 6 : undefined}
                                    required
                                />
                                <button
                                    className="login-visibility-button"
                                    type="button"
                                    aria-label={showPassword
                                        ? (language === 'en' ? 'Hide password' : 'إخفاء كلمة المرور')
                                        : (language === 'en' ? 'Show password' : 'إظهار كلمة المرور')}
                                    onClick={() => setShowPassword((visible) => !visible)}
                                >
                                    {showPassword
                                        ? <EyeOff size={19} aria-hidden="true" />
                                        : <Eye size={19} aria-hidden="true" />}
                                </button>
                            </div>
                        </div>
                    )}

                    {isResetMode && (
                        <button
                            className="login-text-button login-back-button"
                            type="button"
                            onClick={handleResetMode}
                        >
                            {language === 'en' ? 'Back to sign in' : 'رجوع إلى تسجيل الدخول'}
                        </button>
                    )}

                    <button
                        className="login-submit-button"
                        type="submit"
                        disabled={!supabaseConfigured || isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <LoaderCircle className="login-spinner" size={20} aria-hidden="true" />
                                {language === 'en' ? 'Processing...' : 'جارٍ المعالجة...'}
                            </>
                        ) : (
                            <>
                                <span>
                                    {isResetMode
                                        ? (language === 'en' ? 'Send reset link' : 'إرسال رابط الاستعادة')
                                        : isSignUp
                                            ? (language === 'en' ? 'Create account' : 'إنشاء الحساب')
                                            : (language === 'en' ? 'Sign in' : 'تسجيل الدخول')}
                                </span>
                                {isResetMode
                                    ? <KeyRound size={19} aria-hidden="true" />
                                    : <ArrowLeft size={19} aria-hidden="true" />}
                            </>
                        )}
                    </button>
                </form>

                {!isResetMode && (
                    <div className="login-mode-switch">
                        <span>
                            {isSignUp
                                ? (language === 'en' ? 'Already have an account?' : 'لديك حساب بالفعل؟')
                                : (language === 'en' ? "Don't have an account?" : 'ليس لديك حساب؟')}
                        </span>
                        <button
                            className="login-text-button"
                            type="button"
                            onClick={handleSignUpMode}
                        >
                            {isSignUp
                                ? (language === 'en' ? 'Sign in' : 'سجّل الدخول')
                                : (language === 'en' ? 'Create account' : 'إنشاء حساب')}
                        </button>
                    </div>
                )}

                <p className="login-security-note">
                    <LockKeyhole size={15} aria-hidden="true" />
                    {language === 'en'
                        ? 'Your password is securely managed by Supabase Auth, and your name and email are saved with your account.'
                        : 'كلمة المرور يديرها Supabase Auth بأمان، ويُحفظ الاسم والبريد مع حسابك.'}
                </p>
            </section>
        </main>
    );
}
