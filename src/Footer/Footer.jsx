import React from 'react'
import {
    Link
} from "react-router-dom";
import './Footer.css'
import { useLanguage } from "../i18n/language";
function Footer() {
    const { language } = useLanguage();
    const isEnglish = language === 'en';
    return (
        <div className='contentFooter'>
            <div>
                <img src="../../public/Techshpere Orbit Tech Logo.png" alt="" />
                <p>{isEnglish
                    ? 'An educational platform dedicated to offering high-quality technology courses in programming, artificial intelligence, and electronics.'
                    : '   . منصة تعليمية تهدف إلى تقديم أفضل الدورات التقنية في مجالات البرمجة والذكاء الاصطناعي والاكترونيات'}</p>
            </div>
            <div>
                <h2>{isEnglish ? 'Explore' : 'تصفح'}</h2>
                <ul>
                    <li><Link to="/Courses">{isEnglish ? 'Courses' : 'الدورات'}</Link></li>
                    <li><Link>{isEnglish ? 'Register now' : 'سجّل الآن'}</Link></li>
                    <li><Link to="/opinins">{isEnglish ? 'Student reviews' : 'اراء الطلاب'}</Link></li>
                    <li><Link to="/faq">{isEnglish ? 'Frequently asked questions' : 'الأسئلة الشائعة'}</Link></li>
                    <li><Link to="/How">{isEnglish ? 'About us' : 'من نحن'}</Link></li>

                </ul>
            </div>
            <div>
                <h2>{isEnglish ? 'Quick links' : 'روابط سريعة'}</h2>
                <ul>
                    <li><Link >{isEnglish ? 'Our team' : 'فريق العمل'}</Link></li>
                    <li><Link to="/articals">{isEnglish ? 'Articles' : 'المقالات'}</Link></li>
                    <li><Link>{isEnglish ? 'Corporate training' : 'تدريب الشركات'}</Link></li>
                    <li><Link to="/contact">{isEnglish ? 'Contact us' : 'تواصل معنا'}</Link></li>
                    <li><Link to="/policies">{isEnglish ? 'Privacy and policies' : 'الخصوصية والسياسات'}</Link></li>

                </ul>
            </div>
            <div>
                <h2>{isEnglish ? 'Contact us' : 'تواصل معنا'}</h2>
                <ul>
                    <li><Link>+201044348513</Link></li>
                    <li><Link>{isEnglish ? 'Mansoura / in front of Toshka Gate' : 'المنصوره / امام بوابه توشكا'}</Link></li>
                    <li style={{opacity:"0"}}><Link >   1</Link></li>
                    <li style={{ opacity: "0" }}><Link>  1</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default Footer
