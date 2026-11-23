import React from 'react'
import './contactus.css'
import { useLanguage } from "../i18n/language";
import { publicAsset } from "../utils/publicAsset.js";
function Contact() {
    const { language } = useLanguage();
    const isEnglish = language === 'en';

    return (
        <main className="contactus-page" dir={isEnglish ? "ltr" : "rtl"}>
        <div className='Contactus'>
            <div className='Namecontact'>
                <h1>{isEnglish ? 'Contact us' : 'تواصل معنا'}</h1>
            </div>
            <div className='detalis'>
                <div>
                    <h2>{isEnglish ? 'Your future starts with a question' : 'مستقبلك يبدأ بسؤال'}</h2>
                    <h2>
                        {isEnglish ? 'Contact us today, and let us help you choose the right path.' : 'تواصل معنا الآن ودعنا نساعدك في اختيار المسار الصحيح.'}</h2>
                    <button>{isEnglish ? 'Contact us now' : 'تواصل معنا الان'}</button>
                </div>
                <div>
                    <img src={publicAsset('image/mob_frame.webp')} alt="" />
                    <img src={publicAsset('image/mon_person.webp')} alt="" />
                </div>
                <div className='arabic'>
                    <img src={publicAsset('image/arabic_shape.webp')} alt="" />
                </div>
            </div>
           
        </div>
        </main>
    )
}

export default Contact
