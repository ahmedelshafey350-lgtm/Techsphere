import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/language';

function RoadmapErrorUI() {
    const { language } = useLanguage();
    const isEnglish = language === 'en';

    return (
        <section className="rm-roadmap-page rm-error">
            <h1 className="rm-page-title">
                {isEnglish ? 'Something went wrong' : 'حدث خطأ'}
            </h1>
            <p className="rm-page-desc">
                {isEnglish
                    ? 'The roadmap page encountered an error. Please try again.'
                    : 'واجهت صفحة خارطة الطريق خطأ. يرجى المحاولة مرة أخرى.'}
            </p>
            <Link to="/roadmaps" className="rm-course-button">
                {isEnglish ? 'Back to Roadmaps' : 'العودة إلى خارطات التعلم'}
            </Link>
        </section>
    );
}

export default class RoadmapErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error(
            '[RoadmapErrorBoundary] Caught an error:',
            error,
            errorInfo
        );
    }

    render() {
        if (this.state.hasError) {
            return <RoadmapErrorUI />;
        }

        return this.props.children;
    }
}
