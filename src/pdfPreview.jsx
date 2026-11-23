// Temporary QA harness for the private project documentation + PDF export. Not part of the app.
import { createRoot } from "react-dom/client";
import ProjectDocumentation from "./Projects/ProjectDocumentation.jsx";
import ProjectPdfExport from "./Projects/ProjectPdfExport.jsx";
import { resolveDocumentation } from "./Projects/projectDocumentationContent";
import "./global.css";
import "./theme.css";
import "./Projects/Projects.css";

const project = {
    project_code: "TXH-ESP-001",
    title_ar: "AI CNC Tool Wear Monitor",
    title_en: "AI CNC Tool Wear Monitor",
    public_description_en: "Detailed architecture describes on-device vibration analysis, FFT sampling, and cloud telemetry.",
};

const documentVersion = {
    version: "1.0",
    private_files: [
        { file_name: "wiring-diagram.pdf", label_ar: "مخطط التوصيل", label_en: "Wiring diagram" },
        { file_name: "firmware.zip", label_ar: "ملف الثابتة", label_en: "Firmware package" },
    ],
    documentation: null,
};

const access = { id: "access-1", expires_at: "2027-02-02T19:31:18Z", order_reference: "ORD-2291" };

const versions = [
    { id: "v1", version: "1.0", changelog_ar: "الإصدار الأول من التوثيق", changelog_en: "First documentation version", published_at: "2026-11-02T19:31:18Z" },
    { id: "v0", version: "0.9", changelog_ar: "نسخة مراجعة داخلية", changelog_en: "Internal review draft", published_at: "2026-10-21T10:02:00Z" },
];

const isEnglish = new URLSearchParams(window.location.search).get("lang") === "en";
const documentation = resolveDocumentation(project, null);

createRoot(document.getElementById("root")).render(
    <main className="project-page" dir={isEnglish ? "ltr" : "rtl"}>
        <article className="project-detail-shell">
            <ProjectDocumentation
                project={project}
                document={documentVersion}
                access={access}
                documentation={documentation}
                isEnglish={isEnglish}
            />
            <ProjectPdfExport
                project={project}
                documentVersion={documentVersion}
                access={access}
                documentation={documentation}
                versions={versions}
                customer="ahmed.mansour@example.com"
                isEnglish={isEnglish}
            />
        </article>
    </main>,
);
