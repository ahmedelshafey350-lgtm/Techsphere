import React from 'react';
import { Link } from 'react-router-dom';
import { Code } from 'lucide-react';
import { useLanguage } from '../../i18n/language';
import { tracks } from '../index';
import '../Roadmaps.css';

const GROUP_LABELS = {
    software: { ar: 'البرمجيات', en: 'Software' },
    electronics: { ar: 'الإلكترونيات', en: 'Electronics' },
    automation: { ar: 'الأتمتة والذكاء الاصطناعي', en: 'Automation & AI' }
};

export default function TrackList() {
    const { language } = useLanguage();
    const isEnglish = language === 'en';

    const groups = ['software', 'electronics', 'automation'];

    return (
        <section className="rm-landing-page">
            {/* Hero */}
            <header className="rm-hero">
                <h1 className="rm-hero-title">
                    {isEnglish ? 'Learning Roadmaps' : 'خرائط التعلم'}
                </h1>
                <p className="rm-hero-subtitle">
                    {isEnglish
                        ? 'Guided paths from absolute zero to job-ready, in your language.'
                        : 'مسارات موجهة من الصفر حتى الإتقان المهني، بلغتك.'}
                </p>
            </header>

            {/* Sections */}
            {groups.map((group) => {
                const groupTracks = tracks.filter((t) => t.group === group);
                const label = isEnglish ? GROUP_LABELS[group].en : GROUP_LABELS[group].ar;

                return (
                    <section key={group} className="rm-section">
                        <h2 className="rm-section-title">{label}</h2>
                        <div className="rm-track-grid">
                            {groupTracks.map((track) => {
                                const Icon = track.Icon || Code;
                                return (
                                    <article
                                        key={track.id}
                                        className={`rm-track-card${track.ready ? '' : ' rm-track-card--coming-soon'}`}
                                        aria-disabled={track.ready ? undefined : true}
                                    >
                                        {track.ready ? (
                                            <Link
                                                to={`/roadmaps/${track.id}`}
                                                className="rm-track-card-link"
                                            >
                                                <div className="rm-track-icon" style={{ color: track.accent }}>
                                                    <Icon size={20} />
                                                </div>
                                                <h3 className="rm-track-title">
                                                    {isEnglish ? track.title.en : track.title.ar}
                                                </h3>
                                                <p className="rm-track-desc">
                                                    {isEnglish ? track.description.en : track.description.ar}
                                                </p>
                                            </Link>
                                        ) : (
                                            <>
                                                <div className="rm-track-icon" style={{ color: track.accent }}>
                                                    <Icon size={20} />
                                                </div>
                                                <h3 className="rm-track-title">
                                                    {isEnglish ? track.title.en : track.title.ar}
                                                </h3>
                                                <p className="rm-track-desc">
                                                    {isEnglish ? track.description.en : track.description.ar}
                                                </p>
                                                <span className="rm-badge rm-badge--coming-soon">
                                                    {isEnglish ? 'Coming soon' : 'قريباً'}
                                                </span>
                                            </>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                );
            })}
        </section>
    );
}
