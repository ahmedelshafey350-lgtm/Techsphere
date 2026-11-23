import './card.css'
import * as React from 'react';
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { motion } from "framer-motion"
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useLanguage } from "../i18n/language";
import { formatCoursePrice, loadPublishedCourses } from "../utils/courses";
import { useEffect } from 'react';
const MotionCard = motion(Card);

function Cardcourses() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [maximumPrice, setMaximumPrice] = useState('');
    const [courseList, setCourseList] = useState([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);
    const [courseLoadError, setCourseLoadError] = useState('');
    const history = useHistory();
    const { language } = useLanguage();
    const isEnglish = language === 'en';
    useEffect(() => {
        let isActive = true;
        loadPublishedCourses()
            .then(({ courses: loadedCourses, usedLegacyFallback }) => {
                if (isActive) {
                    setCourseList(loadedCourses);
                    setCourseLoadError(usedLegacyFallback ? 'legacy-fallback' : '');
                }
            })
            .catch((error) => {
                if (isActive) {
                    setCourseLoadError(error.message);
                    setCourseList([]);
                }
            })
            .finally(() => {
                if (isActive) setIsLoadingCourses(false);
            });
        return () => {
            isActive = false;
        };
    }, []);

    const courses = courseList.filter((course) => {
        const searchText = `${course.name} ${course.description} ${course.nameAr} ${course.descriptionAr}`.toLocaleLowerCase(language);
        const matchesSearch = searchText.includes(search.trim().toLocaleLowerCase(language));
        const matchesCategory = category === 'all' || course.category === category;
        const matchesPrice = maximumPrice === '' || course.price <= Number(maximumPrice);
        return matchesSearch && matchesCategory && matchesPrice;
    });


    function showCourseDetails(id) {
        history.push(`/Courses/${id}`);
    }
    return (


        <div>
            <div className='name'>
                <h2>{isEnglish ? 'Browse courses' : 'تصفح الكورسات'}</h2>
            </div>
            <section className="course-filters" aria-label={isEnglish ? 'Filter courses' : 'تصفية الكورسات'}>
                <label className="course-filter-field">
                    <span>{isEnglish ? 'Search' : 'بحث'}</span>
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={isEnglish ? 'Course name or topic' : 'اسم الكورس أو مجاله'}
                    />
                </label>
                <label className="course-filter-field">
                    <span>{isEnglish ? 'Field' : 'المجال'}</span>
                    <select value={category} onChange={(event) => setCategory(event.target.value)}>
                        <option value="all">{isEnglish ? 'All fields' : 'كل المجالات'}</option>
                        <option value="software">{isEnglish ? 'Software and automation' : 'البرمجيات والأتمتة'}</option>
                        <option value="electronics">{isEnglish ? 'Electronics and PCB' : 'الإلكترونيات وتصميم اللوحات'}</option>
                        <option value="robotics">{isEnglish ? 'Robotics' : 'الروبوتات'}</option>
                    </select>
                </label>
                <label className="course-filter-field">
                    <span>{isEnglish ? 'Maximum price' : 'أقصى سعر'}</span>
                    <select value={maximumPrice} onChange={(event) => setMaximumPrice(event.target.value)}>
                        <option value="">{isEnglish ? 'Any price' : 'كل الأسعار'}</option>
                        <option value="3000">{isEnglish ? 'Up to 3,000' : 'حتى ٣٬٠٠٠'}</option>
                        <option value="4500">{isEnglish ? 'Up to 4,500' : 'حتى ٤٬٥٠٠'}</option>
                        <option value="6000">{isEnglish ? 'Up to 6,000' : 'حتى ٦٬٠٠٠'}</option>
                        <option value="11000">{isEnglish ? 'Up to 11,000' : 'حتى ١١٬٠٠٠'}</option>
                    </select>
                </label>
            </section>
            <div className='Cards courseCards'>
                {!isLoadingCourses && courseLoadError === 'legacy-fallback' && (
                    <p className="course-no-results" role="status">
                        {isEnglish
                            ? 'Showing the existing courses while the Supabase course catalog is unavailable.'
                            : 'نعرض الكورسات الموجودة حاليًا لأن كتالوج Supabase غير متاح.'}
                    </p>
                )}
                {isLoadingCourses ? (
                    <p className="course-no-results" role="status">
                        {isEnglish ? 'Loading courses...' : 'جارٍ تحميل الكورسات...'}
                    </p>
                ) : courseLoadError && courseLoadError !== 'legacy-fallback' ? (
                    <p className="course-no-results" role="status">
                        {isEnglish
                            ? `Could not load courses: ${courseLoadError}`
                            : `تعذر تحميل الكورسات: ${courseLoadError}`}
                    </p>
                ) : courses.length ? courses.map((course) => (
                    <MotionCard key={course.id}
                        className='courseCard'
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, amount: 0.3 }}
                        sx={{ width: '100%', maxWidth: 345 }}>
                            {course.discount_percentage > 0 && (
                                <span
                                    className="course-card-discount-badge"
                                    aria-label={isEnglish
                                        ? `${course.discount_percentage}% discount`
                                        : `خصم ${course.discount_percentage}%`}
                                >
                                    {isEnglish ? `${course.discount_percentage}% OFF` : `خصم ${course.discount_percentage}%`}
                                </span>
                            )}
                            <CardMedia
                                component="img"
                                height="200"
                                image={course.image}
                                alt={isEnglish ? course.name : course.nameAr}
                            />

                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {isEnglish ? course.name : course.nameAr}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    {isEnglish ? course.description : course.descriptionAr}
                                </Typography>
                                <Typography className="course-card-price" variant="body2">
                                    {isEnglish ? 'Price' : 'السعر'}:{' '}
                                    {course.discount_percentage > 0 && (
                                        <del>{formatCoursePrice(course.original_price, course.currency_code, language)}{' '}</del>
                                    )}
                                    {formatCoursePrice(course.current_price, course.currency_code, language)}
                                </Typography>
                            </CardContent>
                            <div className="course-card-actions">
                                <button className="course-details-button" onClick={() => showCourseDetails(course.routeId)}>
                                    {isEnglish ? 'Course details' : 'تفاصيل الكورس'}
                                </button>
                                <button className='btnsubscription' onClick={() => showCourseDetails(course.routeId)}>
                                    {isEnglish ? 'Enroll now' : 'اشترك الآن'}
                                </button>
                            </div>
                        
                    </MotionCard>
                )) : (
                    <p className="course-no-results">
                        {isEnglish ? 'No courses match these filters.' : 'لا توجد كورسات مطابقة لخيارات البحث.'}
                    </p>
                )}
            </div>
        </div>



    )
}

export default Cardcourses
