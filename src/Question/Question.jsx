import React from 'react'
import './Question.css'
import { useState } from 'react'
import { useLanguage } from "../i18n/language";
function Question() {
    const { language } = useLanguage();
    const isEnglish = language === 'en';
    const [status1, setstatus1] = useState(false)
    const [status2, setstatus2] = useState(false)
    const [status3, setstatus3] = useState(false)
    function getp1() {
        setstatus1(status1 == true ? false : true)
    }
    function getp2() {
        setstatus2(status2 == true ? false : true)
    }
    function getp3() {
        setstatus3(status3 == true ? false : true)
    }

    return (
        <div className='contentQuestion'>
            <div className='NameHead'>
                <h2>{isEnglish ? 'Frequently asked questions' : 'الاسئله الشائعه'}</h2>
            </div>
            <div className='Steps'>
                <div onClick={() => { getp1() }}>
                    <h4>{isEnglish ? 'How can I enroll in a course?' : 'كيف يمكنني التسجيل في الدورات؟ '}</h4>
                    <p style={{ display: status1 ? "block" : "none" }}>{isEnglish ? 'Choose the course you want, click “Enroll now,” and follow the steps.' : 'يمكنك التسجيل عبر اختيار الدورة التي ترغب بها ثم الضغط على زر "سجل الآن" واتباع الخطوات.'}</p>
                </div>
                <div onClick={() => { getp2() }}>
                    <h4>{isEnglish ? 'Are certificates awarded?' : 'هل توجد شهادات معتمدة؟'}</h4>
                    <p style={{ display: status2 ? "block" : "none" }}>{isEnglish ? 'Yes. Each trainee receives a certificate of completion after successfully completing the capstone project and required assignments.' : 'نعم، يحصل كل متدرب على شهادة إتمام بعد النجاح في مشروع التخرج والمهام المطلوبة.'}</p>
                </div>
                <div onClick={() => { getp3() }}>
                    <h4>{isEnglish ? 'What payment methods are available?' : 'ما هي طرق الدفع المتاحة؟'}</h4>
                    <p style={{ display: status3 ? "block" : "none" }}>{isEnglish ? 'We accept cash, Visa, Vodafone Cash, and bank transfers.' : 'نقبل الدفع النقدي، فيزا، فودافون كاش، والتحويلات البنكية.'}</p>
                </div>
            </div>
        </div>
    )
}

export default Question
