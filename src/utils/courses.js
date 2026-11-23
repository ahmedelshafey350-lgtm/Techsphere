import Detalis from '../Cards/CoursesDetalis';
import { getCourseChapterDetails } from '../Cards/courseCurriculumDetails';
import { getSupabaseClient, isSupabaseConfigured } from '../login/supabase';

const isUuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value));

function localizedItems(value, language) {
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object') {
        const items = value[language] || value.en || value.ar;
        return Array.isArray(items) ? items : [];
    }
    return [];
}

function hasLocalizedContent(value) {
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (value && typeof value === 'object') {
        return ['en', 'ar'].some((language) => (
            Array.isArray(value[language]) ? value[language].length > 0 : Boolean(value[language])
        ));
    }
    return false;
}

function addTopicLearningDetails(topic, chapter) {
    const titleEn = topic.title_en || topic.title || 'this lesson';
    const titleAr = topic.title_ar || topic.titleAr || 'هذا الدرس';
    const chapterTitleEn = chapter.title_en || chapter.title || 'the chapter';
    const chapterTitleAr = chapter.title_ar || chapter.titleAr || 'الفصل';
    const chapterDescriptionEn = chapter.description_en || '';
    const chapterDescriptionAr = chapter.description_ar || '';
    const chapterObjectivesEn = localizedItems(chapter.learning_objectives, 'en');
    const chapterObjectivesAr = localizedItems(chapter.learning_objectives, 'ar');
    const chapterApplicationsEn = localizedItems(chapter.practical_applications, 'en');
    const chapterApplicationsAr = localizedItems(chapter.practical_applications, 'ar');

    return {
        ...topic,
        short_description_en: topic.short_description_en || `This lesson focuses on ${titleEn} and how it contributes to ${chapterTitleEn}.`,
        short_description_ar: topic.short_description_ar || `يركز هذا الدرس على ${titleAr} ودوره ضمن ${chapterTitleAr}.`,
        detailed_content_en: topic.detailed_content_en || [
            `${titleEn} is one of the building blocks of ${chapterTitleEn}. Study the idea in the context of the chapter${chapterDescriptionEn ? `: ${chapterDescriptionEn}` : '.'}`,
            'Do not stop at memorizing a definition: identify what the concept receives, what rule or transformation it applies, and what result it produces. Then compare that result with the behavior expected by the surrounding system.',
            chapterObjectivesEn.length ? `By the end, connect the lesson to this chapter objective: ${chapterObjectivesEn[0]}` : '',
        ].filter(Boolean).join('\n\n'),
        detailed_content_ar: topic.detailed_content_ar || [
            `${titleAr} من اللبنات الأساسية في ${chapterTitleAr}. ادرس الفكرة في سياق الفصل${chapterDescriptionAr ? `: ${chapterDescriptionAr}` : '.'}`,
            'لا تكتفِ بحفظ التعريف: حدّد ما الذي يستقبله المفهوم، وما القاعدة أو التحويل الذي يطبقه، وما النتيجة التي ينتجها. بعد ذلك قارن النتيجة بالسلوك المتوقع في النظام المحيط.',
            chapterObjectivesAr.length ? `اربط الدرس بهدف الفصل التالي: ${chapterObjectivesAr[0]}` : '',
        ].filter(Boolean).join('\n\n'),
        step_by_step: hasLocalizedContent(topic.step_by_step) ? topic.step_by_step : {
            en: [
                `State the purpose of ${titleEn} and the situation in which it is used.`,
                `Trace its inputs, rules, and outputs within ${chapterTitleEn}; write down any assumptions.`,
                'Try a normal example and a boundary or failure case, then explain why the results differ.',
            ],
            ar: [
                `وضّح وظيفة ${titleAr} والحالة التي يُستخدم فيها.`,
                `تتبّع مدخلاته وقواعده ومخرجاته ضمن ${chapterTitleAr}، وسجّل الافتراضات.`,
                'جرّب مثالًا عاديًا وحالة حدية أو حالة فشل، ثم اشرح سبب اختلاف النتيجة.',
            ],
        },
        practical_examples: hasLocalizedContent(topic.practical_examples) ? topic.practical_examples : {
            en: chapterApplicationsEn.length
                ? chapterApplicationsEn
                : [`Apply ${titleEn} in a small exercise related to ${chapterTitleEn}.`],
            ar: chapterApplicationsAr.length
                ? chapterApplicationsAr
                : [`طبّق ${titleAr} في تمرين صغير مرتبط بـ${chapterTitleAr}.`],
        },
        use_cases: hasLocalizedContent(topic.use_cases) ? topic.use_cases : {
            en: [`Use ${titleEn} when a task requires the behavior or outcome taught in ${chapterTitleEn}.`],
            ar: [`استخدم ${titleAr} عندما تتطلب المهمة السلوك أو النتيجة التي يشرحها ${chapterTitleAr}.`],
        },
        common_mistakes: hasLocalizedContent(topic.common_mistakes) ? topic.common_mistakes : {
            en: [
                'Using the concept without checking its inputs, constraints, or prerequisites.',
                'Testing only one happy path and assuming the same result for edge cases.',
            ],
            ar: [
                'استخدام المفهوم دون التحقق من مدخلاته أو قيوده أو متطلباته السابقة.',
                'اختبار الحالة السليمة فقط وافتراض أن الحالات الحدية ستعطي النتيجة نفسها.',
            ],
        },
        exercises: hasLocalizedContent(topic.exercises) ? topic.exercises : {
            en: [`Explain ${titleEn} in your own words, then apply it to a new example from ${chapterTitleEn}. Record the result and justify each step.`],
            ar: [`اشرح ${titleAr} بأسلوبك، ثم طبّقه على مثال جديد من ${chapterTitleAr}. سجّل النتيجة وبرّر كل خطوة.`],
        },
    };
}

