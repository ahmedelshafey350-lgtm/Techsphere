import React, { forwardRef } from 'react';
import { useLanguage } from '../../i18n/language';

const TopicPill = forwardRef(({ topic, index, side, isEnglish, onClick }, ref) => {
    const title = isEnglish ? topic.title.en : topic.title.ar;
    const description = isEnglish ? topic.description.en : topic.description.ar;
    const isOptional = topic.optional === true;

    return (
        <button
            ref={ref}
            type="button"
            className={`rm-topic-pill rm-topic-pill--${side}${isOptional ? ' rm-topic-pill--optional' : ''}`}
            aria-label={title}
            title={description}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            <span className="rm-topic-pill-title">{title}</span>
            {isOptional && (
                <span className="rm-topic-pill-optional-tag" aria-hidden="true">
                    {isEnglish ? 'optional' : 'اختياري'}
                </span>
            )}
        </button>
    );
});

export default TopicPill;
