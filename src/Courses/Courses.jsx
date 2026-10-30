import React from 'react'
import '../About/About.css'
import Cardcourses from '../Cards/Card'
import Footer from '../Footer/Footer'
import { useLanguage } from "../i18n/language";

function Courses() {
    const { language } = useLanguage();
    const isEnglish = language === 'en';
    return (
        <>
            <div className='contentAbout2'>
                <div className='ggg'>
                    <h1>{isEnglish ? 'Our diplomas at TechSphere' : <>دبلوماتنا في <bdi dir="ltr">Techsphere</bdi></>}</h1>
                    <p>{isEnglish
                        ? 'At TechSphere, we offer detailed learning content and take you on a hands-on journey from the fundamentals to building real projects that demonstrate your skills and open up stronger opportunities in technology.'
                        : 'في  تك اسفير نقدم لك محتوى تعليمي مفصل و ناخذك في رحلة عملية تبدأ من الأساسيات، وتصل بك إلى تنفيذ مشروعات حقيقية تعكس مهاراتك وتفتح أمامك فرصًا أقوى في عالم التكنولوجيا.'}</p>
                </div>

            </div>
            <Cardcourses />
            <Footer/>
        </>

    )
}

export default Courses
