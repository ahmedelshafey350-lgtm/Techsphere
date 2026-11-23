import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSupabaseClient } from '../login/supabase';
import { formatCoursePrice } from '../utils/courses';
import { useLanguage } from '../i18n/language';

const emptyCourse = {
    slug: '',
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    category: '',
    technologies: [],
    difficulty: 'beginner',
    duration_months: '',
    original_price: '',
    currency_code: 'EGP',
    thumbnail_url: '',
    cover_url: '',
    is_published: false,
};

const emptyChapter = {
    title_en: '',
    title_ar: '',
    description_en: '',
    description_ar: '',
    learning_objectives: { en: [], ar: [] },
    duration_minutes: '',
    difficulty: 'beginner',
    practical_applications: { en: [], ar: [] },
    real_world_examples: { en: [], ar: [] },
    tools_and_technologies: { en: [], ar: [] },
    exercises: { en: [], ar: [] },
    expected_outcomes: { en: [], ar: [] },
    sort_order: 0,
};

const emptyTopic = {
    title_en: '',
    title_ar: '',
    short_description_en: '',
    short_description_ar: '',
    detailed_content_en: '',
    detailed_content_ar: '',
    step_by_step: { en: [], ar: [] },
    code_examples: [],
    practical_examples: { en: [], ar: [] },
    use_cases: { en: [], ar: [] },
    common_mistakes: { en: [], ar: [] },
    exercises: { en: [], ar: [] },
    sort_order: 0,
};

function linesToList(value) {
    return value.split('\n').map((item) => item.trim()).filter(Boolean);
}

function getErrorMessage(error, fallback) {
    if (error?.context instanceof Response) {
        return error.context.clone().json()
            .then((response) => response?.error || fallback)
            .catch(() => fallback);
    }
    return Promise.resolve(error?.message || fallback);
}

function getActiveDiscount(course) {
    const now = Date.now();
    return (course.discounts || []).find((discount) => (
        discount.is_active
        && new Date(discount.start_date).getTime() <= now
        && (!discount.end_date || new Date(discount.end_date).getTime() > now)
    ));
}

function getDiscountStatus(discount) {
    if (!discount.is_active) return 'disabled';
    const now = Date.now();
    if (new Date(discount.start_date).getTime() > now) return 'scheduled';
    if (discount.end_date && new Date(discount.end_date).getTime() <= now) return 'expired';
    return 'active';
}

