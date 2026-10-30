import React, { useEffect, useState } from 'react'
import {

    KeyboardBackspaceOutlined,

} from '@mui/icons-material';
import DetalisFile from './DetalisFile'
import { div } from 'framer-motion/client';
import './education.css'
import { Container, Row, Col, Badge } from 'react-bootstrap';
import Footer from '../Footer/Footer'
import { useLanguage } from '../i18n/language';
function Education() {
    const [detalis] = useState(DetalisFile);
    const [Inner, SetInner] = useState(detalis[0])
    const [ActiveButton, SetActiveButton] = useState(null);
    const { language } = useLanguage();
    const getText = (key) => language === 'en' ? (Inner[`${key}En`] || Inner[key]) : Inner[key];
    useEffect(() => {
        console.log(Inner);


    }, [])
    function getinfo(id) {
        SetInner(detalis[id])
    }

    return (
        <>
            <div className='contentAbout2'>
                <div className='ggg'>
                    <h1>{language === 'en' ? 'The Learning Journey' : ' الرحلة التعليمية'}</h1>
                    <p>{language === 'en' ? 'A complete learning journey, thoughtfully designed for you. From the first lecture, we support you every step of the way as you learn, practice hands-on, and build real projects. With ongoing guidance, you will be ready to enter the job market with confidence.' : 'رحلة تعليمية متكاملة، مصممة بعناية ليك و من أول محاضرة وإحنا معاك في كل خطوة، هتتعلم، وتطبق بإيدك، وتنفذ مشاريع حقيقية، و مع المتابعة المستمرة هتبقى جاهز تدخل سوق العمل بثقة.'}</p>
                </div>
            </div>
            <div className='Section2'>
                <div className='HeadName'>
                    <h2>{language === 'en' ? 'Learning Journey Roadmap' : 'مخطط الرحلة التعليمية'}</h2>
                </div>
                <div className='Sketch'>
                    {detalis.map((info) => (
                        <div className={`${ActiveButton == info.id ? " opacity-100 scale-125" : " opacity-25 scale-100"}`}
                            key={info.id} onClick={() => { getinfo(info.id), SetActiveButton(info.id) }}>
                            <span>{info.icon}</span>
                            <h6>
                                {language === 'en' ? (info.TitleEn || info.Title) : info.Title}
                            </h6>
                        </div>
                    ))}

                </div>
            </div>
            <Container dir={language === 'en' ? 'ltr' : 'rtl'} className="my-5">
                <div
                    className="p-4 p-md-5 rounded-4 text-white position-relative shadow-lg"
                    style={{ backgroundColor: '#1A3688' }} // اللون الأزرق الداكن الخلفي
                >
                    {/* شارة الهيدر العلوي */}
                    <div className="d-flex justify-content-end mb-4">
                        <div
                            className="bg-white text-dark fw-bold px-4 py-2 rounded-3 d-flex align-items-center gap-2 shadow-sm"
                            style={{ fontSize: '1.2rem', color: '#1A3688' }}
                        >
                            <span>{getText('Title')} </span>
                            <span
                                className="d-inline-block rounded-pill"
                                style={{ width: '6px', height: '24px', backgroundColor: '#FFC107' }}
                            ></span>
                        </div>
                    </div>

                    <Row className="align-items-center gy-4">
                        <Col lg={4} className="d-flex justify-content-center">
                            <div
                                className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                style={{
                                    width: '220px',
                                    height: '220px',
                                    backgroundColor: '#2E489E',
                                    border: '2px solid rgba(255, 255, 255, 0.1)'
                                }}
                            >
                                {Inner.icon}
                            </div>
                        </Col>

                        {/* الجانب الأيسر: النصوص والقائمة */}
                        <Col lg={8}>
                            {/* العنوان الرئيسي */}
                            <h2 className="fw-bold mb-4" style={{ color: '#FFC107', fontSize: '2rem' }}>
                                {getText('Head')}
                            </h2>

                            {/* القائمة النقاطية */}
                            <ul className="list-unstyled custom-list text-white-50" style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
                                <li className="mb-3 d-flex align-items-start gap-2 text-white">
                                    <span className="bullet-square me-2">■</span>
                                    <span>{getText('description1')}</span>
                                </li>
                                <li className="mb-3 d-flex align-items-start gap-2 text-white">
                                    <span className="bullet-square me-2">■</span>
                                    <span> {getText('description2')} </span>
                                </li>
                                <li className="mb-3 d-flex align-items-start gap-2 text-white">
                                    <span className="bullet-square me-2">■</span>
                                    <span> {getText('description3')} </span>
                                </li>
                                <li className="mb-3 d-flex align-items-start gap-2 text-white">
                                    <span className="bullet-square me-2">■</span>
                                    <span> {getText('description4')} </span>
                                </li>
                                <li className="mb-3 d-flex align-items-start gap-2 text-white">
                                    <span className="bullet-square me-2">■</span>
                                    <span> {getText('description5')} </span>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                </div>
            </Container>
            <Footer/>
        </>
    )
}

export default Education
