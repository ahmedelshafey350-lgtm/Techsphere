import React, { useState } from 'react';
import { Card, Button, Container } from 'react-bootstrap';

import { Home, LibraryBooks, RocketLaunch, PhoneInTalk, CheckCircle } from '@mui/icons-material';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Detalis from '../Cards/CoursesDetalis';
import { useLanguage } from '../i18n/language';
const BookingSuccessCard = ({ bookingData }) => {
    const { id } = useParams();
    const { language } = useLanguage();
    const [Courses, setCourses] = useState(Detalis[0]);
    const courseNamesAr = {
        0: 'تطوير الواجهات الأمامية',
        1: 'تطوير الواجهات الخلفية',
        2: 'تطوير Full-Stack',
        3: 'أتمتة n8n',
        4: 'الإلكترونيات التناظرية',
        5: 'الإلكترونيات الرقمية',
        6: 'تصميم لوحات PCB',
        7: 'الروبوتات',
    };
    useEffect(() => {
        if (id !== undefined) {
            const courseIndex = Number(id);
            if (Number.isInteger(courseIndex) && Detalis[courseIndex]) {
                setCourses(Detalis[courseIndex]);
            }
        }
    }, [id]);
    const data = bookingData || (language === 'en' ? {
        courseTitle: Courses.name,
        mainMessage: 'Enrollment successful!',
        subMessage: 'Thank you! We have received your enrollment request. Our team will contact you shortly to confirm your enrollment.',
        step1: 'Your request has been received',
        step2: 'Our team will call you within 24 hours to confirm your enrollment',
        step3: 'Begin your learning journey with Techsphere',
        footerNote: 'If you have not heard from us within 24 hours, please contact us directly on WhatsApp.',
    } : {
        courseTitle: courseNamesAr[Courses.id] || Courses.name,
        mainMessage: "تم الحجز بنجاح!",
        subMessage: "شكراً لك! تم استلام طلب الحجز بنجاح. سيتواصل معك فريقنا في أقرب وقت لتأكيد الاشتراك.",
        step1: "تم استلام طلبك بنجاح",
        step2: "سيتصل بك فريقنا خلال 24 ساعة لتأكيد الحجز",
        step3: "ابدأ رحلتك التعليمية مع إيراسوفت",
        footerNote: "إذا لم يتواصل معك أحد خلال 24 ساعة، يرجى التواصل معنا مباشرة عبر الواتساب"
    });
    const history = useHistory()
    function getCourse() {
        history.push("/Courses")
    }
    function getHome() {
        history.push("/")
    }
    return (
        <Container
            className="d-flex justify-content-center align-items-center min-vh-100"
            style={{ direction: language === 'en' ? 'ltr' : 'rtl', textAlign: language === 'en' ? 'left' : 'right' }}
        >
            <Card
                className="p-4 shadow-sm border-0 rounded-4 text-center"
                style={{ maxWidth: '550px', width: '100%', backgroundColor: '#ffffff' }}
            >
                <Card.Body className="p-3">

                    <div className="mb-4 d-flex justify-content-center">
                        <div
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: '80px', height: '80px', backgroundColor: '#eef2f7' }}
                        >
                            <CheckCircle style={{ fontSize: '3rem', color: '#1d4ed8' }} />
                        </div>
                    </div>

                    <h3 className="fw-bold text-dark mb-2">
                        {data.mainMessage}
                    </h3>

                    <div className="mb-3">
                        <span
                            className="badge px-3 py-2 rounded-pill fw-normal"
                            style={{ backgroundColor: '#f0f4f9', color: '#1d4ed8', fontSize: '0.9rem' }}
                        >
                            {data.courseTitle}
                        </span>
                    </div>

                    <p className="text-secondary mb-4 fs-6 lh-base px-2">
                        {data.subMessage}
                    </p>

                    <div className="d-flex flex-column gap-2 mb-4">

                        <div
                            className="p-3 rounded-3 d-flex align-items-center gap-3"
                            style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}
                        >
                            <CheckCircle style={{ color: '#10b981', fontSize: '1.3rem' }} />
                            <span className="text-dark fw-medium fs-6">{data.step1}</span>
                        </div>

                        <div
                            className="p-3 rounded-3 d-flex align-items-center gap-3"
                            style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}
                        >
                            <PhoneInTalk style={{ color: '#3b82f6', fontSize: '1.3rem' }} />
                            <span className="text-dark fw-medium fs-6">{data.step2}</span>
                        </div>

                        <div
                            className="p-3 rounded-3 d-flex align-items-center gap-3"
                            style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}
                        >
                            <RocketLaunch style={{ color: '#f59e0b', fontSize: '1.3rem' }} />
                            <span className="text-dark fw-medium fs-6">{data.step3}</span>
                        </div>

                    </div>

                    <div className="d-flex gap-2 justify-content-center mb-4">
                        <Button
                            variant="outline-secondary"
                            className="w-50 py-2 rounded-pill fw-medium d-flex align-items-center justify-content-center gap-2"
                            style={{ borderColor: '#cbd5e1', color: '#475569' }}
                            onClick={() => { getHome() }}
                        >
                            <Home style={{ fontSize: '1.2rem' }} />
                            {language === 'en' ? 'Home' : 'الصفحة الرئيسية'}
                        </Button>

                        <Button
                            variant="primary"
                            className="w-50 py-2 rounded-pill fw-medium d-flex align-items-center justify-content-center gap-2"
                            style={{ backgroundColor: '#1d4ed8', borderColor: '#1d4ed8' }}
                            onClick={() => { getCourse() }}
                        >
                            <LibraryBooks style={{ fontSize: '1.2rem' }} />
                            {language === 'en' ? 'Browse courses' : 'تصفح الكورسات'}
                        </Button>
                    </div>

                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                        {data.footerNote}
                    </div>

                </Card.Body>
            </Card>
        </Container>
    );
};

export default BookingSuccessCard;