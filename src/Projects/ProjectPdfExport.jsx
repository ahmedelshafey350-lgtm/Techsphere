import { useCallback, useMemo, useRef, useState } from "react";
import { Download, Loader2, RotateCcw, X } from "lucide-react";
import { publicAsset } from "../utils/publicAsset.js";
import { buildDocumentationBlocks } from "./documentationBlocks";
import {
    buildProjectPdf,
    downloadPdf,
    projectPdfFileName,
} from "./projectPdf";

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

function SheetValue({ layout, value }) {
    if (Array.isArray(value)) {
        if (layout === "steps") {
            return (
                <ol className="pdf-sheet-steps">
                    {value.map((item, index) => (
                        <li key={`step-${index}`}>{String(item)}</li>
                    ))}
                </ol>
            );
        }
        return (
            <ul className="pdf-sheet-list">
                {value.map((item, index) => (
                    <li key={`item-${index}`}>{String(item)}</li>
                ))}
            </ul>
        );
    }
    return <p className="pdf-sheet-prose">{String(value)}</p>;
}

export default function ProjectPdfExport({
    project,
    documentVersion,
    access,
    documentation,
    versions = [],
    customer,
    isEnglish,
}) {
    const [status, setStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [pageCount, setPageCount] = useState(0);
    const [stage, setStage] = useState({ index: 0, label: "" });

    const headerRef = useRef(null);
    const footerRef = useRef(null);
    const sectionRefs = useRef(new Map());
    const lastPdfRef = useRef(null);
    const cancelledRef = useRef(false);

    const rows = useMemo(() => {
        const { blocks, extras } = buildDocumentationBlocks(documentation, isEnglish);
        const list = blocks.map((block) => ({ ...block }));
        if (extras.length) {
            list.push({
                key: "extras",
                title: isEnglish ? "Additional details" : "تفاصيل إضافية",
                layout: "group",
                value: extras,
            });
        }
        return list;
    }, [documentation, isEnglish]);

    const files = documentVersion?.private_files || [];
    const sectionKeys = useMemo(() => {
        const keys = ["summary", ...rows.map((row) => `block-${row.key}`)];
        if (files.length) keys.push("files");
        if (versions.length > 1) keys.push("history");
        return keys;
    }, [rows, files.length, versions.length]);

    const fileName = projectPdfFileName(project, documentVersion);
    const title = isEnglish ? project?.title_en : project?.title_ar;
    const isBuilding = status === "building";
    const stageLabel = isEnglish ? "typesetting" : "تنسيق";

    const setSectionRef = useCallback((key) => (node) => {
        if (node) sectionRefs.current.set(key, node);
        else sectionRefs.current.delete(key);
    }, []);

    const handleExport = async () => {
        if (isBuilding) {
            cancelledRef.current = true;
            return;
        }
        if (status === "ready" && lastPdfRef.current) {
            downloadPdf(lastPdfRef.current, fileName);
            return;
        }
        setErrorMessage("");
        setStatus("building");
        setStage({ index: 0, label: rows[0]?.title || "" });
        cancelledRef.current = false;

        const sections = sectionKeys
            .map((key) => ({
                key,
                title: key === "summary"
                    ? (isEnglish ? "Project data" : "بيانات المشروع")
                    : key === "files"
                        ? (isEnglish ? "Private files" : "الملفات الخاصة")
                        : key === "history"
                            ? (isEnglish ? "Update history" : "سجل التحديثات")
                            : rows.find((row) => `block-${row.key}` === key)?.title || "",
                node: sectionRefs.current.get(key),
            }))
            .filter((section) => section.node);

        try {
            const result = await buildProjectPdf({
                headerNode: headerRef.current,
                footerNode: footerRef.current,
                sections,
                fileName,
                isEnglish,
                onProgress: ({ index, section }) => setStage({ index, label: section.title }),
                isCancelled: () => cancelledRef.current,
            });
            lastPdfRef.current = result.pdf;
            setPageCount(result.pageCount);
            setStatus("ready");
            downloadPdf(result.pdf, result.fileName);
        } catch (error) {
            if (error?.name === "PdfExportCancelled") {
                setStatus(lastPdfRef.current ? "ready" : "idle");
            } else {
                setErrorMessage(error?.message
                    || (isEnglish ? "The PDF could not be generated. Try again." : "تعذر تجهيز ملف PDF. حاول مرة أخرى."));
                setStatus("error");
            }
        } finally {
            cancelledRef.current = false;
        }
    };

    return (
        <>
            <section className="project-doc-export" aria-label={isEnglish ? "Project PDF" : "ملف المشروع PDF"}>
                <div className="project-doc-export-row">
                    <span className="project-doc-export-sheet-mark" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                    </span>

                    <div className="project-doc-export-copy">
                        <h2>{isEnglish ? "Project file — PDF" : "ملف المشروع — PDF"}</h2>
                        <p className="project-doc-export-meta">
                            <span dir="ltr">{fileName}</span>
                            <span className="project-doc-export-sep" aria-hidden="true">·</span>
                            <span>
                                {pageCount === 0
                                    ? "A4"
                                    : pageCount === 1
                                        ? (isEnglish ? "1 page" : "صفحة واحدة")
                                        : (isEnglish ? `${pageCount} pages` : `${pageCount} صفحات`)}
                            </span>
                            <span className="project-doc-export-sep" aria-hidden="true">·</span>
                            <span>
                                {isEnglish
                                    ? "TechSphere header on every page"
                                    : "ترويسة TechSphere على كل صفحة"}
                            </span>
                        </p>
                    </div>

                    <button
                        type="button"
                        className={`project-doc-export-action${isBuilding ? " is-building" : ""}`}
                        onClick={handleExport}
                        aria-busy={isBuilding}
                    >
                        {isBuilding ? (
                            <>
                                <X size={15} aria-hidden="true" />
                                {isEnglish ? "Cancel" : "إلغاء"}
                            </>
                        ) : status === "ready" ? (
                            <>
                                <RotateCcw size={15} aria-hidden="true" />
                                {isEnglish ? "Download again" : "تنزيل مرة أخرى"}
                            </>
                        ) : (
                            <>
                                <Download size={15} aria-hidden="true" />
                                {isEnglish ? "Issue PDF" : "إصدار PDF"}
                            </>
                        )}
                    </button>
                </div>

                {isBuilding && (
                    <div className="project-doc-export-progress">
                        <div className="project-doc-export-preview" aria-hidden="true">
                            <span className="project-doc-export-preview-band" />
                            {sectionKeys.map((key, index) => (
                                <span
                                    key={key}
                                    className={`project-doc-export-preview-block${index <= stage.index ? " is-inked" : ""}`}
                                />
                            ))}
                            <span className="project-doc-export-preview-band is-footer" />
                        </div>
                        <p className="project-doc-export-stage" role="status" aria-live="polite">
                            <Loader2 size={14} className="project-doc-export-spinner" aria-hidden="true" />
                            <span className="project-doc-export-stage-count" dir="ltr">
                                {Math.min(stage.index + 1, sectionKeys.length)} / {sectionKeys.length}
                            </span>
                            <span>
                                {stageLabel}
                                {stage.label ? `: ${stage.label}` : ""}
                            </span>
                        </p>
                    </div>
                )}

                {errorMessage && (
                    <p className="project-doc-export-error" role="alert">{errorMessage}</p>
                )}
            </section>

            {/* Printed sheet — laid out off-screen at A4 width and captured into the PDF. */}
            <div className="pdf-sheet-root" aria-hidden="true">
                <div className="pdf-sheet" dir={isEnglish ? "ltr" : "rtl"} lang={isEnglish ? "en" : "ar"}>
                    <div className="pdf-sheet-header" ref={headerRef}>
                        <div className="pdf-sheet-brand">
                            <img src={publicAsset("Techshpere Orbit Tech Logo.png")} alt="" />
                            <span className="pdf-sheet-brand-text">
                                <strong>TechSphere</strong>
                                <span>
                                    {isEnglish ? "Engineering projects platform" : "منصة المشاريع الهندسية"}
                                </span>
                            </span>
                        </div>
                        <div className="pdf-sheet-header-meta">
                            <span dir="ltr">{project?.project_code || "—"}</span>
                            <span dir="ltr">v{documentVersion?.version || "—"}</span>
                        </div>
                    </div>

                    <section className="pdf-sheet-section" ref={setSectionRef("summary")}>
                        <h2 className="pdf-sheet-name">{title || "—"}</h2>
                        <dl className="pdf-sheet-facts">
                            <div>
                                <dt>{isEnglish ? "Project code" : "كود المشروع"}</dt>
                                <dd dir="ltr">{project?.project_code || "—"}</dd>
                            </div>
                            <div>
                                <dt>{isEnglish ? "Documentation version" : "إصدار التوثيق"}</dt>
                                <dd dir="ltr">v{documentVersion?.version || "—"}</dd>
                            </div>
                            <div>
                                <dt>{isEnglish ? "Access expires" : "انتهاء الصلاحية"}</dt>
                                <dd>{formatDate(access?.expires_at, isEnglish)}</dd>
                            </div>
                            <div>
                                <dt>{isEnglish ? "Account" : "الحساب"}</dt>
                                <dd>{customer || "—"}</dd>
                            </div>
                        </dl>
                    </section>

                    {rows.map((row) => (
                        <section className="pdf-sheet-section" key={row.key} ref={setSectionRef(`block-${row.key}`)}>
                            <h3 className="pdf-sheet-heading">{row.title}</h3>
                            {row.layout === "group" ? (
                                row.value.map((extra) => (
                                    <div className="pdf-sheet-extra" key={extra.key}>
                                        <h4>{extra.title}</h4>
                                        <SheetValue layout={extra.layout} value={extra.value} />
                                    </div>
                                ))
                            ) : (
                                <SheetValue layout={row.layout} value={row.value} />
                            )}
                        </section>
                    ))}

                    {files.length > 0 && (
                        <section className="pdf-sheet-section" ref={setSectionRef("files")}>
                            <h3 className="pdf-sheet-heading">
                                {isEnglish ? "Private files in this version" : "الملفات الخاصة في هذا الإصدار"}
                            </h3>
                            <ul className="pdf-sheet-list">
                                {files.map((file) => (
                                    <li key={file.file_name} dir="ltr">
                                        {isEnglish ? (file.label_en || file.file_name) : (file.label_ar || file.file_name)}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {versions.length > 1 && (
                        <section className="pdf-sheet-section" ref={setSectionRef("history")}>
                            <h3 className="pdf-sheet-heading">
                                {isEnglish ? "Documentation updates" : "تحديثات التوثيق"}
                            </h3>
                            <ul className="pdf-sheet-history">
                                {versions.map((version) => (
                                    <li key={version.id}>
                                        <span dir="ltr">v{version.version}</span>
                                        <span>{isEnglish ? version.changelog_en : version.changelog_ar}</span>
                                        <span>{formatDate(version.published_at, isEnglish)}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    <div className="pdf-sheet-footer" ref={footerRef}>
                        <span className="pdf-sheet-footer-brand">
                            <img src={publicAsset("Techshpere Orbit Tech Logo.png")} alt="" />
                            TechSphere
                        </span>
                        <span className="pdf-sheet-footer-note">
                            <span>{isEnglish ? "Issued for" : "صادر لحساب"}</span>
                            <span dir="ltr">{customer || "—"}</span>
                            <span className="pdf-sheet-footer-sep">·</span>
                            <span dir="ltr">{project?.project_code || "—"}</span>
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
