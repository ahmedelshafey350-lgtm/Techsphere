import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { buildDocumentationBlocks } from "./documentationBlocks";

function formatDate(value, isEnglish) {
    if (!value) return "—";
    try {
        return new Intl.DateTimeFormat(isEnglish ? "en-GB" : "ar-EG", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(new Date(value));
    } catch {
        return "—";
    }
}

function BlockValue({ layout, value }) {
    if (Array.isArray(value)) {
        if (layout === "steps") {
            return (
                <ol className="project-doc-steps">
                    {value.map((step, index) => (
                        <li key={`step-${index}`}>{typeof step === "string" ? step : String(step)}</li>
                    ))}
                </ol>
            );
        }
        return (
            <ul className="project-doc-tools">
                {value.map((item, index) => (
                    <li key={`item-${index}`}>{typeof item === "string" ? item : String(item)}</li>
                ))}
            </ul>
        );
    }
    return <p className="project-doc-prose">{String(value)}</p>;
}

export default function ProjectDocumentation({ project, document, access, documentation, isEnglish }) {
    const { blocks, extras } = useMemo(
        () => buildDocumentationBlocks(documentation, isEnglish),
        [documentation, isEnglish],
    );

    const rows = useMemo(() => {
        const list = blocks.map((block) => ({ ...block, panelId: `doc-panel-${block.key}` }));
        if (extras.length) {
            list.push({
                key: "extras",
                title: isEnglish ? "Additional details" : "تفاصيل إضافية",
                layout: "group",
                value: extras,
                panelId: "doc-panel-extras",
            });
        }
        return list;
    }, [blocks, extras, isEnglish]);

    const [openKey, setOpenKey] = useState(() => rows[0]?.key ?? "");
    const title = project ? (isEnglish ? project.title_en : project.title_ar) : "";

    return (
        <section className="project-doc" aria-label={isEnglish ? "Project documentation" : "توثيق المشروع"}>
            <div className="project-doc-title-block">
                <div className="project-doc-cell project-doc-cell-name">
                    <span>{isEnglish ? "Project" : "المشروع"}</span>
                    <h1 className="project-doc-name">{title || "—"}</h1>
                </div>
                <div className="project-doc-cell">
                    <span>{isEnglish ? "Code" : "الكود"}</span>
                    <code dir="ltr">{project?.project_code || "—"}</code>
                </div>
                <div className="project-doc-cell">
                    <span>{isEnglish ? "Version" : "الإصدار"}</span>
                    <code dir="ltr">v{document?.version || "—"}</code>
                </div>
                <div className="project-doc-cell">
                    <span>{isEnglish ? "Access expires" : "تنتهي الصلاحية"}</span>
                    <code dir="ltr">{formatDate(access?.expires_at, isEnglish)}</code>
                </div>
            </div>

            {rows.length === 0 ? (
                <p className="project-doc-empty">
                    {isEnglish
                        ? "This documentation version has no written sections yet."
                        : "لا توجد أقسام مكتوبة في نسخة التوثيق هذه بعد."}
                </p>
            ) : (
                <ul className="project-doc-list">
                    {rows.map((row) => {
                        const isOpen = openKey === row.key;
                        return (
                            <li key={row.key} className={`project-doc-row${isOpen ? " is-open" : ""}`}>
                                <h2 className="project-doc-heading">
                                    <button
                                        type="button"
                                        className="project-doc-toggle"
                                        id={`${row.panelId}-toggle`}
                                        aria-expanded={isOpen}
                                        aria-controls={row.panelId}
                                        onClick={() => setOpenKey(isOpen ? "" : row.key)}
                                    >
                                        <span className="project-doc-marker" aria-hidden="true" />
                                        <span className="project-doc-title">{row.title}</span>
                                        <ChevronDown className="project-doc-chevron" size={18} aria-hidden="true" />
                                    </button>
                                </h2>
                                {isOpen && (
                                    <div
                                        className="project-doc-panel"
                                        id={row.panelId}
                                        role="region"
                                        aria-labelledby={`${row.panelId}-toggle`}
                                    >
                                        {row.layout === "group"
                                            ? row.value.map((extra) => (
                                                <div className="project-doc-extra" key={extra.key}>
                                                    <h3>{extra.title}</h3>
                                                    <BlockValue layout={extra.layout} value={extra.value} />
                                                </div>
                                            ))
                                            : <BlockValue layout={row.layout} value={row.value} />}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}
