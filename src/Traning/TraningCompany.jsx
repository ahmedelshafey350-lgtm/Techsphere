import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import Footer from '../Footer/Footer'
import './Traning.css'
import { useLanguage } from '../i18n/language';
function ContactForm() {
    const [state, handleSubmit] = useForm("xyeepkjj");
    const navigate = useHistory();
    const { language } = useLanguage();
    useEffect(() => {
        if (state.succeeded) {
            navigate.push("/", { replace: true });
        }
    }, [state.succeeded, navigate]);
    return (
        <>
            <div className='HeadTraning'>
                <h2>{language === 'en' ? 'Corporate Training' : 'تدريب الشركات'}</h2>
                <p>{language === 'en' ? 'We provide specialized training solutions tailored to your team. Send us your details and we will contact you to design a training program for your company.' : 'نقدم حلول تدريبية متخصصة تلبي احتياجات فريقك. أرسل بياناتك وسنتواصل معك لتصميم برنامج تدريبي مخصص لشركتك.'}</p>
            </div>
            <div className="flex mt-6  ">
                <div className="image w-2xl flex-1">
                    <img className='w-2xl' src="../../public/image/contact_us.webp" alt="" />
                </div>
                <form className="fs-form w-2xl flex-1 mt-20" onSubmit={handleSubmit}>
                    <div className="fs-field">
                        <label className="fs-label" htmlFor="name">
                            {language === 'en' ? 'Company name' : 'اسم الشركة'}
                        </label>
                        <input className="fs-input" id="name" name="name" required />
                    </div>
                    <div className="fs-field">
                        <label className="fs-label" htmlFor="email">
                            {language === 'en' ? 'Company email' : 'البريد الإلكتروني للشركة'}
                        </label>
                        <input className="fs-input" id="email" name="email" type='email' required />
                        <p className="fs-description">
                            {language === 'en' ? 'We will use this email to respond to your inquiry.' : 'سنستخدم هذا البريد الإلكتروني للرد على استفسارك.'}
                        </p>
                    </div>
                    <ValidationError
                        prefix={language === 'en' ? 'Email' : 'البريد الإلكتروني'}
                        field="email"
                        errors={state.errors}
                    />
                    <div className="fs-field">
                        <label className="fs-label" htmlFor="email">
                            {language === 'en' ? 'Administrator phone number' : 'رقم هاتف مسؤول الشركة'}
                        </label>
                        <input className="fs-input" type='number' id="phone" name="phone" required />
                        <p className="fs-description">
                            {language === 'en' ? 'We will use this phone number to respond to your inquiry.' : 'سنستخدم رقم الهاتف للرد على استفسارك.'}
                        </p>
                    </div>
                    <div className="fs-field">
                        <label className="fs-label" htmlFor="email">
                            {language === 'en' ? 'Number of employees' : 'عدد الموظفين'}
                        </label>
                        <select className="fs-input" type='number' name="phone" id="phone required ">
                            <option value="10">{language === 'en' ? 'Select a range' : 'اختر عدد الموظفين'}</option>
                            <option value="10">1-10</option>
                            <option value="10">11-50</option>
                            <option value="10">51-200</option>
                            <option value="10">{language === 'en' ? 'More than 200' : 'أكثر من 200'}</option>

                        </select>
                        <p className="fs-description">
                            {language === 'en' ? 'Choose the approximate number of employees.' : 'اختر العدد التقريبي للموظفين.'}
                        </p>
                    </div>
                    <div className="fs-field">
                        <label className="fs-label" htmlFor="email">
                            {language === 'en' ? 'Company website' : 'موقع الشركة الإلكتروني'}
                        </label>
                        <input className="fs-input" type='link' id="link" name="link" required />
                        <p className="fs-description">
                            {language === 'en' ? 'Share your company website, if available.' : 'أرسل رابط موقع شركتك إن وُجد.'}
                        </p>
                    </div>
                    <div className="fs-field">
                        <label className="fs-label" htmlFor="message">
                            {language === 'en' ? 'Message' : 'الرسالة'}
                        </label>
                        <textarea
                            className="fs-textarea"
                            id="message"
                            name="message"
                            required
                        />
                        <p className="fs-description">{language === 'en' ? 'What would you like to discuss?' : 'ما الموضوع الذي ترغب في مناقشته؟'}</p>
                    </div>
                    <ValidationError
                        prefix={language === 'en' ? 'Message' : 'الرسالة'}
                        field="message"
                        errors={state.errors}
                    />
                    <div className="fs-button-group">
                        <button className="fs-button" type="submit">
                            {language === 'en' ? 'Submit' : 'إرسال'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}



export default ContactForm;