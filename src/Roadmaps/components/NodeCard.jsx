import React, { forwardRef } from 'react';
import { useLanguage } from '../../i18n/language';

const TYPE_LABELS = {
    start: { ar: 'البداية', en: 'Start' },
    required: { ar: 'أساسي', en: 'Required' },
    optional: { ar: 'اختياري', en: 'Optional' },
    project: { ar: 'مشروع', en: 'Project' }
};

const NodeCard = forwardRef(({ node, isEnglish, isOpen, onClick }, ref) => {
    const typeLabel = isEnglish ? TYPE_LABELS[node.type].en : TYPE_LABELS[node.type].ar;
    const title = isEnglish ? node.title.en : node.title.ar;
    const description = isEnglish ? node.description.en : node.description.ar;
    const duration = isEnglish ? node.duration.en : node.duration.ar;

    return (
        <article
            ref={ref}
            className={`rm-node rm-node--${node.type}${isOpen ? ' rm-node--open' : ''}`}
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
            <span className={`rm-badge rm-badge--${node.type}`}>
                {typeLabel}
            </span>
            <h3 className="rm-node-title">{title}</h3>
            <p className="rm-node-desc">{description}</p>
            <span className="rm-node-duration">{duration}</span>
        </article>
    );
});

export default NodeCard;
