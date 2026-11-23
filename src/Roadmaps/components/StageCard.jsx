import React, { forwardRef } from 'react';
import { useLanguage } from '../../i18n/language';

const TYPE_LABELS = {
    start: { ar: 'البداية', en: 'Start' },
    required: { ar: 'أساسي', en: 'Required' },
    optional: { ar: 'اختياري', en: 'Optional' },
    project: { ar: 'مشروع نهائي', en: 'Final Project' }
};

const StageCard = forwardRef(({ stage, isEnglish, isOpen, onClick }, ref) => {
    const typeLabel = isEnglish ? TYPE_LABELS[stage.type].en : TYPE_LABELS[stage.type].ar;
    const title = isEnglish ? stage.title.en : stage.title.ar;
    const description = isEnglish ? stage.description.en : stage.description.ar;
    const duration = isEnglish ? stage.duration.en : stage.duration.ar;

    return (
        <article
            ref={ref}
            className={`rm-stage-card rm-stage-card--${stage.type}${isOpen ? ' rm-stage-card--open' : ''}`}
            role="button"
            tabIndex={0}
            aria-pressed={isOpen}
            aria-label={`${title}. ${typeLabel}. ${duration}.`}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            <span className={`rm-stage-badge rm-stage-badge--${stage.type}`}>
                {typeLabel}
            </span>
            <h3 className="rm-stage-title">{title}</h3>
            <p className="rm-stage-desc">{description}</p>
            <span className="rm-stage-duration">{duration}</span>
        </article>
    );
});

export default StageCard;
