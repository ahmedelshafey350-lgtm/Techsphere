import './intro.css'
import PersonIconModul from '@mui/icons-material/Person';
const PersonIcon = PersonIconModul.default;
import ImportContactsOutlinedIconModule from '@mui/icons-material/ImportContactsOutlined';
import { useEffect, useState } from 'react';
import {
    Link
} from "react-router-dom";
import { useLanguage } from "../i18n/language";
const ImportContactsOutlinedIcon = ImportContactsOutlinedIconModule.default;
function Intro() {
    const { language } = useLanguage();
    const isEnglish = language === 'en';
    const [user1 , setuser1] = useState(0)
    const [user2 , setuser2] = useState(0)
    const [user3 , setuser3] = useState(0)
    useEffect(() => {
        const Delsetinterval1 = setInterval(() => {
            setuser1((prev)=>Math.min(prev+1,10))
        }, 100)
        if (user1 >= 10) {
            clearInterval(Delsetinterval1);
        }
        const Delsetinterval2 = setInterval(() => {
            setuser2((prev)=>Math.min(prev+1,600))
        }, 10)
        if (user2 >= 10) {
            clearInterval(Delsetinterval2);
        }
        const Delsetinterval3 = setInterval(() => {
            setuser3((prev)=>Math.min(prev+1,10))
        }, 100)
        if (user3 >= 10) {
            clearInterval(Delsetinterval3);
        }
    },[])


    return (
        <>
            <div className="content2">
                <div className="image">
                    <img src="../../public/image/new_hero.webp" alt="" />
                </div>
                <div className="intro">
                    <div className='head'>
                        <h1>{isEnglish
                            ? 'Your first step toward success starts with TechSphere'
                            : <>خطوتك الأولى نحو النجاح تبدأ مع <bdi className="hero-brand">TechSphere</bdi></>}</h1>
                    </div>
                    <div className='parg'>
                        <p>{isEnglish
                            ? 'Start your journey in programming, data analysis, and artificial intelligence with specialized learning paths and hands-on projects that prepare you for the job market.'
                            : 'ابدأ رحلتك في البرمجة، تحليل البيانات، والذكاء الاصطناعي مع مسارات تعليمية متخصصة ومشاريع عملية تؤهلك لسوق العمل.'}</p>
                    </div>
                    <div className='hahtag'>
                        <span>{isEnglish ? '#WeHelpYouReachYourDream' : 'بنساعدك_توصل_لحلمك#'}</span>
                    </div>
                    <div className='btn'>
                        <button  >  <Link to="/Courses">{isEnglish ? 'Start learning now' : ' ابدا التعلم الان '}</Link> </button>
                        <button>< Link to="/traning/company">{isEnglish ? 'Corporate training' : 'تدريب الشركات'}</Link></button>
                        <button>< Link to="/traning/induvial">{isEnglish ? 'Individual training' : 'تدريب الافراد'}</Link></button>
                    </div>
                    <div className='clasified'>
                        <div>
                            <PersonIcon className="icon5" />
                            <div>
                                <span>+{user1}</span>
                                <span>{isEnglish ? 'Instructors' : 'مدرب'}</span>
                            </div>
                        </div>
                        <div>
                            <PersonIcon className="icon5" />
                            <div>
                                <span>+{user2}</span>
                                <span>{isEnglish ? 'Active students' : 'طالب نشط'}</span>
                            </div>
                        </div>
                        <div>
                            < ImportContactsOutlinedIcon className="icon5" />
                            <div>
                                <span>+{user3}</span>
                                <span>{isEnglish ? 'Courses' : 'كورس'}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Intro
