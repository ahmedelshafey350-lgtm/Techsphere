import React from 'react'
import reviews from '../Feedback/Feedback'
import '../Feedback/Feed.css'

import { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import '../About/About.css'
import Footer from "../Footer/Footer"
import { useLanguage } from "../i18n/language";
import VerifiedReviews from "../Feedback/VerifiedReviews";
const arabicCourseNames = {
    "Front-End Development": "تطوير الواجهات الأمامية",
    "Back-End Development": "تطوير الواجهات الخلفية",
    "Full-Stack Development": "تطوير الواجهات المتكاملة",
    "Analog Electronics": "الإلكترونيات التناظرية",
    "Digital Electronics": "الإلكترونيات الرقمية",
    "PCB Design": "تصميم لوحات الدوائر المطبوعة",
    "n8n Automation": "أتمتة n8n",
    Robotics: "الروبوتات",
};
function Review() {
    const [reviewsCustomer] = useState(reviews);
    const { language } = useLanguage();
    const isEnglish = language === 'en';
    
    return (

        <>
            <div className='contentAbout2'>
                <div className='ggg'>
                    <h1>{isEnglish ? 'Our students’ stories: success worth sharing' : 'قصص طلابنا - نجاح يُروى بثقة'}</h1>
                    <p>{isEnglish
                        ? 'At TechSphere, learning does not end with a diploma—it marks the beginning of new steps toward professional growth. Here, we share our students’ inspiring feedback and experiences, and how knowledge and hands-on training helped them move closer to their goals with confidence.'
                        : 'في تك اسفير، لا تنتهي رحلة التعلّم بانتهاء الدبلومة ، بل تبدأ معها خطوات جديدة نحو التطور المهني. هنا نشارك آراء طلابنا وتجاربهم الملهمة، وكيف ساعدتهم المعرفة والتدريب العملي على الاقتراب من أهدافهم بثقة.'}</p>
                </div>
            </div>
            <section className="reviews-section py-5">
                <Container>
                    <VerifiedReviews />

                    <Row className="g-4">
                        {reviewsCustomer.map((review) => (
                            <Col key={review.id} xs={12} md={6} lg={4}>
                                <Card className="review-card h-100">
                                    <Card.Body>
                                        <div className="d-flex align-items-center gap-3 mb-3">
                                            <div className="review-avatar">
                                                {(isEnglish ? review.nameEn : review.name).trim().charAt(0)}
                                            </div>

                                            <div>
                                                <h5 className="review-name mb-1">
                                                    {isEnglish ? review.nameEn : review.name}
                                                </h5>

                                                <div
                                                    className="review-stars"
                                                    aria-label={isEnglish ? '5 out of 5 stars' : '5 من 5 نجوم'}
                                                >
                                                    ★★★★★
                                                </div>
                                            </div>
                                        </div>

                                        <p className="review-feedback">
                                            {isEnglish ? review.commentEn : review.comment}
                                        </p>

                                        <div className="review-course">
                                            {isEnglish ? review.course : arabicCourseNames[review.course] || review.course}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                       
                    </Row>
                </Container>
            </section>
            <Footer />
        </>
    )
}

export default Review
