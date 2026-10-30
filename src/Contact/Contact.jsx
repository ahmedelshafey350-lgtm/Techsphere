import React from 'react'
import '../About/About.css'
import { useForm, ValidationError } from "@formspree/react";
import './Contact.css'
import Footer from '../Footer/Footer'
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "../i18n/language";
function Contact() {
    const { language } = useLanguage();
    const isEnglish = language === 'en';
    const [state, handleSubmit] = useForm("xppplznw");
    const navigate = useHistory();
    useEffect(() => {
        if (state.succeeded) {
            navigate.push("/", { replace: true });
        }
    }, [state.succeeded, navigate]);
   
    return (
        <>
            <div className='contentAbout2'>
                <div className='ggg'>
                    <h1>{isEnglish ? 'Start with a question—it could be the first step toward your future' : 'ابدأ بسؤال - وقد تكون هذه أول خطوة في مستقبلك '}</h1>
                    <p>{isEnglish
                        ? 'Choosing a technology path can feel overwhelming, but you are not alone. Contact the TechSphere team and we will help you understand your options and choose the training program that suits your level and career goals.'
                        : 'اختيار مسارك التقني قد يكون خطوة محيرة، لكنك لست وحدك. تواصل مع فريق تك اسفير، وسنساعدك على فهم الخيارات المتاحة، واختيار البرنامج التدريبي الذي يناسب مستواك وهدفك المهني.'}</p>
                </div>

            </div>
            <div className="flex mt-6  ">
                <div className="image w-2xl flex-1">
                    <img className='w-2xl' src="../../public/image/contact_us.webp" alt="" />
                </div>
                <form className="fs-form w-2xl flex-1 mt-20" onSubmit={handleSubmit}>
                    <div className="fs-field">
                        <label className="fs-label" htmlFor="name">
                            {isEnglish ? 'Your name' : 'الاسم'}
                        </label>
                        <input className="fs-input" id="name" name="name" required />
                    </div>
                    <div className="fs-field">
                        <label className="fs-label" htmlFor="email">
                            {isEnglish ? 'Email' : 'البريد الإلكتروني'}
                        </label>
                        <input className="fs-input" id="email" name="email" type='email' required />
                        <p className="fs-description">
                            {isEnglish ? 'We will use this email address to respond to your inquiry.' : 'سيساعدنا ذلك على الرد على استفسارك عبر البريد الإلكتروني.'}
                        </p>
                    </div>
                    <ValidationError
                        prefix={isEnglish ? 'Email' : 'البريد الإلكتروني'}
                        field="email"
                        errors={state.errors}
                    />
                    <div className="fs-field">
                        <label className="fs-label" htmlFor="email">
                            {isEnglish ? 'Phone' : 'رقم الهاتف'}
                        </label>
                        <input className="fs-input" type='number' id="phone" name="phone" required />
                        <p className="fs-description">
                            {isEnglish ? 'We will use this phone number to respond to your inquiry.' : 'سيساعدنا ذلك على الرد على استفسارك عبر رقم الهاتف.'}
                        </p>
                    </div>
                    <div className="fs-field">
                        <label className="fs-label" htmlFor="message">
                            {isEnglish ? 'Message' : 'الرسالة'}
                        </label>
                        <textarea
                            className="fs-textarea"
                            id="message"
                            name="message"
                            required
                        />
                        <p className="fs-description">{isEnglish ? 'What would you like to discuss?' : 'ما الموضوع الذي تود مناقشته؟'}</p>
                    </div>
                    <ValidationError
                        prefix={isEnglish ? 'Message' : 'الرسالة'}
                        field="message"
                        errors={state.errors}
                    />
                    <div className="fs-button-group">
                        <button className="fs-button" type="submit">
                            {isEnglish ? 'Submit' : 'إرسال'}
                        </button>
                    </div>
                </form>
            </div>
            <Footer />

        </>

    )
}

export default Contact

// Make sure to run npm install @formspree/react
// For more help visit https://formspr.ee/react-help
