import './card.css'
import * as React from 'react';
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { motion } from "framer-motion"
import Detalis from './CoursesDetalis'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useLanguage } from "../i18n/language";
const MotionCard = motion(Card);

function Cardcourses() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [maximumPrice, setMaximumPrice] = useState('');
    const history = useHistory();
    const { language } = useLanguage();
    const isEnglish = language === 'en';
    const localizedCourses = {
        0: { name: 'تطوير الواجهات الأمامية', description: 'تعلم HTML وCSS وJavaScript وReact وتصميم مواقع متوافقة مع مختلف الشاشات.' },
        1: { name: 'تطوير الواجهات الخلفية', description: 'تعلم Node.js وExpress.js وواجهات REST API وقواعد البيانات والمصادقة.' },
        2: { name: 'تطوير الواجهات المتكاملة', description: 'أنشئ تطبيقات ويب متكاملة باستخدام تقنيات الواجهات الأمامية والخلفية.' },
        3: { name: 'أتمتة n8n', description: 'تعلم أتمتة سير العمل، وربط واجهات API، وأتمتة العمليات التجارية.' },
        4: { name: 'الإلكترونيات التناظرية', description: 'تعرف على الدوائر التناظرية والثنائيات والترانزستورات ومضخمات العمليات.' },
        5: { name: 'الإلكترونيات الرقمية', description: 'تعلم البوابات المنطقية والجبر البولياني والدوائر الرقمية والأنظمة التتابعية.' },
        6: { name: 'تصميم لوحات الدوائر المطبوعة', description: 'تعلم تصميم المخططات وتخطيط لوحات الدوائر المطبوعة والتوصيلات وتصميم اللوحات.' },
        7: { name: 'الروبوتات', description: 'استكشف أساسيات الروبوتات والمستشعرات والمشغلات وأنظمة التحكم.' },
    };
    const categoryById = {
        0: 'software',
        1: 'software',
        2: 'software',
        3: 'software',
        4: 'electronics',
        5: 'electronics',
        6: 'electronics',
        7: 'robotics',
    };
    const courses = Detalis.filter((course) => {
        const translatedCourse = localizedCourses[course.id];
        const searchText = `${course.name} ${course.description} ${translatedCourse.name} ${translatedCourse.description}`.toLocaleLowerCase(language);
        const matchesSearch = searchText.includes(search.trim().toLocaleLowerCase(language));
        const matchesCategory = category === 'all' || categoryById[course.id] === category;
        const matchesPrice = maximumPrice === '' || course.price <= Number(maximumPrice);
        return matchesSearch && matchesCategory && matchesPrice;
    });


    function getDetalis(id) {
        history.push(`/Payment/${id}`);
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
                {courses.length ? courses.map((course) => (
                    <MotionCard key={course.id}
                        className='courseCard'
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, amount: 0.3 }}
                        sx={{ width: '100%', maxWidth: 345 }}>
                       
                            <CardMedia
                                component="img"
                                height="200"
                                image={course.image}
                                alt={isEnglish ? course.name : localizedCourses[course.id].name}
                            />

                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {isEnglish ? course.name : localizedCourses[course.id].name}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    {isEnglish ? course.description : localizedCourses[course.id].description}
                                </Typography>
                            </CardContent>
                            <button className='btnsubscription' onClick={()=>{getDetalis(course.id)}}>{isEnglish ? 'Enroll now' : 'اشترك الان'}</button>
                        
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
