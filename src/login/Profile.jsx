import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    ArrowLeft,
    BookOpen,
    Camera,
    GraduationCap,
    LoaderCircle,
    LogOut,
    Mail,
    ShieldCheck,
    UserRound,
} from 'lucide-react';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import './Profile.css';
import { useLanguage } from '../i18n/language';

function getDisplayName(user, profile, language) {
    return profile?.full_name?.trim()
        || user?.user_metadata?.full_name?.trim()
        || user?.email?.split('@')[0]
        || (language === 'en' ? 'Techsphere user' : 'مستخدم Techsphere');
}

export default function Profile() {
    const history = useHistory();
    const { language } = useLanguage();
    const configured = isSupabaseConfigured();
    const [user, setUser] = useState(null);
    const [isAdminAccount, setIsAdminAccount] = useState(null);
    const [adminCheckError, setAdminCheckError] = useState('');
    const [profile, setProfile] = useState(null);
    const [siteRequests, setSiteRequests] = useState([]);
    const [requestsError, setRequestsError] = useState('');
    const [areRequestsLoading, setAreRequestsLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(configured);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [errorMessage, setErrorMessage] = useState(
        configured
            ? ''
            : language === 'en'
                ? 'Supabase is not fully configured. Check the site settings and restart it.'
                : 'إعداد Supabase غير مكتمل. راجع إعدادات الموقع ثم أعد تشغيله.'
    );
    const [profileNotice, setProfileNotice] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isSavingName, setIsSavingName] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const avatarInputRef = useRef(null);

    useEffect(() => {
        if (!configured) {
            return undefined;
        }

        const supabase = getSupabaseClient();
        let isActive = true;
        const loadSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (!isActive) return;
            if (error) {
                setErrorMessage(error.message);
                setIsLoading(false);
                return;
            }

            if (!data.session?.user) {
                history.replace('/login');
                return;
            }

            setUser(data.session.user);
            const [initialFirstName = '', ...initialLastName] = (
                data.session.user.user_metadata?.full_name || ''
            ).trim().split(/\s+/);
            setFirstName(initialFirstName);
            setLastName(initialLastName.join(' '));
            setIsLoading(false);
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (!isActive) return;
                if (!session?.user) {
                    setUser(null);
                    history.replace('/login');
                    return;
                }
                setUser(session.user);
            }
        );

        loadSession();
        return () => {
            isActive = false;
            subscription.unsubscribe();
        };
    }, [configured, history]);

    useEffect(() => {
        if (!user) return undefined;

        let isActive = true;
        const loadProfile = async () => {
            const { data, error } = await getSupabaseClient()
                .from('profiles')
                .select('full_name, email, created_at, student_id, individual_training_activated_at')
                .eq('id', user.id)
                .maybeSingle();

            if (!isActive) return;
            if (error) {
                setProfileNotice(
                    'تعذر تحميل بيانات الملف من جدول profiles. تأكد من تنفيذ إعداد SQL الموجود في تعليمات تسجيل الدخول.'
                );
                return;
            }
            setProfile(data);
            const [profileFirstName = '', ...profileLastName] = (
                data?.full_name || user.user_metadata?.full_name || ''
            ).trim().split(/\s+/);
            setFirstName(profileFirstName);
            setLastName(profileLastName.join(' '));
        };

        loadProfile();
        return () => {
            isActive = false;
        };
    }, [user]);

    useEffect(() => {
        if (!user) {
            setIsAdminAccount(null);
            return undefined;
        }

        let isActive = true;
        setIsAdminAccount(null);
        setAdminCheckError('');
        setSiteRequests([]);
        setRequestsError('');

        const checkAdminStatus = async () => {
            try {
                const { data, error } = await getSupabaseClient().functions.invoke(
                    'admin-requests',
                    { body: { action: 'check_admin' } }
                );

                if (!isActive) return;
                if (error || typeof data?.isAdmin !== 'boolean') {
                    setAdminCheckError(language === 'en'
                        ? 'Could not verify account permissions. Request history is temporarily unavailable.'
                        : 'تعذر التحقق من صلاحيات الحساب. سجل الطلبات غير متاح مؤقتًا.');
                    return;
                }

                setIsAdminAccount(data.isAdmin);
            } catch {
                if (!isActive) return;
                setAdminCheckError(language === 'en'
                    ? 'Could not verify account permissions. Request history is temporarily unavailable.'
                    : 'تعذر التحقق من صلاحيات الحساب. سجل الطلبات غير متاح مؤقتًا.');
            }
        };

        checkAdminStatus();
        return () => {
            isActive = false;
        };
    }, [user, language]);

    useEffect(() => {
        if (!user || isAdminAccount !== false) return undefined;

        let isActive = true;
        const loadRequests = async () => {
            setAreRequestsLoading(true);
            const { data, error } = await getSupabaseClient()
                .from('site_requests')
                .select('id, request_type, status, course_name, job_title, created_at, updated_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (!isActive) return;
            if (error) {
                setRequestsError(language === 'en'
                    ? 'Could not load your request history. Apply the request tracking database setup.'
                    : 'تعذر تحميل سجل طلباتك. تأكد من إعداد قاعدة بيانات متابعة الطلبات.');
            } else {
                setSiteRequests(data || []);
            }
            setAreRequestsLoading(false);
        };

        loadRequests();
        return () => {
            isActive = false;
        };
    }, [user, language, isAdminAccount]);

    const handleSignOut = async () => {
        setErrorMessage('');
        setIsSigningOut(true);
        const { error } = await getSupabaseClient().auth.signOut();
        if (error) {
            setErrorMessage(error.message);
            setIsSigningOut(false);
        } else {
            history.replace('/');
        }
    };

    const handleSaveName = async (event) => {
        event.preventDefault();
        const normalizedFirstName = firstName.trim();
        const normalizedLastName = lastName.trim();

        if (!normalizedFirstName || !normalizedLastName) {
            setErrorMessage(language === 'en'
                ? 'Enter both your first and last name.'
                : 'اكتب الاسم الأول واسم العائلة.');
            return;
        }

        if (normalizedFirstName.length > 80 || normalizedLastName.length > 80) {
            setErrorMessage(language === 'en'
                ? 'Each name must be 80 characters or fewer.'
                : 'يجب ألا يزيد كل اسم عن 80 حرفًا.');
            return;
        }

        setErrorMessage('');
        setSuccessMessage('');
        setIsSavingName(true);

        try {
            const fullName = `${normalizedFirstName} ${normalizedLastName}`;
            const { data, error } = await getSupabaseClient().auth.updateUser({
                data: { full_name: fullName },
            });
            if (error) throw error;

            setUser(data.user);
            setProfile((currentProfile) => currentProfile
                ? { ...currentProfile, full_name: fullName }
                : currentProfile);
            setSuccessMessage(language === 'en'
                ? 'Your name has been updated.'
                : 'تم تحديث الاسم بنجاح.');
        } catch (error) {
            setErrorMessage(error?.message || (language === 'en'
                ? 'Could not update your name. Please try again.'
                : 'تعذر تحديث الاسم. حاول مرة أخرى.'));
        } finally {
            setIsSavingName(false);
        }
    };

    const handleAvatarChange = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file || !user) return;

        const extensionsByType = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/webp': 'webp',
        };
        const extension = extensionsByType[file.type];

        setErrorMessage('');
        setSuccessMessage('');
        setProfileNotice('');

        if (!extension) {
            setErrorMessage(language === 'en'
                ? 'Choose an image in JPG, PNG, or WebP format.'
                : 'اختار صورة بصيغة JPG أو PNG أو WebP.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrorMessage(language === 'en'
                ? 'The image must be 5 MB or smaller.'
                : 'حجم الصورة لازم يكون 5 ميجابايت أو أقل.');
            return;
        }

        setIsUploadingAvatar(true);
        const supabase = getSupabaseClient();
        const storage = supabase.storage.from('avatars');
        const previousAvatarPath = user.user_metadata?.avatar_path;
        const uploadedPath = `${user.id}/avatar-${Date.now()}.${extension}`;

        try {
            const { error: uploadError } = await storage.upload(uploadedPath, file, {
                cacheControl: '3600',
                contentType: file.type,
                upsert: false,
            });
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = storage.getPublicUrl(uploadedPath);
            const { data, error: updateError } = await supabase.auth.updateUser({
                data: {
                    avatar_url: `${publicUrl}?v=${Date.now()}`,
                    avatar_path: uploadedPath,
                },
            });

            if (updateError) {
                const { error: cleanupError } = await storage.remove([uploadedPath]);
                if (cleanupError) {
                    throw new Error(
                        `${updateError.message} تعذر حذف الصورة المرفوعة غير المرتبطة بالحساب: ${cleanupError.message}`
                    );
                }
                throw updateError;
            }

            setUser(data.user);
            setSuccessMessage(language === 'en'
                ? 'Your profile picture has been updated.'
                : 'تم تحديث صورة الحساب بنجاح.');

            if (
                previousAvatarPath
                && previousAvatarPath !== uploadedPath
                && previousAvatarPath.startsWith(`${user.id}/`)
            ) {
                const { error: deleteError } = await storage.remove([previousAvatarPath]);
                if (deleteError) {
                    setProfileNotice(
                        language === 'en'
                            ? `Your picture was updated, but the old picture could not be removed from storage: ${deleteError.message}`
                            : `تم تحديث الصورة، لكن تعذر حذف الصورة القديمة من التخزين: ${deleteError.message}`
                    );
                }
            }
        } catch (error) {
            setErrorMessage(
                error?.message?.toLowerCase().includes('bucket not found')
                    ? (language === 'en'
                        ? 'The avatars storage bucket is not configured. Run the storage setup code in the account instructions.'
                        : 'مساحة تخزين الصور avatars غير مُعدة. نفّذ كود إعداد التخزين الموجود في تعليمات الحساب.')
                    : error?.message || (language === 'en'
                        ? 'Could not upload the image. Please try again.'
                        : 'تعذر رفع الصورة. حاول مرة أخرى.')
            );
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    if (isLoading) {
        return (
            <main className="profile-page" dir={language === 'en' ? 'ltr' : 'rtl'}>
                <section className="profile-card profile-loading" role="status">
                    {language === 'en' ? 'Loading your account...' : 'جارٍ تحميل بيانات حسابك...'}
                </section>
            </main>
        );
    }

    const displayName = getDisplayName(user, profile, language);
    const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
    const initial = [...displayName][0]?.toLocaleUpperCase(language === 'en' ? 'en' : 'ar') || (language === 'en' ? 'T' : 'ح');
    const email = profile?.email || user?.email || (language === 'en' ? 'Not available' : 'غير متاح');
    const createdAt = profile?.created_at || user?.created_at;
    const formattedCreatedAt = createdAt
        ? new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'ar-EG', { dateStyle: 'long' }).format(new Date(createdAt))
        : '—';
    const requestStatusLabels = {
        new: language === 'en' ? 'New' : 'جديد',
        reviewing: language === 'en' ? 'Under review' : 'قيد المراجعة',
        contacted: language === 'en' ? 'Contacted' : 'تم التواصل',
        accepted: language === 'en' ? 'Accepted' : 'مقبول',
        rejected: language === 'en' ? 'Rejected' : 'مرفوض',
        completed: language === 'en' ? 'Completed' : 'مكتمل',
    };

    return (
        <main className="profile-page" dir={language === 'en' ? 'ltr' : 'rtl'}>
            <div className="profile-glow" aria-hidden="true" />
            <div className="profile-content">
                <header className="profile-welcome">
                    <span className="profile-eyebrow">
                        <GraduationCap size={17} aria-hidden="true" />
                        {language === 'en' ? 'Your learning account' : 'حسابك التعليمي'}
                    </span>
                    <h1>{language === 'en' ? `Welcome, ${displayName}` : <>أهلًا يا <bdi>{displayName}</bdi></>}</h1>
                    <p>{language === 'en'
                        ? 'View your account details and quickly access Techsphere learning sections from here.'
                        : <>من هنا تقدر تتابع بيانات حسابك وتوصل بسرعة لأقسام <bdi dir="ltr">Techsphere</bdi> التعليمية.</>}</p>
                </header>

                {errorMessage && (
                    <div className="profile-alert" role="alert">
                        {language === 'en'
                            && errorMessage === 'إعداد Supabase غير مكتمل. راجع إعدادات الموقع ثم أعد تشغيله.'
                            ? 'Supabase is not fully configured. Check the site settings and restart it.'
                            : errorMessage}
                    </div>
                )}
                {profileNotice && (
                    <div className="profile-alert profile-alert-info" role="status">
                        {language === 'en'
                            && profileNotice === 'تعذر تحميل بيانات الملف من جدول profiles. تأكد من تنفيذ إعداد SQL الموجود في تعليمات تسجيل الدخول.'
                            ? 'Could not load profile data from the profiles table. Make sure you have applied the SQL setup in the sign-in instructions.'
                            : profileNotice}
                    </div>
                )}
                {adminCheckError && (
                    <div className="profile-alert profile-alert-info" role="alert">
                        {adminCheckError}
                    </div>
                )}
                {successMessage && (
                    <div className="profile-alert profile-alert-success" role="status">
                        {successMessage}
                    </div>
                )}

                <section className="profile-card profile-identity" aria-label={language === 'en' ? 'User profile' : 'ملف المستخدم'}>
                    <div className="profile-avatar-column">
                        <div className="profile-avatar" aria-hidden="true">
                            {initial}
                            {avatarUrl && (
                                <img
                                    src={avatarUrl}
                                    alt=""
                                    onError={(imageEvent) => {
                                        imageEvent.currentTarget.style.display = 'none';
                                    }}
                                />
                            )}
                        </div>
                        <button
                            className="profile-avatar-upload"
                            type="button"
                            onClick={() => avatarInputRef.current?.click()}
                            disabled={isUploadingAvatar}
                            aria-describedby="profile-avatar-hint"
                        >
                            {isUploadingAvatar ? (
                                <LoaderCircle className="profile-upload-spinner" size={16} aria-hidden="true" />
                            ) : (
                                <Camera size={16} aria-hidden="true" />
                            )}
                            {isUploadingAvatar
                                ? (language === 'en' ? 'Uploading...' : 'جارٍ الرفع...')
                                : (language === 'en' ? 'Change picture' : 'تغيير الصورة')}
                        </button>
                        <input
                            ref={avatarInputRef}
                            className="profile-avatar-input"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleAvatarChange}
                            aria-label={language === 'en' ? 'Choose a profile picture' : 'اختيار صورة للحساب'}
                        />
                        <span id="profile-avatar-hint" className="profile-avatar-hint">
                            {language === 'en' ? 'JPG, PNG, or WebP, up to 5 MB' : 'JPG أو PNG أو WebP، حتى 5 ميجابايت'}
                        </span>
                    </div>
                    <div className="profile-identity-copy">
                        <span className="profile-caption">{language === 'en' ? 'Your profile' : 'ملفك الشخصي'}</span>
                        <h2>{displayName}</h2>
                        <p>{email}</p>
                    </div>
                    <span className="profile-status">
                        <ShieldCheck size={16} aria-hidden="true" />
                        {language === 'en' ? 'Registered account' : 'حساب مسجل'}
                    </span>
                </section>

                <form className="profile-card profile-name-form" onSubmit={handleSaveName}>
                    <div className="profile-name-form-heading">
                        <span className="profile-caption">{language === 'en' ? 'Edit your name' : 'تعديل الاسم'}</span>
                        <p>{language === 'en'
                            ? 'Your first and last name will appear beside your profile picture.'
                            : 'سيظهر الاسم الأول واسم العائلة بجانب صورة حسابك.'}</p>
                    </div>
                    <div className="profile-name-fields">
                        <div className="profile-name-field">
                            <label htmlFor="profile-first-name">{language === 'en' ? 'First name' : 'الاسم الأول'}</label>
                            <input
                                id="profile-first-name"
                                name="first_name"
                                autoComplete="given-name"
                                maxLength={80}
                                value={firstName}
                                onChange={(event) => setFirstName(event.target.value)}
                                required
                            />
                        </div>
                        <div className="profile-name-field">
                            <label htmlFor="profile-last-name">{language === 'en' ? 'Last name' : 'اسم العائلة'}</label>
                            <input
                                id="profile-last-name"
                                name="last_name"
                                autoComplete="family-name"
                                maxLength={80}
                                value={lastName}
                                onChange={(event) => setLastName(event.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button className="profile-primary-action profile-save-name" type="submit" disabled={isSavingName}>
                        {isSavingName
                            ? (language === 'en' ? 'Saving...' : 'جارٍ الحفظ...')
                            : (language === 'en' ? 'Save name' : 'حفظ الاسم')}
                    </button>
                </form>

                <section className="profile-details-grid" aria-label={language === 'en' ? 'Account details' : 'بيانات الحساب'}>
                    <article className="profile-card profile-detail">
                        <span className="profile-detail-icon"><UserRound size={20} /></span>
                        <div>
                            <span className="profile-caption">{language === 'en' ? 'Name' : 'الاسم'}</span>
                            <strong>{displayName}</strong>
                        </div>
                    </article>
                    <article className="profile-card profile-detail">
                        <span className="profile-detail-icon"><Mail size={20} /></span>
                        <div>
                            <span className="profile-caption">{language === 'en' ? 'Email address' : 'البريد الإلكتروني'}</span>
                            <strong dir="ltr">{email}</strong>
                        </div>
                    </article>
                    <article className="profile-card profile-detail">
                        <span className="profile-detail-icon"><ShieldCheck size={20} /></span>
                        <div>
                            <span className="profile-caption">{language === 'en' ? 'Account created' : 'تاريخ إنشاء الحساب'}</span>
                            <strong>{formattedCreatedAt}</strong>
                        </div>
                    </article>
                    <article className="profile-card profile-detail">
                        <span className="profile-detail-icon"><GraduationCap size={20} /></span>
                        <div>
                            <span className="profile-caption">{language === 'en' ? 'Individual training student ID' : 'رقم طالب تدريب الأفراد'}</span>
                            <strong dir="ltr">
                                {profile?.individual_training_activated_at
                                    ? profile.student_id
                                    : (language === 'en' ? 'Not activated yet' : 'لم يتم التفعيل بعد')}
                            </strong>
                        </div>
                    </article>
                </section>

                {isAdminAccount === false && (
                <section className="profile-card profile-request-history" aria-labelledby="profile-requests-title">
                    <div className="profile-request-history-heading">
                        <div>
                            <span className="profile-caption">{language === 'en' ? 'Your applications' : 'طلباتك'}</span>
                            <h2 id="profile-requests-title">{language === 'en' ? 'Request status' : 'حالة الطلبات'}</h2>
                        </div>
                        <button
                            className="profile-secondary-action"
                            type="button"
                            onClick={() => history.push('/Courses')}
                        >
                            {language === 'en' ? 'Browse courses' : 'تصفح الكورسات'}
                        </button>
                    </div>
                    {requestsError && <p className="profile-alert profile-alert-info" role="alert">{requestsError}</p>}
                    {areRequestsLoading ? (
                        <p className="profile-request-empty" role="status">
                            {language === 'en' ? 'Loading your requests...' : 'جارٍ تحميل طلباتك...'}
                        </p>
                    ) : siteRequests.length === 0 ? (
                        <p className="profile-request-empty">
                            {language === 'en'
                                ? 'You have not submitted any course or career-path requests yet.'
                                : 'لم ترسل طلب اشتراك أو تقديم مهني حتى الآن.'}
                        </p>
                    ) : (
                        <div className="profile-request-list">
                            {siteRequests.map((request) => (
                                <article className="profile-request-item" key={request.id}>
                                    <div>
                                        <span className="profile-caption">
                                            {request.request_type === 'course_enrollment'
                                                ? (language === 'en' ? 'Course enrollment' : 'طلب اشتراك كورس')
                                                : (language === 'en' ? 'Career-path application' : 'طلب تقديم لمسار مهني')}
                                        </span>
                                        <strong>{request.course_name || request.job_title}</strong>
                                        <time dateTime={request.created_at}>
                                            {new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'ar-EG', { dateStyle: 'medium' }).format(new Date(request.created_at))}
                                        </time>
                                    </div>
                                    <span className={`profile-request-status is-${request.status}`}>
                                        {requestStatusLabels[request.status] || request.status}
                                    </span>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
                )}

                <section className="profile-card profile-learning">
                    <div>
                        <span className="profile-caption">{language === 'en' ? 'Continue your journey' : 'واصل رحلتك'}</span>
                        <h2>{language === 'en' ? 'Choose your next learning step' : 'اختار خطوتك التعليمية التالية'}</h2>
                        <p>{language === 'en' ? 'Explore courses or return to your learning journey on the platform.' : 'استكشف الدورات أو ارجع إلى رحلتك التعليمية على المنصة.'}</p>
                    </div>
                    <div className="profile-actions">
                        <button
                            className="profile-primary-action"
                            type="button"
                            onClick={() => history.push('/Courses')}
                        >
                            <BookOpen size={18} aria-hidden="true" />
                            {language === 'en' ? 'Browse courses' : 'تصفح الدورات'}
                            <ArrowLeft size={17} aria-hidden="true" />
                        </button>
                        <button
                            className="profile-secondary-action"
                            type="button"
                            onClick={() => history.push('/learn')}
                        >
                            <GraduationCap size={18} aria-hidden="true" />
                            {language === 'en' ? 'Learning journey' : 'الرحلة التعليمية'}
                        </button>
                        <button
                            className="profile-secondary-action"
                            type="button"
                            onClick={() => history.push('/traning/induvial')}
                        >
                            <ShieldCheck size={18} aria-hidden="true" />
                            {profile?.individual_training_activated_at
                                ? (language === 'en' ? 'Individual training status' : 'حالة تدريب الأفراد')
                                : (language === 'en' ? 'Activate individual training' : 'تفعيل تدريب الأفراد')}
                        </button>
                        <button
                            className="profile-secondary-action profile-signout"
                            type="button"
                            onClick={handleSignOut}
                            disabled={isSigningOut}
                        >
                            <LogOut size={18} aria-hidden="true" />
                            {isSigningOut
                                ? (language === 'en' ? 'Signing out...' : 'جارٍ تسجيل الخروج...')
                                : (language === 'en' ? 'Sign out' : 'تسجيل الخروج')}
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}