export function staticCourse(course) {
    return {
        ...course,
        routeId: course.id,
        original_price: course.price,
        current_price: course.price,
        currency_code: 'EGP',
        duration_months: course.durationMonths,
        chapters: (course.curriculum || []).map((chapter, chapterIndex) => {
            const details = getCourseChapterDetails(course.id, chapterIndex);
            return {
                ...chapter,
                ...details,
                id: `static-chapter-${course.id}-${chapterIndex}`,
                sort_order: chapterIndex,
                description_en: details?.description_en || '',
                description_ar: details?.description_ar || '',
                learning_objectives: details?.learning_objectives || { en: [], ar: [] },
                topics: (chapter.topics || []).map((topic, topicIndex) => addTopicLearningDetails({
                    id: `static-topic-${course.id}-${chapterIndex}-${topicIndex}`,
                    title_en: topic,
                    title_ar: chapter.topicsAr?.[topicIndex] || topic,
                    sort_order: topicIndex,
                }, {
                    ...chapter,
                    ...details,
                })),
            };
        }),
        discounts: [],
    };
}

export function normalizeCourse(course) {
    const legacyCourse = course.legacy_id === null || course.legacy_id === undefined
        ? null
        : Detalis.find((item) => item.id === course.legacy_id);
    return {
        ...course,
        routeId: course.legacy_id ?? course.id,
        name: course.title_en,
        nameAr: course.title_ar,
        description: course.description_en,
        descriptionAr: course.description_ar,
        image: course.thumbnail_url || course.cover_url || legacyCourse?.image || '',
        price: Number(course.current_price ?? course.original_price),
        original_price: Number(course.original_price),
        current_price: Number(course.current_price ?? course.original_price),
        durationMonths: course.duration_months,
    };
}

export async function loadPublishedCourses() {
    if (!isSupabaseConfigured()) {
        return { courses: Detalis.map(staticCourse), usedLegacyFallback: false };
    }

    const { data, error } = await getSupabaseClient()
        .from('course_catalog')
        .select('*')
        .order('title_en');
    if (error) {
        console.error('Unable to load the Supabase course catalog; showing existing courses instead:', error.message);
        return { courses: Detalis.map(staticCourse), usedLegacyFallback: true };
    }
    if (!data?.length) {
        return { courses: Detalis.map(staticCourse), usedLegacyFallback: true };
    }
    return { courses: data.map(normalizeCourse), usedLegacyFallback: false };
}

