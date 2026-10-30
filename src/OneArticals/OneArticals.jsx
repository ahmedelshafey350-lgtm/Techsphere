
import React, { useState } from 'react';
import { Container, Row, Col, Badge, Alert } from 'react-bootstrap';
import {  Card, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Detalis from '../Artcalis/Detalis';
import { CheckCircle } from '@mui/icons-material';
import articleData, { articleDataEn } from './Ten';
import Footer from '../Footer/Footer';
import { useLanguage } from '../i18n/language';
const CourseBannerCard = () => {
    const { id } = useParams();
    const { language } = useLanguage();
    const Data = Detalis.find((article) => String(article.id) === id);
    const ArticleDataSource = articleData.find((article) => String(article.id) === id);
    const ArticleDataTranslation = articleDataEn[Number(id)];
    const ArticleData = language === 'en' && ArticleDataSource && ArticleDataTranslation
        ? {
            ...ArticleDataSource,
            ...ArticleDataTranslation,
            projects: ArticleDataTranslation.projects?.map((project, index) => ({
            ...ArticleDataSource.projects[index],
            ...project,
            })),
            meta: {
                ...ArticleDataSource.meta,
                author: 'Techsphere Team',
                date: 'June 18, 2026',
                views: id === '7' ? '450 views' : '1,167 views',
            },
        }
        : ArticleDataSource;
    const englishArticle = language === 'en';
    // const [ArticleData] = useState(articleData[6])
    if (!Data) {
        return (
            <Container className="py-5" dir={englishArticle ? 'ltr' : 'rtl'}>
                <Alert variant="warning" className={englishArticle ? 'text-start' : 'text-end'}>
                    {englishArticle ? 'The requested article could not be found.' : 'المقال المطلوب غير موجود.'}
                </Alert>
            </Container>
        );
    }

    return (
        <>
            <div
                className="text-white py-5 position-relative overflow-hidden"
                style={{
                    backgroundImage: `linear-gradient(rgba(10, 25, 47, 0.9), rgba(10, 25, 47, 0.9)), url("${Data.image}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    direction: englishArticle ? 'ltr' : 'rtl',
                    textAlign: englishArticle ? 'left' : 'right',
                    borderRadius: '15px',
                    marginTop: '4.5%',
                }}
            >
                <Container className="py-4">
                    <Row className="align-items-center">
                        <Col lg={8} md={12} className="mb-4 mb-lg-0">
                            {Data.category && (
                                <div className="mb-3">
                                    <Badge
                                        bg="primary"
                                        className="px-3 py-2 rounded-pill"
                                        style={{
                                            backgroundColor: '#1d4ed8',
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        {Data.category}
                                    </Badge>
                                </div>
                            )}

                            <h1
                                className="fw-bold mb-3 display-6"
                                style={{ lineHeight: '1.4' }}
                            >
                                {englishArticle ? (Data.titleEn || Data.title) : Data.title}
                            </h1>

                            <p
                                className="text-light opacity-75 mb-4 fs-6"
                                style={{ lineHeight: '1.6' }}
                            >
                                {englishArticle ? (Data.descriptionEn || Data.description) : Data.description}
                            </p>

                            <div className="d-flex flex-wrap gap-4 text-light opacity-75 fs-7 align-items-center">
                                <div className="d-flex align-items-center gap-1">
                                    {Data.meta.authorIcon}
                                    <span>{englishArticle ? (Data.meta.authorEn || Data.meta.author) : Data.meta.author}</span>
                                </div>

                                <div className="d-flex align-items-center gap-1">
                                    {Data.meta.dateIcon}
                                    <span>{englishArticle ? (Data.meta.dateEn || Data.meta.date) : Data.meta.date}</span>
                                </div>

                                <div className="d-flex align-items-center gap-1">
                                    {Data.meta.viewsIcon}
                                    <span>{englishArticle ? (Data.meta.viewsEn || Data.meta.views) : Data.meta.views}</span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div
                className="py-5"
                style={{
                    backgroundColor: '#f8f9fa',
                    direction: englishArticle ? 'ltr' : 'rtl',
                    textAlign: englishArticle ? 'left' : 'right',
                    minHeight: '100vh'
                }}
            >
                <Container>

                    <div
                        className="text-white p-5 mb-5 position-relative overflow-hidden shadow-sm"
                        style={{
                            backgroundImage: `linear-gradient(rgba(10, 25, 47, 0.92), rgba(10, 25, 47, 0.92)), url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '16px'
                        }}
                    >
                        <div className="mb-3">
                            <Badge bg="primary" className="px-3 py-2 ms-2 rounded-pill" style={{ backgroundColor: '#1d4ed8' }}>
                                {ArticleData.category1}
                            </Badge>
                            <Badge bg="secondary" className="px-3 py-2 rounded-pill bg-opacity-50">
                                {ArticleData.category2}
                            </Badge>
                        </div>

                        <h1 className="fw-bold mb-4 display-6" style={{ lineHeight: '1.4' }}>
                            {ArticleData.title}
                        </h1>

                        <div className="d-flex flex-wrap gap-4 text-light opacity-75 fs-7 align-items-center">
                            <div className="d-flex align-items-center gap-1">
                                {ArticleData.meta.authorIcon}
                                <span>{ArticleData.meta.author}</span>
                            </div>
                            <div className="d-flex align-items-center gap-1">
                                {ArticleData.meta.dateIcon}
                                <span>{ArticleData.meta.date}</span>
                            </div>
                            <div className="d-flex align-items-center gap-1">
                                {ArticleData.meta.viewsIcon}
                                <span>{ArticleData.meta.views}</span>
                            </div>
                        </div>
                    </div>

                    <Card className="border-0 shadow-sm p-4 mb-4 rounded-4">
                        <h2 className="fw-bold text-dark mb-3 fs-3 border-bottom pb-2">
                            {ArticleData.introTitle}
                        </h2>
                        <p className="text-secondary fs-6 lh-lg m-0">
                            {ArticleData.introText}
                        </p>
                    </Card>

                    <Card className="border-0 shadow-sm p-4 mb-5 rounded-4">
                        <h2 className="fw-bold text-dark mb-3 fs-3 border-bottom pb-2">
                            {ArticleData.howToChooseTitle}
                        </h2>
                        <p className="text-secondary fs-6 mb-3">
                            {ArticleData.howToChooseSubtitle}
                        </p>
                        <ListGroup variant="flush" className="mb-4">
                            {ArticleData.skillsList.map((skill, index) => (
                                <ListGroup.Item key={index} className="bg-transparent border-0 py-2 d-flex align-items-start gap-2">
                                    <CheckCircle color="primary" style={{ fontSize: '1.2rem', marginTop: '4px' }} />
                                    <span className="text-secondary">{skill}</span>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        <div className="p-3 rounded-3 border-start border-primary border-4 bg-light text-dark fw-medium">
                            {ArticleData.goldenTip}
                        </div>
                    </Card>

                   

                    <Row className="g-4 mb-5">
                        {ArticleData.projects.map((proj) => (
                            <Col lg={6} md={12} key={proj.id}>
                                <Card className="h-100 border-0 shadow-sm p-3 rounded-4 hover-shadow transition">
                                    <Card.Body>
                                        <div className="d-flex align-items-center gap-2 mb-3">
                                            <span className="badge bg-primary rounded-circle p-2 fs-6" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {proj.id}
                                            </span>
                                            <Card.Title className="fw-bold text-dark m-0 fs-5">
                                                {proj.title}
                                            </Card.Title>
                                        </div>
                                        <Card.Text className="text-secondary mb-3">
                                            {proj.desc}
                                        </Card.Text>
                                        <div className="mb-2">
                                            <strong className="text-dark d-block mb-1">{englishArticle ? 'Project components:' : 'مكونات المشروع:'}</strong>
                                            <span className="text-muted small">{proj.components}</span>
                                        </div>
                                        <div>
                                            <strong className="text-dark d-block mb-1">{englishArticle ? 'Skills demonstrated:' : 'المهارات التي يثبتها:'}</strong>
                                            <span className="text-primary small fw-medium">{proj.skills}</span>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* قسم كيف تعرض مشاريعك */}
                    <Card className="border-0 shadow-sm p-4 mb-4 rounded-4">
                        <h2 className="fw-bold text-dark mb-3 fs-3 border-bottom pb-2">
                            {ArticleData.howToPresentTitle}
                        </h2>
                        <p className="text-secondary fs-6 mb-3">
                            {ArticleData.howToPresentText}
                        </p>
                        <ListGroup variant="flush">
                            {ArticleData.presentationSteps.map((step, index) => (
                                <ListGroup.Item key={index} className="bg-transparent border-0 py-2 d-flex align-items-start gap-2">
                                    <span className="text-primary fw-bold">•</span>
                                    <span className="text-secondary">{step}</span>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>

                    {/* قسم الخلاصة */}
                    <Card className="border-0 shadow-sm p-4 rounded-4 bg-dark text-white">
                        <h2 className="fw-bold mb-3 fs-3 text-warning border-bottom border-secondary pb-2">
                            {ArticleData.conclusionTitle}
                        </h2>
                        <p className="fs-6 lh-lg m-0 opacity-90">
                            {ArticleData.conclusionText}
                        </p>
                    </Card>

                </Container>
            </div>
            <Footer/>
        </>
    );
};

export default CourseBannerCard;
