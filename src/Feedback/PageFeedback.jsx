import React from 'react'
import reviews from './Feedback'
import './feed.css'

import { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useLanguage } from "../i18n/language";
import VerifiedReviews from "./VerifiedReviews";

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

function PageFeedback() {
  const [reviewsCustomer] = useState(reviews);
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  return (
    <section className="reviews-section py-5">
      <Container>
        <VerifiedReviews />
        <div className="text-center mb-5">
          <h2 className="reviews-title">{isEnglish ? 'Student reviews and experiences' : 'آراء وتجارب الطلاب'}</h2>
          <p className="reviews-subtitle">
            {isEnglish ? 'Learning experiences and course reviews' : 'تجارب تعليمية ومراجعات عن الكورسات'}
          </p>
        </div>

        <Row className="g-4">
          {reviewsCustomer.slice(15,29).map((review) => (
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
  );
}



export default PageFeedback
