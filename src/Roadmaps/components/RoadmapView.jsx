import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/language';
import { tracks } from '../index';
import { frontend, backend, fullstack, n8nAiAutomation, digitalElectronics, analogElectronics } from '../data/index';
import RoadmapDiagram from './RoadmapDiagram';
import RoadmapErrorBoundary from './RoadmapErrorBoundary';
import '../Roadmaps.css';

const trackData = {
    frontend,
    backend,
    fullstack,
    'n8n-ai-automation': n8nAiAutomation,
    'digital-electronics': digitalElectronics,
    'analog-electronics': analogElectronics
};

export default function RoadmapView() {
    const { trackId } = useParams();
    const { language } = useLanguage();
    const isEnglish = language === 'en';

    const track = tracks.find((t) => t.id === trackId);
    const nodes = trackData[trackId] ? trackData[trackId].nodes : [];

    if (!track) {
        return (
            <section className="rm-roadmap-page rm-not-found">
                <h1 className="rm-page-title">{isEnglish ? 'Track Not Found' : 'المسار غير موجود'}</h1>
                <p className="rm-page-desc">
                    {isEnglish
                        ? 'The requested roadmap track does not exist.'
                        : 'مسار خارطة الطريق المطلوب غير موجود.'}
                </p>
                <Link to="/roadmaps" className="rm-course-button">
                    {isEnglish ? 'Back to Roadmaps' : 'العودة إلى خارطات التعلم'}
                </Link>
            </section>
        );
    }

    const title = isEnglish ? track.title.en : track.title.ar;
    const description = isEnglish ? track.description.en : track.description.ar;
    const Icon = track.Icon;

    return (
        <RoadmapErrorBoundary>
            <section className="rm-roadmap-page">
                <header className="rm-page-header">
                    <div className="rm-page-header-content">
                        <span className="rm-track-icon" style={{ color: track.accent }}>
                            <Icon size={32} />
                        </span>
                        <div>
                            <h1 className="rm-page-title">{title}</h1>
                            <p className="rm-page-desc">{description}</p>
                        </div>
                    </div>
                </header>
                <RoadmapDiagram nodes={nodes} language={language} />
            </section>
        </RoadmapErrorBoundary>
    );
}