export async function loadCourseDetails(id, { preview = false } = {}) {
    if (preview) {
        if (!isSupabaseConfigured()) throw new Error('Supabase is not configured.');
        const { data, error } = await getSupabaseClient().functions.invoke(
            'admin-requests',
            { body: { action: 'course_preview', id } },
        );
        if (error) {
            const response = error.context instanceof Response
                ? await error.context.clone().json().catch(() => null)
                : null;
            throw new Error(response?.error || error.message);
        }
        if (data?.error) throw new Error(data.error);
        return data?.course ? normalizeCourse(data.course) : null;
    }

    if (!isSupabaseConfigured()) {
        const course = Detalis.find((item) => String(item.id) === String(id));
        return course ? staticCourse(course) : null;
    }

    const legacyCourse = Detalis.find((item) => String(item.id) === String(id));
    const client = getSupabaseClient();
    const courseQuery = client.from('course_catalog').select('*');
    const { data: course, error: courseError } = isUuid(id)
        ? await courseQuery.eq('id', id).maybeSingle()
        : await courseQuery.eq('legacy_id', Number(id)).maybeSingle();
    if (courseError) {
        if (legacyCourse) {
            console.error('Unable to load the Supabase course catalog; showing the existing course details instead:', courseError.message);
            return staticCourse(legacyCourse);
        }
        throw new Error(courseError.message);
    }
    if (!course) return legacyCourse ? staticCourse(legacyCourse) : null;

    const { data: chapters, error: chaptersError } = await client
        .from('course_chapters')
        .select('*')
        .eq('course_id', course.id)
        .order('sort_order');
    if (chaptersError) {
        if (legacyCourse) {
            console.error('Unable to load Supabase course chapters; showing the existing course details instead:', chaptersError.message);
            return staticCourse(legacyCourse);
        }
        throw new Error(chaptersError.message);
    }

    if ((!chapters || chapters.length === 0) && course.legacy_id !== null) {
        const mappedLegacyCourse = Detalis.find((item) => item.id === course.legacy_id);
        if (mappedLegacyCourse) {
            return {
                ...staticCourse(mappedLegacyCourse),
                ...normalizeCourse(course),
                chapters: staticCourse(mappedLegacyCourse).chapters,
            };
        }
    }

    const chapterIds = (chapters || []).map((chapter) => chapter.id);
    let topics = [];
    if (chapterIds.length) {
        const { data, error } = await client
            .from('chapter_topics')
            .select('*')
            .in('chapter_id', chapterIds)
            .order('sort_order');
        if (error) {
            if (legacyCourse) {
                console.error('Unable to load Supabase chapter topics; showing the existing course details instead:', error.message);
                return staticCourse(legacyCourse);
            }
            throw new Error(error.message);
        }
        topics = data || [];
    }

    const chaptersById = new Map((chapters || []).map((chapter) => [chapter.id, chapter]));
    const topicsByChapter = new Map();
    for (const topic of topics) {
        const chapterTopics = topicsByChapter.get(topic.chapter_id) || [];
        chapterTopics.push(addTopicLearningDetails(topic, chaptersById.get(topic.chapter_id) || {}));
        topicsByChapter.set(topic.chapter_id, chapterTopics);
    }

    return {
        ...normalizeCourse(course),
        chapters: (chapters || []).map((chapter) => ({
            ...chapter,
            topics: topicsByChapter.get(chapter.id) || [],
        })),
    };
}

export function localizedValue(value, language) {
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object') {
        const localized = value[language] || value.en || value.ar;
        return Array.isArray(localized) ? localized : [];
    }
    return [];
}

export function formatCoursePrice(amount, currencyCode, language) {
    return new Intl.NumberFormat(language === 'en' ? 'en-EG' : 'ar-EG', {
        style: 'currency',
        currency: currencyCode || 'EGP',
        maximumFractionDigits: 2,
    }).format(Number(amount) || 0);
}
