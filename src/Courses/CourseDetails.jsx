import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { formatCoursePrice, loadCourseDetails, localizedValue } from '../utils/courses';
import { useLanguage } from '../i18n/language';
import './CourseDetails.css';

function CourseDetails() {
    const { id } = useParams();
    const location = useLocation();
    const { language } = useLanguage();
    const isEnglish = language === 'en';
    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [expandedIds, setExpandedIds] = useState(new Set());

    useEffect(() => {
        let isActive = true;
        setIsLoading(true);
        setErrorMessage('');

        loadCourseDetails(id, { preview: new URLSearchParams(location.search).get('preview') === '1' })
            .then((loadedCourse) => {
                if (isActive) {
                    setCourse(loadedCourse);
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                if (isActive) {
                    setErrorMessage(error.message);
                    setIsLoading(false);
                }
            });

        return () => {
            isActive = false;
        };
    }, [id, location.search]);

    const renderList = (value) => {
        if (!value) return null;
        const items = localizedValue(value, language);
        return items.length ? (
            <ul className="course-detail-list">{items.map((item, index) => <li key={`${index}-${String(item)}`}>{item}</li>)}</ul>
        ) : null;
    };

    const countdown = (endDate) => {
        if (!endDate) return null;
        const remaining = new Date(endDate).getTime() - Date.now();
        if (remaining <= 0) return null;
        const days = Math.floor(remaining / 86400000);
        const hours = Math.floor((remaining % 86400000) / 3600000);
        return isEnglish
            ? `Offer ends in ${days}d ${hours}h`
            : `ينتهي العرض خلال ${days} يوماً و ${hours} ساعة`;
    };

    if (isLoading) {
        return (
            <main className="course-details-page" dir={isEnglish ? 'ltr' : 'rtl'}>
                <div className="course-details-container course-details-status" role="status">
                    {isEnglish ? 'Loading course details...' : 'جارٍ تحميل تفاصيل الكورس...'}
                </div>
            </main>
        );
    }

    if (errorMessage || !course) {
        return (
            <main className="course-details-page" dir={isEnglish ? 'ltr' : 'rtl'}>
                <section className="course-details-not-found" role={errorMessage ? 'alert' : undefined}>
                    <h1>{errorMessage
                        ? (isEnglish ? 'Could not load course details' : 'تعذر تحميل تفاصيل الكورس')
                        : (isEnglish ? 'Course not found' : 'الكورس غير موجود')}</h1>
                    {errorMessage && <p>{errorMessage}</p>}
                    <Link to="/Courses">{isEnglish ? 'Browse all courses' : 'تصفح جميع الكورسات'}</Link>
                </section>
            </main>
        );
    }

    const courseName = isEnglish ? (course.name || course.title_en || 'Course') : (course.nameAr || course.title_ar || 'الكورس');
    const courseDescription = isEnglish ? (course.description || course.description_en || '') : (course.descriptionAr || course.description_ar || '');
    const categoryNames = {
        software: isEnglish ? 'Software & Automation' : 'البرمجيات والأتمتة',
        electronics: isEnglish ? 'Electronics & PCB' : 'الإلكترونيات وتصميم اللوحات',
        robotics: isEnglish ? 'Robotics' : 'الروبوتات',
    };
    const difficultyNames = {
        beginner: isEnglish ? 'Beginner' : 'مبتدئ',
        intermediate: isEnglish ? 'Intermediate' : 'متوسط',
        advanced: isEnglish ? 'Advanced' : 'متقدم',
    };
    const endCountdown = countdown(course.discount_end_date);

    const chapters = course.chapters || [];

    // Extract all technologies from chapters for Tools section
    const allTechnologies = new Set();
    chapters.forEach((chapter) => {
        const chapterTools = localizedValue(chapter.tools_and_technologies, language);
        chapterTools.forEach((t) => allTechnologies.add(t));
    });
    (course.technologies || []).forEach((t) => allTechnologies.add(t));

    // Generate practical projects from chapter topics
    const practicalProjects = [];
    chapters.forEach((chapter, chapterIdx) => {
        const topics = chapter.topics || [];
        topics.forEach((topic, topicIdx) => {
            const examples = localizedValue(topic.practical_examples, language);
            if (examples.length > 0) {
                practicalProjects.push({
                    id: `project-${chapterIdx}-${topicIdx}`,
                    title: isEnglish ? (topic.title_en || topic.title || '') : (topic.title_ar || topic.titleAr || ''),
                    description: examples[0],
                    skills: localizedValue(topic.learning_objectives || chapter.learning_objectives, language).slice(0, 3),
                    tools: localizedValue(chapter.tools_and_technologies, language).slice(0, 3),
                    difficulty: difficultyNames[chapter.difficulty || course.difficulty || 'beginner'],
                });
            }
        });
    });

    // Learning outcomes from all chapters
    const allLearningOutcomes = [];
    chapters.forEach((chapter) => {
        const outcomes = localizedValue(chapter.expected_outcomes, language);
        outcomes.forEach((o) => allLearningOutcomes.push(o));
    });

    // Who this course is for
    const difficulty = course.difficulty || 'beginner';
    const targetAudience = isEnglish
        ? difficulty === 'beginner'
            ? 'Anyone starting their journey in this field with no prior experience required.'
            : difficulty === 'intermediate'
                ? 'Learners with basic knowledge looking to deepen their skills and build real projects.'
                : 'Experienced professionals aiming to master advanced techniques and lead projects.'
        : difficulty === 'beginner'
            ? 'أي شخص يبدأ مساره في هذا المجال ولا يتطلب خبرة سابقة.'
            : difficulty === 'intermediate'
                ? 'متعلمون لديهم معرفة أساسية ويرغبون في تعميق مهاراتهم وبناء مشاريع حقيقية.'
                : 'محترفون ذوي خبرة يهدفون إلى إتقان التقنيات المتقدمة وقيادة المشاريع.';

    // Prerequisites
    const prerequisites = isEnglish
        ? difficulty === 'beginner'
            ? ['No prior experience required', 'Basic computer literacy', 'A computer with internet access']
            : difficulty === 'intermediate'
                ? ['Basic understanding of the field', 'Familiarity with core concepts', 'A computer with required software installed']
                : ['Solid foundation in the subject', 'Experience with related tools', 'Ability to work independently on projects']
        : difficulty === 'beginner'
            ? ['لا تتطلب خبرة سابقة', 'مهارات أساسية في استخدام الحاسوب', 'حاسوب متصل بالإنترنت']
            : difficulty === 'intermediate'
                ? ['فهم أساسي للمجال', 'إلمام بالمفاهيم الأساسية', 'حاسوب مع البرامج المطلوبة مثبتة']
                : ['أساس متين في الموضوع', 'خبرة مع الأدوات ذات الصلة', 'القدرة على العمل بشكل مستقل على المشاريع'];

    const isExpanded = (id) => expandedIds.has(id);
    const toggleExpand = (id) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <main className="course-details-page" dir={isEnglish ? 'ltr' : 'rtl'}>
            <div className="course-details-container">

                {/* ========== SECTION A: COURSE HERO ========== */}
                <header className="course-details-hero">
                    {new URLSearchParams(location.search).get('preview') === '1' && (
                        <p className="course-preview-notice">
                            {isEnglish ? 'Admin preview · This course may be unpublished.' : 'معاينة المدير · قد يكون الكورس غير منشور.'}
                        </p>
                    )}
                    <div className="course-hero-badge">
                        <span className="badge-item">{categoryNames[course.category] || course.category || ''}</span>
                        <span className="badge-item">{difficultyNames[difficulty]}</span>
                        <span className="badge-item">
                            {course.duration_months
                                ? `${course.duration_months} ${isEnglish ? 'months' : 'أشهر'}`
                                : (isEnglish ? 'Self-paced' : 'بديل ذاتي')}
                        </span>
                    </div>
                    <div className="course-hero-content">
                        <h1>{courseName}</h1>
                        <p className="course-hero-description">{courseDescription}</p>
                    </div>
                    <div className="course-hero-actions">
                        <div className="course-hero-price">
                            {course.discount_percentage > 0 && (
                                <del className="course-hero-original-price">{formatCoursePrice(course.original_price, course.currency_code, language)}</del>
                            )}
                            <span className="course-hero-current-price">{formatCoursePrice(course.current_price, course.currency_code, language)}</span>
                            {course.discount_percentage > 0 && (
                                <span className="course-discount-badge">{isEnglish ? `${course.discount_percentage}% OFF` : `خصم ${course.discount_percentage}%`}</span>
                            )}
                            {endCountdown && <span className="course-discount-countdown">{endCountdown}</span>}
                        </div>
                        <Link className="course-hero-enroll" to={`/Payment/${course.routeId || course.id}`}>
                            {isEnglish ? 'Enroll Now' : 'انضم الآن'}
                        </Link>
                    </div>
                </header>

                {/* ========== SECTION B: PROGRAM OVERVIEW ========== */}
                <section className="program-overview">
                    <div className="program-overview-grid">
                        <div className="program-card">
                            <div className="program-icon">🎯</div>
                            <h3>{isEnglish ? 'About This Course' : 'حول هذا الكورس'}</h3>
                            <p>{courseDescription}</p>
                        </div>
                        <div className="program-card">
                            <div className="program-icon">📚</div>
                            <h3>{isEnglish ? 'What You Will Learn' : 'ماذا ستتعلم'}</h3>
                            {renderList(allLearningOutcomes.length > 0 ? allLearningOutcomes : course.learning_objectives || { en: [isEnglish ? 'Core concepts and practical skills' : 'المفاهيم الأساسية والمهارات العملية'], ar: ['المفاهيم الأساسية والمهارات العملية'] })}
                        </div>
                        <div className="program-card">
                            <div className="program-icon">👥</div>
                            <h3>{isEnglish ? 'Who Is This For' : 'من هو هذا الكورس עבור'}</h3>
                            <p>{targetAudience}</p>
                        </div>
                        <div className="program-card">
                            <div className="program-icon">📋</div>
                            <h3>{isEnglish ? 'Prerequisites' : 'المتطلبات المسبقة'}</h3>
                            {renderList(prerequisites)}
                        </div>
                        <div className="program-card">
                            <div className="program-icon">🛠️</div>
                            <h3>{isEnglish ? 'Skills You Will Acquire' : 'المهارات التي ستكتسبها'}</h3>
                            {renderList(allTechnologies.size > 0 ? Array.from(allTechnologies) : course.technologies || [])}
                        </div>
                        <div className="program-card">
                            <div className="program-icon">💡</div>
                            <h3>{isEnglish ? 'Why This Course' : 'لماذا هذا الكورس'}</h3>
                            <p>
                                {isEnglish
                                    ? 'Hands-on learning with real projects, expert guidance, and a structured curriculum that takes you from fundamentals to advanced topics.'
                                    : 'تعلم عملي مع مشاريع حقيقية، وإرشاد من خبراء، ومنهج منظم يأخذك من الأساسيات إلى الموضوعات المتقدمة.'}
                            </p>
                        </div>
                    </div>
                </section>

                {/* ========== SECTION C: LEARNING ROADMAP ========== */}
                <section className="learning-roadmap">
                    <div className="roadmap-header">
                        <h2>{isEnglish ? 'Learning Roadmap' : 'خارطة التعلم'}</h2>
                        <p>{isEnglish ? 'Follow your journey from beginner to advanced through structured modules.' : 'اتبع رحلتك من المبتدئ إلى المتقدم عبر وحدات منظمة.'}</p>
                    </div>
                    <div className="roadmap-timeline">
                        {chapters.map((chapter, index) => {
                            const isOpen = isExpanded(chapter.id);
                            const chapterTools = localizedValue(chapter.tools_and_technologies, language);
                            const chapterOutcomes = localizedValue(chapter.expected_outcomes, language);
                            return (
                                <div key={chapter.id} className="roadmap-module">
                                    <div
                                        className={`roadmap-module-summary ${isOpen ? 'open' : ''}`}
                                        onClick={() => toggleExpand(chapter.id)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === 'Enter' && toggleExpand(chapter.id)}
                                    >
                                        <div className="roadmap-module-number">{index + 1}</div>
                                        <div className="roadmap-module-title">
                                            <span>{isEnglish ? (chapter.title_en || chapter.title || '') : (chapter.title_ar || chapter.titleAr || '')}</span>
                                            <span className="roadmap-module-duration">
                                                {chapter.duration_minutes ? `${chapter.duration_minutes} ${isEnglish ? 'min' : 'دقيقة'}` : ''}
                                            </span>
                                        </div>
                                        <div className="roadmap-module-toggle" />
                                    </div>
                                    {isOpen && (
                                        <div className="roadmap-module-content">
                                            {(chapter.description_en || chapter.description_ar) && (
                                                <p className="roadmap-module-description">
                                                    {isEnglish ? chapter.description_en : chapter.description_ar}
                                                </p>
                                            )}
                                            {chapterTools.length > 0 && (
                                                <div className="roadmap-module-tools">
                                                    <span className="roadmap-section-label">{isEnglish ? 'Tools:' : 'الأدوات:'}</span>
                                                    {chapterTools.map((t, ti) => <span key={ti} className="roadmap-tool-tag">{t}</span>)}
                                                </div>
                                            )}
                                            {chapterOutcomes.length > 0 && (
                                                <div className="roadmap-module-outcomes">
                                                    <span className="roadmap-section-label">{isEnglish ? 'Outcomes:' : 'الناتج المتوقع:'}</span>
                                                    {chapterOutcomes.map((o, oi) => (
                                                        <div key={oi} className="roadmap-outcome-item">
                                                            <span className="roadmap-outcome-check">✓</span>
                                                            <span>{o}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {(chapter.topics?.length || 0) > 0 && (
                                                <div className="roadmap-module-topics">
                                                    <span className="roadmap-section-label">{isEnglish ? 'Topics:' : 'المواضيع:'}</span>
                                                    <ul className="roadmap-topics-list">
                                                        {chapter.topics.map((topic, tIdx) => (
                                                            <li key={topic.id || `topic-${tIdx}`} className="roadmap-topic-item">
                                                                <span className="roadmap-topic-dot" />
                                                                <span>{isEnglish ? (topic.title_en || topic.title || '') : (topic.title_ar || topic.titleAr || '')}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ========== SECTION D: DETAILED CURRICULUM ========== */}
                <section className="detailed-curriculum">
                    <div className="curriculum-header">
                        <h2>{isEnglish ? 'Detailed Curriculum' : 'المنهج التفصيلي'}</h2>
                        <p>{isEnglish ? `${chapters.length} modules with hands-on topics and practical exercises.` : `${chapters.length} وحدة مع مواضيع عملية وتمارين تطبيقية.`}</p>
                    </div>
                    <div className="curriculum-chapters">
                        {chapters.map((chapter, index) => {
                            const isOpen = isExpanded(chapter.id);
                            return (
                                <div key={chapter.id} className={`curriculum-chapter ${isOpen ? 'open' : ''}`}>
                                    <div
                                        className={`curriculum-chapter-summary ${isOpen ? 'open' : ''}`}
                                        onClick={() => toggleExpand(chapter.id)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === 'Enter' && toggleExpand(chapter.id)}
                                    >
                                        <span className="curriculum-chapter-number">{index + 1}</span>
                                        <span className="curriculum-chapter-title">{isEnglish ? (chapter.title_en || chapter.title || '') : (chapter.title_ar || chapter.titleAr || '')}</span>
                                        <span className="curriculum-chapter-arrow" />
                                    </div>
                                    {isOpen && (
                                        <div className="curriculum-chapter-content">
                                            {(chapter.description_en || chapter.description_ar) && (
                                                <p>{isEnglish ? chapter.description_en : chapter.description_ar}</p>
                                            )}
                                            {[
                                                ['learning_objectives', isEnglish ? 'Learning Objectives' : 'أهداف التعلم'],
                                                ['practical_applications', isEnglish ? 'Practical Applications' : 'التطبيقات العملية'],
                                                ['tools_and_technologies', isEnglish ? 'Tools & Technologies' : 'الأدوات والتقنيات'],
                                                ['exercises', isEnglish ? 'Exercises & Assignments' : 'التمارين والمهام'],
                                                ['expected_outcomes', isEnglish ? 'Expected Outcomes' : 'النواتج المتوقعة'],
                                            ].map(([field, label]) => {
                                                const items = localizedValue(chapter[field], language);
                                                return items.length ? (
                                                    <section className="curriculum-section" key={field}>
                                                        <h4>{label}</h4>
                                                        {renderList(chapter[field])}
                                                    </section>
                                                ) : null;
                                            })}
                                            {(chapter.topics?.length || 0) > 0 && (
                                                <div className="curriculum-topics">
                                                    <h4>{isEnglish ? 'Topics in This Module' : 'المواضيع في هذه الوحدة'}</h4>
                                                    <ul className="curriculum-topics-list">
                                                        {chapter.topics.map((topic, tIdx) => (
                                                            <li key={topic.id || `topic-${tIdx}`} className="curriculum-topic-item">
                                                                <span className="curriculum-topic-number">{tIdx + 1}</span>
                                                                <span>{isEnglish ? (topic.title_en || topic.title || '') : (topic.title_ar || topic.titleAr || '')}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ========== SECTION E: TOOLS & TECHNOLOGIES ========== */}
                <section className="tools-technologies">
                    <h2>{isEnglish ? 'Tools & Technologies' : 'الأدوات والتقنيات'}</h2>
                    <p>{isEnglish ? 'Master the tools used in real-world projects throughout this course.' : 'إتقان الأدوات المستخدمة في المشاريع الحقيقية خلال هذا الكورس.'}</p>
                    <div className="tools-grid">
                        {Array.from(allTechnologies).map((tool, idx) => (
                            <div key={idx} className="tool-item">
                                <div className="tool-icon">🛠️</div>
                                <span>{tool}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ========== SECTION F: PRACTICAL PROJECTS ========== */}
                <section className="practical-projects">
                    <h2>{isEnglish ? 'Practical Projects' : 'المشاريع العملية'}</h2>
                    <p>{isEnglish ? 'Apply your skills by building real projects during the course.' : 'طبق مهاراتك ببناء مشاريع حقيقية خلال الكورس.'}</p>
                    <div className="projects-grid">
                        {practicalProjects.length > 0 ? practicalProjects.map((project) => (
                            <article key={project.id} className="project-card">
                                <div className="project-card-header">
                                    <h3>{project.title}</h3>
                                    <span className="project-difficulty">{project.difficulty}</span>
                                </div>
                                <p className="project-description">{project.description}</p>
                                <div className="project-meta">
                                    <span className="project-meta-item">
                                        <span className="project-meta-label">{isEnglish ? 'Skills:' : 'المهارات:'}</span>
                                        {project.skills.map((s, si) => <span key={si} className="project-skill-tag">{s}</span>)}
                                    </span>
                                    <span className="project-meta-item">
                                        <span className="project-meta-label">{isEnglish ? 'Tools:' : 'الأدوات:'}</span>
                                        {project.tools.map((t, ti) => <span key={ti} className="project-skill-tag">{t}</span>)}
                                    </span>
                                </div>
                            </article>
                        )) : (
                            <div className="projects-empty">
                                {isEnglish ? 'No specific projects defined for this course.' : 'لا توجد مشاريع محددة لهذا الكورس.'}
                            </div>
                        )}
                    </div>
                </section>

                {/* ========== SECTION G: LEARNING OUTCOMES ========== */}
                <section className="learning-outcomes">
                    <h2>{isEnglish ? 'Learning Outcomes' : 'نواتج التعلم'}</h2>
                    <p>{isEnglish ? 'By the end of this course, you will be able to:' : 'ب نهاية هذا الكورس، ستكون قادراً على:'}</p>
                    <div className="outcomes-grid">
                        {allLearningOutcomes.length > 0 ? allLearningOutcomes.map((outcome, idx) => (
                            <div key={idx} className="outcome-card">
                                <span className="outcome-number">{idx + 1}</span>
                                <span>{outcome}</span>
                            </div>
                        )) : (
                            <div className="outcome-card">
                                <span className="outcome-number">1</span>
                                <span>{isEnglish ? 'Apply the core concepts of this field in real-world scenarios.' : 'تطبيق المفاهيم الأساسية لهذا المجال في سيناريوهات حقيقية.'}</span>
                            </div>
                        )}
                    </div>
                </section>

                {/* ========== SECTION H: FINAL CTA ========== */}
                <section className="course-final-cta">
                    <div className="cta-content">
                        <div className="cta-info">
                            <h2>{isEnglish ? 'Ready to Start?' : 'مستعد للبدء؟'}</h2>
                            <p>{isEnglish ? 'Join hundreds of students who have transformed their careers with TechSphere.' : 'انضم إلى مئات الطلاب الذين غيروا مساراتهم المهنية مع تك اسفير.'}</p>
                            <div className="cta-price">
                                {course.discount_percentage > 0 && (
                                    <del>{formatCoursePrice(course.original_price, course.currency_code, language)}</del>
                                )}
                                <strong>{formatCoursePrice(course.current_price, course.currency_code, language)}</strong>
                                {course.discount_percentage > 0 && (
                                    <span className="cta-discount">{isEnglish ? `${course.discount_percentage}% OFF` : `خصم ${course.discount_percentage}%`}</span>
                                )}
                            </div>
                            <div className="cta-meta">
                                <span>{course.duration_months ? `${course.duration_months} ${isEnglish ? 'months' : 'أشهر'}` : ''}</span>
                                <span>{difficultyNames[difficulty]}</span>
                            </div>
                        </div>
                        <div className="cta-action">
                            <Link className="cta-enroll" to={`/Payment/${course.routeId || course.id}`}>
                                {isEnglish ? 'Enroll in Course' : 'التحاق بالكورس'}
                            </Link>
                            <Link className="cta-back" to="/Courses">
                                {isEnglish ? 'Browse More Courses' : 'تصفح المزيد من الكورسات'}
                            </Link>
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}

export default CourseDetails;