function toLocalDateTimeInput(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const pad = (part) => String(part).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
        + `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getCurrentCoursePrice(course, discount) {
    const originalPrice = Number(course.original_price);
    if (discount?.discount_type === 'percentage') {
        return Math.round(originalPrice * (1 - Number(discount.discount_value) / 100) * 100) / 100;
    }
    if (discount?.discount_type === 'fixed_amount') {
        return Math.round(Math.max(0, originalPrice - Number(discount.discount_value)) * 100) / 100;
    }
    if (discount?.discount_type === 'fixed_price') {
        return Math.round(Math.min(originalPrice, Number(discount.discount_value)) * 100) / 100;
    }
    return originalPrice;
}

function AdminCourseManagement() {
    const { language } = useLanguage();
    const isEnglish = language === 'en';
    const [courses, setCourses] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [courseForm, setCourseForm] = useState(emptyCourse);
    const [chapterForm, setChapterForm] = useState(emptyChapter);
    const [topicForm, setTopicForm] = useState(emptyTopic);
    const [discountForm, setDiscountForm] = useState({
        discount_type: 'percentage',
        discount_value: '',
        start_date: '',
        end_date: '',
        is_active: true,
        promotional_label: '',
    });
    const [editingChapterId, setEditingChapterId] = useState('');
    const [editingTopicId, setEditingTopicId] = useState('');
    const [editingDiscountId, setEditingDiscountId] = useState('');
    const [showChapterForm, setShowChapterForm] = useState(false);
    const [showTopicForm, setShowTopicForm] = useState(false);
    const [selectedChapterId, setSelectedChapterId] = useState('');
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const selectedCourse = courses.find((course) => course.id === selectedId) || null;
    const selectedChapter = selectedCourse?.chapters?.find((chapter) => chapter.id === selectedChapterId) || null;
    const filteredCourses = useMemo(() => courses.filter((course) => (
        `${course.title_en} ${course.title_ar} ${course.slug}`.toLocaleLowerCase(language)
            .includes(search.trim().toLocaleLowerCase(language))
    )), [courses, language, search]);
    const publishedCount = courses.filter((course) => course.is_published).length;
    const activeDiscountCount = courses.reduce((total, course) => (
        total + (getActiveDiscount(course) ? 1 : 0)
    ), 0);
    const draftDiscountPreview = useMemo(() => {
        if (!selectedCourse || discountForm.discount_value === '') return null;
        const discount = {
            discount_type: discountForm.discount_type,
            discount_value: Number(discountForm.discount_value),
        };
        if (!Number.isFinite(discount.discount_value) || discount.discount_value < 0) return null;
        const originalPrice = Number(selectedCourse.original_price);
        const currentPrice = getCurrentCoursePrice(selectedCourse, discount);
        return {
            originalPrice,
            currentPrice,
            savings: Math.max(0, Math.round((originalPrice - currentPrice) * 100) / 100),
        };
    }, [discountForm.discount_type, discountForm.discount_value, selectedCourse]);

    const callAdmin = useCallback(async (action, payload = {}) => {
        const { data, error } = await getSupabaseClient().functions.invoke(
            'admin-requests',
            { body: { action, ...payload } },
        );
        if (error) {
            const message = await getErrorMessage(
                error,
                isEnglish ? 'The admin request failed.' : 'تعذر تنفيذ طلب الإدارة.',
            );
            throw new Error(message);
        }
        if (data?.error) throw new Error(data.error);
        return data;
    }, [isEnglish]);

    const reloadCourses = useCallback(async (preserveSelection = true) => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const data = await callAdmin('course_list');
            const loadedCourses = data.courses || [];
            setCourses(loadedCourses);
            if (!preserveSelection) setSelectedId('');
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [callAdmin]);

    useEffect(() => {
        reloadCourses(false);
    }, [reloadCourses]);

    const beginCreateCourse = () => {
        setSelectedId('');
        setCourseForm(emptyCourse);
        setChapterForm(emptyChapter);
        setTopicForm(emptyTopic);
        setSelectedChapterId('');
        setEditingChapterId('');
        setEditingTopicId('');
        setEditingDiscountId('');
        setShowChapterForm(false);
        setShowTopicForm(false);
        setSuccessMessage('');
    };

    const editCourse = (course) => {
        setSelectedId(course.id);
        setCourseForm({
            ...course,
            technologies: (course.technologies || []).join('\n'),
            duration_months: course.duration_months ?? '',
            original_price: course.original_price,
        });
        setEditingChapterId('');
        setEditingTopicId('');
        setEditingDiscountId('');
        setSelectedChapterId('');
        setShowChapterForm(false);
        setShowTopicForm(false);
        setSuccessMessage('');
        setErrorMessage('');
    };

    const saveCourse = async (event) => {
        event.preventDefault();
        setIsSaving(true);
        setErrorMessage('');
        setSuccessMessage('');
        try {
            const payload = {
                ...courseForm,
                id: selectedCourse?.id,
                legacy_id: selectedCourse?.legacy_id ?? null,
                technologies: typeof courseForm.technologies === 'string'
                    ? linesToList(courseForm.technologies)
                    : courseForm.technologies,
                duration_months: courseForm.duration_months === ''
                    ? null : Number(courseForm.duration_months),
                original_price: Number(courseForm.original_price),
            };
            const data = await callAdmin('course_save', { course: payload });
            await reloadCourses();
            setSelectedId(data.course.id);
            setCourseForm({
                ...data.course,
                duration_months: data.course.duration_months ?? '',
            });
            setSuccessMessage(isEnglish ? 'Course saved.' : 'تم حفظ الكورس.');
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const deleteCourse = async (course) => {
        const confirmed = window.confirm(isEnglish
            ? `Delete "${course.title_en}" and its chapters, topics, and discounts? Existing enrollment records are preserved and may prevent deletion.`
            : `هل تريد حذف "${course.title_ar}" وفصوله وموضوعاته وخصوماته؟ ستُحفظ طلبات الاشتراك الحالية وقد تمنع الحذف.`);
        if (!confirmed) return;
        setIsSaving(true);
        setErrorMessage('');
        try {
            await callAdmin('course_delete', { id: course.id });
            beginCreateCourse();
            await reloadCourses(false);
            setSuccessMessage(isEnglish ? 'Course deleted.' : 'تم حذف الكورس.');
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const saveChapter = async (event) => {
        event.preventDefault();
        if (!selectedCourse) return;
        setIsSaving(true);
        setErrorMessage('');
        try {
            const chapter = {
                ...chapterForm,
                id: editingChapterId || undefined,
                course_id: selectedCourse.id,
                duration_minutes: chapterForm.duration_minutes === ''
                    ? null : Number(chapterForm.duration_minutes),
            };
            for (const field of [
                'learning_objectives', 'practical_applications', 'real_world_examples',
                'tools_and_technologies', 'exercises', 'expected_outcomes',
            ]) {
                if (typeof chapter[field] === 'string') {
                    chapter[field] = { en: linesToList(chapter[field]), ar: [] };
                }
            }
            const data = await callAdmin('chapter_save', { chapter });
            await reloadCourses();
            setSelectedChapterId(data.chapter.id);
            setChapterForm(emptyChapter);
            setEditingChapterId('');
            setShowChapterForm(false);
            setSuccessMessage(isEnglish ? 'Chapter saved.' : 'تم حفظ الفصل.');
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const editChapter = (chapter) => {
        setEditingChapterId(chapter.id);
        setShowChapterForm(true);
        setSelectedChapterId(chapter.id);
        setChapterForm({
            ...chapter,
            duration_minutes: chapter.duration_minutes ?? '',
        });
        setEditingTopicId('');
        setTopicForm(emptyTopic);
    };

    const deleteChapter = async (chapter) => {
        if (!window.confirm(isEnglish
            ? 'Delete this chapter and all its topics?'
            : 'هل تريد حذف هذا الفصل وكل موضوعاته؟')) return;
        setIsSaving(true);
        setErrorMessage('');
        try {
            await callAdmin('chapter_delete', { id: chapter.id });
            if (selectedChapterId === chapter.id) setSelectedChapterId('');
            if (editingChapterId === chapter.id) setShowChapterForm(false);
            await reloadCourses();
            setSuccessMessage(isEnglish ? 'Chapter deleted.' : 'تم حذف الفصل.');
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const saveTopic = async (event) => {
        event.preventDefault();
        if (!selectedChapter) return;
        setIsSaving(true);
        setErrorMessage('');
        try {
            const topic = {
                ...topicForm,
                id: editingTopicId || undefined,
                chapter_id: selectedChapter.id,
            };
            for (const field of [
                'step_by_step', 'practical_examples', 'use_cases',
                'common_mistakes', 'exercises',
            ]) {
                if (typeof topic[field] === 'string') {
                    topic[field] = { en: linesToList(topic[field]), ar: [] };
                }
            }
            if (typeof topic.code_examples === 'string') {
                topic.code_examples = topic.code_examples.trim()
                    ? JSON.parse(topic.code_examples)
                    : [];
            }
            const data = await callAdmin('topic_save', { topic });
            await reloadCourses();
            setSelectedChapterId(selectedChapter.id);
            setTopicForm(emptyTopic);
            setEditingTopicId('');
            setShowTopicForm(false);
            setSuccessMessage(isEnglish ? 'Lesson saved.' : 'تم حفظ الدرس.');
            return data;
        } catch (error) {
            setErrorMessage(error instanceof SyntaxError
                ? (isEnglish ? 'Code examples must be valid JSON.' : 'يجب أن تكون أمثلة الكود بصيغة JSON صحيحة.')
                : error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const editTopic = (topic) => {
        setEditingTopicId(topic.id);
        setShowTopicForm(true);
        setTopicForm({
            ...topic,
            code_examples: JSON.stringify(topic.code_examples || [], null, 2),
        });
    };

    const deleteTopic = async (topic) => {
        if (!window.confirm(isEnglish ? 'Delete this lesson?' : 'هل تريد حذف هذا الدرس؟')) return;
        setIsSaving(true);
        setErrorMessage('');
        try {
            await callAdmin('topic_delete', { id: topic.id });
            await reloadCourses();
            setSuccessMessage(isEnglish ? 'Lesson deleted.' : 'تم حذف الدرس.');
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const saveDiscount = async (event) => {
        event.preventDefault();
        if (!selectedCourse) return;
        setIsSaving(true);
        setErrorMessage('');
        try {
            const startDate = new Date(discountForm.start_date);
            const endDate = discountForm.end_date ? new Date(discountForm.end_date) : null;
            if (Number.isNaN(startDate.getTime())
                || (endDate && (
                    Number.isNaN(endDate.getTime())
                    || endDate.getTime() <= startDate.getTime()
                ))) {
                throw new Error(isEnglish
                    ? 'Choose a valid start date and an end date later than the start.'
                    : 'اختر وقت بداية صحيحًا، واجعل وقت الانتهاء بعد وقت البداية.');
            }
            const discount = {
                ...discountForm,
                id: editingDiscountId || undefined,
                course_id: selectedCourse.id,
                discount_value: Number(discountForm.discount_value),
                start_date: startDate.toISOString(),
                end_date: endDate ? endDate.toISOString() : null,
            };
            await callAdmin('discount_save', { discount });
            await reloadCourses();
            setDiscountForm({
                discount_type: 'percentage',
                discount_value: '',
                start_date: '',
                end_date: '',
                is_active: true,
                promotional_label: '',
            });
            setEditingDiscountId('');
            setSuccessMessage(isEnglish ? 'Discount saved.' : 'تم حفظ الخصم.');
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const editDiscount = (discount) => {
        setEditingDiscountId(discount.id);
        setDiscountForm({
            ...discount,
            start_date: toLocalDateTimeInput(discount.start_date),
            end_date: toLocalDateTimeInput(discount.end_date),
        });
    };

    const deleteDiscount = async (discount) => {
        if (!window.confirm(isEnglish ? 'Remove this discount?' : 'هل تريد إزالة هذا الخصم؟')) return;
        setIsSaving(true);
        setErrorMessage('');
        try {
            await callAdmin('discount_delete', { id: discount.id });
            await reloadCourses();
            setSuccessMessage(isEnglish ? 'Discount removed.' : 'تم حذف الخصم.');
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const uploadCourseImage = async (event, field) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
            setErrorMessage(isEnglish
                ? 'Choose a JPG, PNG, or WebP image up to 5 MB.'
                : 'اختر صورة JPG أو PNG أو WebP بحجم لا يتجاوز 5 ميجابايت.');
            event.target.value = '';
            return;
        }
        setIsSaving(true);
        setErrorMessage('');
        try {
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onerror = () => reject(new Error(isEnglish ? 'Could not read the image.' : 'تعذرت قراءة الصورة.'));
                reader.onload = () => resolve(String(reader.result).split(',')[1]);
                reader.readAsDataURL(file);
            });
            const data = await callAdmin('course_asset_upload', {
                fileName: file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-120),
                contentType: file.type,
                base64,
            });
            setCourseForm((current) => ({ ...current, [field]: data.url }));
            setSuccessMessage(isEnglish ? 'Image uploaded.' : 'تم رفع الصورة.');
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSaving(false);
            event.target.value = '';
        }
    };

    const moveChapter = async (chapter, direction) => {
        if (!selectedCourse) return;
        const chapters = [...selectedCourse.chapters].sort((a, b) => a.sort_order - b.sort_order);
        const index = chapters.findIndex((item) => item.id === chapter.id);
        const target = chapters[index + direction];
        if (!target || index < 0) return;
        setIsSaving(true);
        setErrorMessage('');
        try {
            await Promise.all([
                callAdmin('chapter_save', { chapter: { ...chapter, sort_order: target.sort_order } }),
                callAdmin('chapter_save', { chapter: { ...target, sort_order: chapter.sort_order } }),
            ]);
            await reloadCourses();
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const moveTopic = async (topic, direction) => {
        if (!selectedChapter) return;
        const topics = [...selectedChapter.topics].sort((a, b) => a.sort_order - b.sort_order);
        const index = topics.findIndex((item) => item.id === topic.id);
        const target = topics[index + direction];
        if (!target || index < 0) return;
        setIsSaving(true);
        setErrorMessage('');
        try {
            await Promise.all([
                callAdmin('topic_save', { topic: { ...topic, sort_order: target.sort_order } }),
                callAdmin('topic_save', { topic: { ...target, sort_order: topic.sort_order } }),
            ]);
            await reloadCourses();
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const field = (label, key, options = {}) => (
        <label className="admin-course-field" key={key}>
            <span>{label}</span>
            {options.textarea ? (
                <textarea
                    rows={options.rows || 3}
                    value={courseForm[key] ?? ''}
                    required={options.required}
                    onChange={(event) => setCourseForm((current) => ({ ...current, [key]: event.target.value }))}
                />
            ) : options.select ? (
                <select
                    value={courseForm[key] ?? ''}
                    required={options.required}
                    onChange={(event) => setCourseForm((current) => ({ ...current, [key]: event.target.value }))}
                >
                    {options.select.map(([value, name]) => <option value={value} key={value}>{name}</option>)}
                </select>
            ) : (
                <input
                    type={options.type || 'text'}
                    value={courseForm[key] ?? ''}
                    required={options.required}
                    min={options.min}
                    step={options.step}
                    onChange={(event) => setCourseForm((current) => ({ ...current, [key]: event.target.value }))}
                />
            )}
        </label>
    );

    const jsonListField = (label, value, onChange, rows = 3) => (
        <label className="admin-course-field">
            <span>{label}</span>
            <textarea
                rows={rows}
                value={Array.isArray(value) ? value.join('\n') : ''}
                placeholder={isEnglish ? 'One item per line' : 'عنصر واحد في كل سطر'}
                onChange={(event) => onChange(linesToList(event.target.value))}
            />
        </label>
    );

    return (
        <section className="admin-course-management">
            <div className="admin-course-stats">
                <article><span>{isEnglish ? 'Total courses' : 'إجمالي الكورسات'}</span><strong>{courses.length}</strong></article>
                <article><span>{isEnglish ? 'Published' : 'منشور'}</span><strong>{publishedCount}</strong></article>
                <article><span>{isEnglish ? 'Drafts' : 'مسودات'}</span><strong>{courses.length - publishedCount}</strong></article>
                <article><span>{isEnglish ? 'Active discounts' : 'الخصومات السارية'}</span><strong>{activeDiscountCount}</strong></article>
            </div>

            {errorMessage && <p className="admin-alert" role="alert">{errorMessage}</p>}
            {successMessage && <p className="admin-success" role="status">{successMessage}</p>}

            <div className="admin-course-toolbar">
                <label className="admin-course-field admin-course-search">
                    <span>{isEnglish ? 'Search courses' : 'بحث في الكورسات'}</span>
                    <input value={search} onChange={(event) => setSearch(event.target.value)} />
                </label>
                <button type="button" className="admin-button" onClick={beginCreateCourse}>
                    {isEnglish ? 'Create course' : 'إنشاء كورس'}
                </button>
            </div>

            {isLoading ? (
                <div className="admin-panel" role="status">{isEnglish ? 'Loading course data...' : 'جارٍ تحميل بيانات الكورسات...'}</div>
            ) : (
                <div className="admin-course-grid">
                    <div className="admin-course-list">
                        {filteredCourses.length === 0 && (
                            <div className="admin-panel">
                                {isEnglish ? 'No courses found. Create your first course.' : 'لا توجد كورسات. أنشئ أول كورس.'}
                            </div>
                        )}
                        {filteredCourses.map((course) => {
                            const discount = getActiveDiscount(course);
                            const currentPrice = getCurrentCoursePrice(course, discount);
                            return (
                                <article className={`admin-course-row ${selectedId === course.id ? 'is-selected' : ''}`} key={course.id}>
                                    <div>
                                        <strong>{isEnglish ? course.title_en : course.title_ar}</strong>
                                        <span>{course.is_published
                                            ? (isEnglish ? 'Published' : 'منشور')
                                            : (isEnglish ? 'Draft' : 'مسودة')}</span>
                                        <small>
                                            {discount && <del>{course.original_price} {course.currency_code}{' '}</del>}
                                            {currentPrice.toFixed(2)} {course.currency_code}
                                            {discount && <span className="course-card-discount">{discount.promotional_label || (isEnglish ? 'Discount active' : 'خصم ساري')}</span>}
                                            {' · '}{course.chapters?.length || 0} {isEnglish ? 'chapters' : 'فصول'}
                                        </small>
                                    </div>
                                    <div className="admin-course-row-actions">
                                        <button type="button" className="admin-button" onClick={() => editCourse(course)}>
                                            {isEnglish ? 'Edit' : 'تعديل'}
                                        </button>
                                        <Link className="admin-button admin-button-secondary"
                                            to={`/Courses/${course.legacy_id ?? course.id}?preview=1`} target="_blank">
                                            {isEnglish ? 'Preview' : 'معاينة'}
                                        </Link>
                                        <button type="button" className="admin-button is-danger"
                                            disabled={isSaving} onClick={() => deleteCourse(course)}>
                                            {isEnglish ? 'Delete' : 'حذف'}
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    <div className="admin-course-editor">
                        <form className="admin-course-form admin-panel" onSubmit={saveCourse}>
                            <h2>{selectedCourse
                                ? (isEnglish ? 'Edit course' : 'تعديل الكورس')
                                : (isEnglish ? 'New course draft' : 'مسودة كورس جديدة')}</h2>
                            <div className="admin-course-form-grid">
                                {field(isEnglish ? 'English title' : 'اسم الكورس بالإنجليزية', 'title_en', { required: true })}
                                {field(isEnglish ? 'Arabic title' : 'اسم الكورس بالعربية', 'title_ar', { required: true })}
                                {field('Slug', 'slug', { required: true })}
                                {field(isEnglish ? 'Category' : 'التصنيف', 'category', { required: true })}
                                {field(isEnglish ? 'Price' : 'السعر', 'original_price', { type: 'number', min: 0, step: '0.01', required: true })}
                                {field(isEnglish ? 'Duration (months)' : 'المدة (بالشهور)', 'duration_months', { type: 'number', min: 0.1, step: '0.1' })}
                                {field(isEnglish ? 'Currency code' : 'رمز العملة', 'currency_code', { required: true })}
                                {field(isEnglish ? 'Difficulty' : 'المستوى', 'difficulty', {
                                    select: [
                                        ['beginner', isEnglish ? 'Beginner' : 'مبتدئ'],
                                        ['intermediate', isEnglish ? 'Intermediate' : 'متوسط'],
                                        ['advanced', isEnglish ? 'Advanced' : 'متقدم'],
                                    ],
                                })}
                                {field(isEnglish ? 'English description' : 'الوصف بالإنجليزية', 'description_en', { textarea: true, rows: 4 })}
                                {field(isEnglish ? 'Arabic description' : 'الوصف بالعربية', 'description_ar', { textarea: true, rows: 4 })}
                                {field(isEnglish ? 'Technologies (one per line)' : 'التقنيات (تقنية في كل سطر)', 'technologies', { textarea: true })}
                                {field(isEnglish ? 'Thumbnail URL' : 'رابط الصورة المصغرة', 'thumbnail_url')}
                                {field(isEnglish ? 'Cover image URL' : 'رابط صورة الغلاف', 'cover_url')}
                            </div>
                            <div className="admin-course-upload-row">
                                <label className="admin-course-field">
                                    <span>{isEnglish ? 'Upload thumbnail' : 'رفع الصورة المصغرة'}</span>
                                    <input type="file" accept="image/jpeg,image/png,image/webp"
                                        onChange={(event) => uploadCourseImage(event, 'thumbnail_url')} />
                                </label>
                                <label className="admin-course-field">
                                    <span>{isEnglish ? 'Upload cover' : 'رفع صورة الغلاف'}</span>
                                    <input type="file" accept="image/jpeg,image/png,image/webp"
                                        onChange={(event) => uploadCourseImage(event, 'cover_url')} />
                                </label>
                            </div>
                            <label className="admin-course-checkbox">
                                <input type="checkbox" checked={Boolean(courseForm.is_published)}
                                    onChange={(event) => setCourseForm((current) => ({ ...current, is_published: event.target.checked }))} />
                                {isEnglish ? 'Published on the public course page' : 'نشر الكورس على الموقع'}
                            </label>
                            <div className="admin-course-actions">
                                <button type="submit" className="admin-button" disabled={isSaving}>
                                    {isSaving ? (isEnglish ? 'Saving...' : 'جارٍ الحفظ...') : (isEnglish ? 'Save course' : 'حفظ الكورس')}
                                </button>
                                {selectedCourse && (
                                    <Link className="admin-button admin-button-secondary" to={`/Courses/${selectedCourse.legacy_id ?? selectedCourse.id}?preview=1`} target="_blank">
                                        {isEnglish ? 'Preview course' : 'معاينة الكورس'}
                                    </Link>
                                )}
                            </div>
                        </form>

                        {selectedCourse && (
                            <>
                                <section className="admin-panel admin-course-builder">
                                    <div className="admin-course-section-heading">
                                        <h2>{isEnglish ? 'Chapters' : 'الفصول'}</h2>
                                        <button type="button" className="admin-button admin-button-secondary"
                                            onClick={() => { setEditingChapterId(''); setShowChapterForm(true); setChapterForm({ ...emptyChapter, sort_order: selectedCourse.chapters.length }); }}>
                                            {isEnglish ? 'Add chapter' : 'إضافة فصل'}
                                        </button>
                                    </div>
                                    <div className="admin-course-items">
                                        {(selectedCourse.chapters || []).map((chapter, index) => (
                                            <article className={`admin-course-item ${selectedChapterId === chapter.id ? 'is-selected' : ''}`} key={chapter.id}>
                                                <button type="button" className="admin-course-item-title"
                                                    onClick={() => { setSelectedChapterId(chapter.id); setEditingChapterId(''); setEditingTopicId(''); }}>
                                                    {index + 1}. {isEnglish ? chapter.title_en : chapter.title_ar}
                                                    <small>{chapter.topics?.length || 0} {isEnglish ? 'lessons' : 'دروس'}</small>
                                                </button>
                                                <div className="admin-course-item-actions">
                                                    <button type="button" onClick={() => moveChapter(chapter, -1)} disabled={index === 0 || isSaving}>↑</button>
                                                    <button type="button" onClick={() => moveChapter(chapter, 1)} disabled={index === selectedCourse.chapters.length - 1 || isSaving}>↓</button>
                                                    <button type="button" onClick={() => editChapter(chapter)}>{isEnglish ? 'Edit' : 'تعديل'}</button>
                                                    <button type="button" className="is-danger" onClick={() => deleteChapter(chapter)} disabled={isSaving}>{isEnglish ? 'Delete' : 'حذف'}</button>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                    {showChapterForm && (
                                        <form className="admin-course-subform" onSubmit={saveChapter}>
                                            <h3>{isEnglish ? 'Chapter details' : 'تفاصيل الفصل'}</h3>
                                            <div className="admin-course-form-grid">
                                                <label className="admin-course-field"><span>{isEnglish ? 'Title (English)' : 'العنوان بالإنجليزية'}</span><input required value={chapterForm.title_en} onChange={(event) => setChapterForm((current) => ({ ...current, title_en: event.target.value }))} /></label>
                                                <label className="admin-course-field"><span>{isEnglish ? 'Title (Arabic)' : 'العنوان بالعربية'}</span><input required value={chapterForm.title_ar} onChange={(event) => setChapterForm((current) => ({ ...current, title_ar: event.target.value }))} /></label>
                                                <label className="admin-course-field"><span>{isEnglish ? 'Description (English)' : 'الوصف بالإنجليزية'}</span><textarea rows="3" value={chapterForm.description_en} onChange={(event) => setChapterForm((current) => ({ ...current, description_en: event.target.value }))} /></label>
                                                <label className="admin-course-field"><span>{isEnglish ? 'Description (Arabic)' : 'الوصف بالعربية'}</span><textarea rows="3" value={chapterForm.description_ar} onChange={(event) => setChapterForm((current) => ({ ...current, description_ar: event.target.value }))} /></label>
                                                {[
                                                    ['learning_objectives', isEnglish ? 'Learning objectives' : 'أهداف التعلم'],
                                                    ['practical_applications', isEnglish ? 'Practical applications' : 'تطبيقات عملية'],
                                                    ['real_world_examples', isEnglish ? 'Real-world examples' : 'أمثلة واقعية'],
                                                    ['tools_and_technologies', isEnglish ? 'Tools and technologies' : 'الأدوات والتقنيات'],
                                                    ['exercises', isEnglish ? 'Exercises and assignments' : 'التدريبات والتكليفات'],
                                                    ['expected_outcomes', isEnglish ? 'Expected outcomes' : 'المخرجات المتوقعة'],
                                                ].map(([key, label]) => (
                                                    <Fragment key={key}>
                                                        {jsonListField(`${label} · English`, chapterForm[key]?.en || [], (items) => setChapterForm((current) => ({ ...current, [key]: { ...(current[key] || {}), en: items } })))}
                                                        {jsonListField(`${label} · العربية`, chapterForm[key]?.ar || [], (items) => setChapterForm((current) => ({ ...current, [key]: { ...(current[key] || {}), ar: items } })))}
                                                    </Fragment>
                                                ))}
                                                <label className="admin-course-field"><span>{isEnglish ? 'Estimated minutes' : 'المدة بالدقائق'}</span><input type="number" min="1" value={chapterForm.duration_minutes ?? ''} onChange={(event) => setChapterForm((current) => ({ ...current, duration_minutes: event.target.value }))} /></label>
                                                <label className="admin-course-field"><span>{isEnglish ? 'Difficulty' : 'المستوى'}</span><select value={chapterForm.difficulty || ''} onChange={(event) => setChapterForm((current) => ({ ...current, difficulty: event.target.value }))}><option value="beginner">{isEnglish ? 'Beginner' : 'مبتدئ'}</option><option value="intermediate">{isEnglish ? 'Intermediate' : 'متوسط'}</option><option value="advanced">{isEnglish ? 'Advanced' : 'متقدم'}</option></select></label>
                                            </div>
                                            <div className="admin-course-actions">
                                                <button className="admin-button" type="submit" disabled={isSaving}>{isEnglish ? 'Save chapter' : 'حفظ الفصل'}</button>
                                                <button className="admin-button admin-button-secondary" type="button" onClick={() => { setChapterForm(emptyChapter); setEditingChapterId(''); setShowChapterForm(false); }}>{isEnglish ? 'Cancel' : 'إلغاء'}</button>
                                            </div>
                                        </form>
                                    )}
                                </section>

                                {selectedChapter && (
                                    <section className="admin-panel admin-course-builder">
                                        <div className="admin-course-section-heading">
                                            <h2>{isEnglish ? 'Lessons and topics' : 'الدروس والموضوعات'}</h2>
                                            <button type="button" className="admin-button admin-button-secondary"
                                                onClick={() => { setEditingTopicId(''); setShowTopicForm(true); setTopicForm({ ...emptyTopic, sort_order: selectedChapter.topics.length }); }}>
                                                {isEnglish ? 'Add lesson' : 'إضافة درس'}
                                            </button>
                                        </div>
                                        <div className="admin-course-items">
                                            {(selectedChapter.topics || []).map((topic, index) => (
                                                <article className="admin-course-item" key={topic.id}>
                                                    <strong>{index + 1}. {isEnglish ? topic.title_en : topic.title_ar}</strong>
                                                    <div className="admin-course-item-actions">
                                                        <button type="button" onClick={() => moveTopic(topic, -1)} disabled={index === 0 || isSaving}>↑</button>
                                                        <button type="button" onClick={() => moveTopic(topic, 1)} disabled={index === selectedChapter.topics.length - 1 || isSaving}>↓</button>
                                                        <button type="button" onClick={() => editTopic(topic)}>{isEnglish ? 'Edit' : 'تعديل'}</button>
                                                        <button type="button" className="is-danger" onClick={() => deleteTopic(topic)} disabled={isSaving}>{isEnglish ? 'Delete' : 'حذف'}</button>
                                                    </div>
                                                </article>
                                            ))}
                                        </div>
                                        {showTopicForm && (
                                            <form className="admin-course-subform" onSubmit={saveTopic}>
                                                <h3>{isEnglish ? 'Lesson content' : 'محتوى الدرس'}</h3>
                                                <div className="admin-course-form-grid">
                                                    <label className="admin-course-field"><span>{isEnglish ? 'Title (English)' : 'العنوان بالإنجليزية'}</span><input required value={topicForm.title_en} onChange={(event) => setTopicForm((current) => ({ ...current, title_en: event.target.value }))} /></label>
                                                    <label className="admin-course-field"><span>{isEnglish ? 'Title (Arabic)' : 'العنوان بالعربية'}</span><input required value={topicForm.title_ar} onChange={(event) => setTopicForm((current) => ({ ...current, title_ar: event.target.value }))} /></label>
                                                    <label className="admin-course-field"><span>{isEnglish ? 'Short description (English)' : 'وصف مختصر بالإنجليزية'}</span><textarea rows="2" value={topicForm.short_description_en} onChange={(event) => setTopicForm((current) => ({ ...current, short_description_en: event.target.value }))} /></label>
                                                    <label className="admin-course-field"><span>{isEnglish ? 'Short description (Arabic)' : 'وصف مختصر بالعربية'}</span><textarea rows="2" value={topicForm.short_description_ar} onChange={(event) => setTopicForm((current) => ({ ...current, short_description_ar: event.target.value }))} /></label>
                                                    <label className="admin-course-field"><span>{isEnglish ? 'Detailed explanation (English)' : 'الشرح التفصيلي بالإنجليزية'}</span><textarea rows="8" value={topicForm.detailed_content_en} onChange={(event) => setTopicForm((current) => ({ ...current, detailed_content_en: event.target.value }))} /></label>
                                                    <label className="admin-course-field"><span>{isEnglish ? 'Detailed explanation (Arabic)' : 'الشرح التفصيلي بالعربية'}</span><textarea rows="8" value={topicForm.detailed_content_ar} onChange={(event) => setTopicForm((current) => ({ ...current, detailed_content_ar: event.target.value }))} /></label>
                                                    {[
                                                        ['step_by_step', isEnglish ? 'Step-by-step breakdown' : 'الشرح خطوة بخطوة'],
                                                        ['practical_examples', isEnglish ? 'Practical examples' : 'أمثلة عملية'],
                                                        ['use_cases', isEnglish ? 'Use cases' : 'حالات الاستخدام'],
                                                        ['common_mistakes', isEnglish ? 'Common mistakes' : 'أخطاء شائعة'],
                                                        ['exercises', isEnglish ? 'Exercises' : 'تمارين'],
                                                    ].map(([key, label]) => (
                                                        <Fragment key={key}>
                                                            {jsonListField(`${label} · English`, topicForm[key]?.en || [], (items) => setTopicForm((current) => ({ ...current, [key]: { ...(current[key] || {}), en: items } })))}
                                                            {jsonListField(`${label} · العربية`, topicForm[key]?.ar || [], (items) => setTopicForm((current) => ({ ...current, [key]: { ...(current[key] || {}), ar: items } })))}
                                                        </Fragment>
                                                    ))}
                                                    <label className="admin-course-field admin-course-field-full"><span>{isEnglish ? 'Code examples (JSON array)' : 'أمثلة الكود (مصفوفة JSON)'}</span><textarea rows="7" dir="ltr" value={typeof topicForm.code_examples === 'string' ? topicForm.code_examples : JSON.stringify(topicForm.code_examples || [], null, 2)} onChange={(event) => setTopicForm((current) => ({ ...current, code_examples: event.target.value }))} placeholder={'[{"title":"Example","code":"const value = 1;","explanation":"..."}]'} /></label>
                                                </div>
                                                <div className="admin-course-actions">
                                                    <button className="admin-button" type="submit" disabled={isSaving}>{isEnglish ? 'Save lesson' : 'حفظ الدرس'}</button>
                                                    <button className="admin-button admin-button-secondary" type="button" onClick={() => { setTopicForm(emptyTopic); setEditingTopicId(''); setShowTopicForm(false); }}>{isEnglish ? 'Cancel' : 'إلغاء'}</button>
                                                </div>
                                            </form>
                                        )}
                                    </section>
                                )}

                                <section className="admin-panel admin-course-builder">
                                    <h2>{isEnglish ? 'Pricing and discounts' : 'الأسعار والخصومات'}</h2>
                                    <p className="admin-course-help">
                                        {isEnglish
                                            ? 'The current price is calculated from the original price and the active discount schedule.'
                                            : 'يُحسب السعر الحالي من السعر الأصلي والخصم الساري في موعده.'}
                                    </p>
                                    <div className="admin-course-items">
                                        {(selectedCourse.discounts || []).map((discount) => (
                                            <article className="admin-course-item" key={discount.id}>
                                                <strong>
                                                    {discount.discount_type} · {discount.discount_value}
                                                    {discount.discount_type === 'percentage' ? '%' : ` ${selectedCourse.currency_code}`}
                                                    {discount.promotional_label ? ` · ${discount.promotional_label}` : ''}
                                                </strong>
                                                <small>{new Date(discount.start_date).toLocaleString()} – {discount.end_date ? new Date(discount.end_date).toLocaleString() : (isEnglish ? 'No end date' : 'بلا تاريخ انتهاء')}</small>
                                                <span>
                                                    {{
                                                        active: isEnglish ? 'Active now' : 'ساري الآن',
                                                        scheduled: isEnglish ? 'Scheduled' : 'مجدول',
                                                        expired: isEnglish ? 'Expired' : 'انتهى',
                                                        disabled: isEnglish ? 'Disabled' : 'متوقف',
                                                    }[getDiscountStatus(discount)]}
                                                </span>
                                                <div className="admin-course-item-actions">
                                                    <button type="button" onClick={() => editDiscount(discount)}>{isEnglish ? 'Edit' : 'تعديل'}</button>
                                                    <button type="button" className="is-danger" onClick={() => deleteDiscount(discount)} disabled={isSaving}>{isEnglish ? 'Remove' : 'إزالة'}</button>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                    <form className="admin-course-subform" onSubmit={saveDiscount}>
                                        <h3>{editingDiscountId
                                            ? (isEnglish ? 'Edit discount' : 'تعديل الخصم')
                                            : (isEnglish ? 'Add a discount' : 'إضافة خصم')}</h3>
                                        <div className="admin-course-form-grid">
                                            <label className="admin-course-field"><span>{isEnglish ? 'Discount type' : 'نوع الخصم'}</span><select value={discountForm.discount_type} onChange={(event) => setDiscountForm((current) => ({ ...current, discount_type: event.target.value }))}><option value="percentage">{isEnglish ? 'Percentage' : 'نسبة مئوية'}</option><option value="fixed_amount">{isEnglish ? 'Fixed amount' : 'مبلغ ثابت'}</option><option value="fixed_price">{isEnglish ? 'Set current price' : 'تحديد سعر البيع'}</option></select></label>
                                            <label className="admin-course-field"><span>{isEnglish ? 'Discount value' : 'قيمة الخصم'}</span><input required type="number" min="0" step="0.01" max={discountForm.discount_type === 'percentage' ? 100 : undefined} value={discountForm.discount_value} onChange={(event) => setDiscountForm((current) => ({ ...current, discount_value: event.target.value }))} /></label>
                                            <label className="admin-course-field"><span>{isEnglish ? 'Start date' : 'تاريخ البداية'}</span><input required type="datetime-local" value={discountForm.start_date} onChange={(event) => setDiscountForm((current) => ({ ...current, start_date: event.target.value }))} /></label>
                                            <label className="admin-course-field"><span>{isEnglish ? 'End date and time (optional)' : 'تاريخ ووقت الانتهاء (اختياري)'}</span><input type="datetime-local" value={discountForm.end_date} onChange={(event) => setDiscountForm((current) => ({ ...current, end_date: event.target.value }))} /></label>
                                            <label className="admin-course-field admin-course-field-full"><span>{isEnglish ? 'Promotional label' : 'العبارة الترويجية'}</span><input maxLength="120" value={discountForm.promotional_label} onChange={(event) => setDiscountForm((current) => ({ ...current, promotional_label: event.target.value }))} /></label>
                                        </div>
                                        {draftDiscountPreview && (
                                            <div className="admin-course-discount-preview" aria-live="polite">
                                                <strong>{isEnglish ? 'Price preview' : 'معاينة السعر'}</strong>
                                                <span>
                                                    {isEnglish ? 'Original price:' : 'السعر الأساسي:'}{' '}
                                                    {formatCoursePrice(draftDiscountPreview.originalPrice, selectedCourse.currency_code, language)}
                                                </span>
                                                <span>
                                                    {isEnglish ? 'Discount:' : 'قيمة الخصم:'}{' '}
                                                    {formatCoursePrice(draftDiscountPreview.savings, selectedCourse.currency_code, language)}
                                                    {discountForm.discount_type === 'percentage' && ` (${discountForm.discount_value}%)`}
                                                </span>
                                                <span>
                                                    {isEnglish ? 'Price during the offer:' : 'السعر أثناء العرض:'}{' '}
                                                    <strong>{formatCoursePrice(draftDiscountPreview.currentPrice, selectedCourse.currency_code, language)}</strong>
                                                </span>
                                                <small>
                                                    {isEnglish
                                                        ? 'This price appears on the public course page while the discount is enabled and within its start/end times.'
                                                        : 'يظهر هذا السعر على صفحة الكورس العامة عندما يكون الخصم مفعّلًا وداخل موعد البداية والانتهاء المحدد.'}
                                                </small>
                                            </div>
                                        )}
                                        <label className="admin-course-checkbox"><input type="checkbox" checked={discountForm.is_active} onChange={(event) => setDiscountForm((current) => ({ ...current, is_active: event.target.checked }))} />{isEnglish ? 'Enable discount during its scheduled dates' : 'تفعيل الخصم خلال موعده المحدد'}</label>
                                        <div className="admin-course-actions">
                                            <button className="admin-button" type="submit" disabled={isSaving}>{isEnglish ? 'Save discount' : 'حفظ الخصم'}</button>
                                            {editingDiscountId && <button className="admin-button admin-button-secondary" type="button" onClick={() => { setEditingDiscountId(''); setDiscountForm({ discount_type: 'percentage', discount_value: '', start_date: '', end_date: '', is_active: true, promotional_label: '' }); }}>{isEnglish ? 'Cancel edit' : 'إلغاء التعديل'}</button>}
                                        </div>
                                    </form>
                                </section>
                            </>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}

export default AdminCourseManagement;
