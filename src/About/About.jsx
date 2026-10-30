import React from 'react'
import '../Feedback/Feed.css'


import './About.css'
import Footer from "../Footer/Footer"
import Who_us from '../Whous/Who_us'
import { useLanguage } from "../i18n/language";
function About() {
    const { language } = useLanguage();
    const isEnglish = language === 'en';

    return (

        <>
            <div className='contentAbout2'>
                <div className='ggg'>
                    <h1>{isEnglish ? 'Who is TechSphere?' : <>من هي <bdi dir="ltr">Techsphere</bdi>؟</>}</h1>
                    <p>{isEnglish
                        ? 'At TechSphere, we do more than offer training courses—we build a complete learning journey that starts with acquiring skills and continues through hands-on practice and genuine preparation for careers in programming, technology, artificial intelligence, and electronics.'
                        : 'في  تك اسفير لا نقدّم دورات تدريبية فحسب، بل نبني رحلة تعليمية متكاملة تبدأ من اكتساب المهارة، وتمتد إلى التطبيق العملي والاستعداد الحقيقي لسوق العمل في مجالات البرمجة والتكنولوجيا والذكاء الاصطناعي والالكترونيات.'}</p>
                </div>
            </div>
            <Who_us/>
            <Footer />
        </>
    )
}

export default About
