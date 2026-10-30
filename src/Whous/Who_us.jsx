import React from 'react'
import './Who.css'
import { useLanguage } from "../i18n/language";
function Who_us() {
    const { language } = useLanguage();
    const isEnglish = language === 'en';
    return (
        <div className='ContentAbout'>
            <div className='NameAbout'>
                <h2>{isEnglish ? 'About TechSphere' : <>ماذا عن <bdi dir="ltr">TechSphere</bdi></>}</h2>
            </div>
            <div className='About'>
                <div className="twoimage">
                    <img src="../../public/image/about_one.webp" alt="" />
                    <img src="../../public/image/about_two.webp" alt="" />
                </div>
                <div className='WordAbout'>
                    <div>
                        <h2>{isEnglish ? 'About TechSphere' : <>عن <bdi dir="ltr">TechSphere</bdi></>}</h2>
                    </div>
                    <div>
                        <p>{isEnglish
                            ? 'TechSphere specializes in advanced software solutions and professional technology training. Founded to help individuals and businesses keep pace with rapid developments in programming, computer science, electronics, and artificial intelligence, we believe hands-on experience is the foundation of expertise. Our practical training and development programs help prepare qualified professionals who can compete in the job market.'
                            : <>هي شركة متخصصة في تقديم الحلول البرمجية المتقدمة والتدريب التقني الاحترافي، تأسست بهدف تمكين الأفراد والشركات من مواكبة التطور السريع في مجالات البرمجة وعلوم الحاسوب والإلكترونيات والذكاء الاصطناعي. نعتمد في <bdi dir="ltr">TechSphere</bdi> على رؤية واضحة تقوم على أن التجربة العملية هي الأساس الحقيقي للاحتراف، لذلك نحرص على تقديم برامج تدريبية وتطويرية تعتمد على التطبيق الفعلي، بما يساهم في إعداد كوادر مؤهلة وقادرة على المنافسة بقوة في سوق العمل.</>}</p>
                    </div>
                </div>
            </div>
            <div className="moredetalis">
                <div className="moreimage">
                    <div>
                        <img src="../../public/image/about_slide_one.webp" alt="" />
                    </div>
                    <div>
                        <img src="../../public/image/about_slide_one.webp" alt="" />
                        <img src="../../public/image/about_slide_two.webp" alt="" />
                        <img src="../../public/image/about_slide_three.webp" alt="" />
                        <img src="../../public/image/about_slide_four.webp" alt="" />
                    </div>
                </div>
                <div className="contentTraniar">
                    <div>
                        <h2>{isEnglish ? 'Practical training content' : 'محتوى تدريبي عملي'}</h2>
                        <p>{isEnglish ? 'Our courses emphasize hands-on practice so you gain real skills you can use directly in the job market.' : 'نقدم دورات تعتمد على التطبيق الفعلي لضمان اكتساب مهارات حقيقية يمكن استخدامها مباشرة في سوق العمل.'}</p>
                    </div>
                    <div>
                        <h2>{isEnglish ? 'Experienced professional instructors' : 'مدربون بخبرة احترافية'}</h2>
                        <p>{isEnglish ? 'Our courses are taught by expert instructors with practical experience in their respective fields.' : 'يتم تقديم الكورسات بواسطة نخبة من المتخصصين ذوي الخبرة العملية في مجالاتهم المختلفة.'}</p>
                    </div>
                    <div>
                        <h2>{isEnglish ? 'Comprehensive learning paths' : 'مسارات تعليمية متكاملة'}</h2>
                        <p>{isEnglish ? 'We offer structured training programs that guide you from beginner to professional level, step by step.' : 'نوفر برامج تدريبية منظمة تساعدك على التدرج من المستوى المبتدئ إلى الاحترافي بخطوات واضحة.'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Who_us
