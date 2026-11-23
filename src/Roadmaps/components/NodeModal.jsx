import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/language';

const safeString = (value, isEnglish) => {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
        return isEnglish ? (value.en || '') : (value.ar || '');
    }
    return String(value);
};

export default function NodeModal({ node, isOpen, onClose, courseId, project, isTopic, stageTitle }) {
    if (!node || !isOpen) return null;

    const { language } = useLanguage();
    const isEnglish = language === 'en';
    const modalRef = useRef(null);
    const previousOverflow = useRef('');

    const title = safeString(node?.title, isEnglish);
    const description = safeString(node?.description, isEnglish);
    const duration = safeString(node?.duration, isEnglish);
    const projectText = node?.project ?? project ?? null;
    const projectStr = safeString(projectText, isEnglish);

    const lockBody = useCallback(() => {
        previousOverflow.current = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    }, []);

    const unlockBody = useCallback(() => {
        document.body.style.overflow = previousOverflow.current;
    }, []);

    useEffect(() => {
        if (isOpen) {
            lockBody();
            const el = modalRef.current;
            if (el) el.focus();
        } else {
            unlockBody();
        }
        return () => {
            unlockBody();
        };
    }, [isOpen, lockBody, unlockBody]);

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, handleKeyDown]);

    const topics = Array.isArray(node.topics) ? node.topics : [];
    const skills = Array.isArray(node.skills) ? node.skills : [];

    const linkCourseId = courseId != null ? courseId : (node.courseId != null ? node.courseId : null);
    const courseLink = linkCourseId ? `/Courses/${linkCourseId}` : '/Courses';

    const modalContent = (
        <div
            className="rm-modal-overlay"
            onClick={onClose}
            onKeyDown={(e) => {
                if (e.key === 'Tab') e.preventDefault();
            }}
        >
            <div
                className="rm-modal"
                ref={modalRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleKeyDown}
            >
                <button
                    className="rm-modal-close"
                    type="button"
                    onClick={onClose}
                    aria-label={isEnglish ? 'Close' : 'إغلاق'}
                >
                    ×
                </button>
                <div className="rm-modal-content">
                    {isTopic && stageTitle && (
                        <p className="rm-modal-context">
                            {isEnglish ? 'Topic in' : 'موضوع في'}: {safeString(stageTitle, isEnglish)}
                        </p>
                    )}
                    <h2 className="rm-modal-title">{title}</h2>
                    <p className="rm-modal-desc">{description}</p>

                    {!isTopic && duration && (
                        <div className="rm-modal-meta">
                            <span className="rm-modal-label">
                                {isEnglish ? 'Duration' : 'المدة'}:
                            </span>
                            <span className="rm-modal-value">{duration}</span>
                        </div>
                    )}

                    {topics.length > 0 && (
                        <section className="rm-modal-section">
                            <h3 className="rm-modal-section-title">
                                {isEnglish ? 'Topics' : 'المواضيع'}
                            </h3>
                            <ul className="rm-topic-list">
                                {topics.map((t, i) => (
                                    <li key={i}>
                                        {safeString(t?.title, isEnglish)}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {skills.length > 0 && (
                        <section className="rm-modal-section">
                            <h3 className="rm-modal-section-title">
                                {isEnglish ? 'Key Skills' : 'المهارات الأساسية'}
                            </h3>
                            <ul className="rm-topic-list">
                                {skills.map((s, i) => (
                                    <li key={i}>
                                        {safeString(s, isEnglish)}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {node.project && (
                        <section className="rm-modal-section">
                            <h3 className="rm-modal-section-title">
                                {isEnglish ? 'Practice Project' : 'مشروع تطبيقي'}
                            </h3>
                            <p className="rm-modal-project">
                                {projectStr}
                            </p>
                        </section>
                    )}

                    <div className="rm-modal-actions">
                        {!isTopic && (
                            <Link
                                to={courseLink}
                                className="rm-course-button"
                                onClick={onClose}
                            >
                                {isEnglish ? 'Go to Course' : 'انتقل إلى الدورة'}
                            </Link>
                        )}
                        <button type="button" className="rm-modal-done" onClick={onClose}>
                            {isEnglish ? 'Got it' : 'تم'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
