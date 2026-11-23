import { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  Download,
  FileText,
  Lightbulb,
  Lock,
  Shield,
  Layout,
  CircuitBoard,
  Zap,
  Award,
  GraduationCap,
  Code2,
  CheckCircle,
} from "lucide-react";
import { getSupabaseClient, isSupabaseConfigured } from "../login/supabase";
import { useLanguage } from "../i18n/language";
import { callProjectService, downloadProjectFile } from "./marketplaceApi";
import ProjectDocumentation from "./ProjectDocumentation.jsx";
import ProjectSupportContact from "./ProjectSupportContact";
import ProjectPdfExport from "./ProjectPdfExport.jsx";
import "./Projects.css";

export default function PrivateProjectDetails() {
  const { projectCode } = useParams();
  const history = useHistory();
  const { language } = useLanguage();
  const isEnglish = language === "en";
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [downloadingFile, setDownloadingFile] = useState("");
  const [activationCode, setActivationCode] = useState("");
  const [isActivating, setIsActivating] = useState(false);

  const loadProject = async (isActive = true) => {
    setIsLoading(true);
    setData(null);
    setErrorMessage("");
    if (!isSupabaseConfigured()) {
      setErrorMessage(isEnglish ? "Project access is not available." : "الوصول إلى المشاريع غير متاح.");
      setIsLoading(false);
      return;
    }
    const { data: { session }, error } = await getSupabaseClient().auth.getSession();
    if (!isActive) return;
    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }
    if (!session?.user) {
      history.replace("/login", { from: `/projects/${projectCode}` });
      return;
    }
    try {
      const result = await callProjectService("private_project", { projectCode });
      if (isActive) setData(result);
    } catch (requestError) {
      if (isActive) {
        setErrorMessage(requestError.message);
      }
    } finally {
      if (isActive) setIsLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;
    loadProject(isActive);
    return () => { isActive = false; };
  }, [history, isEnglish, projectCode]);

  const handleActivate = async (e) => {
    e.preventDefault();
    setIsActivating(true);
    try {
      await callProjectService("activate_project", { projectCode, code: activationCode });
      await loadProject();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsActivating(false);
    }
  };

  const handleDownload = async (file) => {
    setErrorMessage("");
    setDownloadingFile(file.file_name);
    try {
      const docVersionId = data?.document?.id || data?.document?.document_version_id || "";
      const blob = await downloadProjectFile(docVersionId, file.file_name);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.file_name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      setErrorMessage(error.message || "تعذر تنزيل الملف.");
    } finally {
      setDownloadingFile("");
    }
  };

  const title = data?.project?.title_en || data?.project?.title_ar || "";
  const project = data?.project;
  const document = data?.document;
  const access = data?.access;

  const difficulty = project?.difficulty || (isEnglish ? "Intermediate" : "متوسط");
  const status = project?.status || (isEnglish ? "Available" : "متوفر");
  const categoryLabel = project?.category_id ? (isEnglish ? "Project" : "مشروع") : "";

  return (
    <>
      <main className="project-page" dir={isEnglish ? "ltr" : "rtl"}>
        <article className="project-detail-shell">
          {/* PDF Export Component — renders full project details as professional PDF */}
          <ProjectPdfExport
            project={project}
            documentVersion={document}
            access={access}
            documentation={data?.document?.documentation}
            isEnglish={isEnglish}
            customer={data?.customer?.name || data?.customer?.email || ""}
          />

          <header className="project-private-header">
            <Link className="project-back-link" to="/my-projects">
              {isEnglish ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}
              {isEnglish ? "Back to My Projects" : "العودة لمشاريعي"}
            </Link>
            <div className="project-header-main">
              <div className="project-title-group">
                <span className="project-status-badge">
                  <Shield size={14} />
                  {isEnglish ? "Verified Access" : "وصول مؤكد"}
                </span>
                <code className="project-id-badge">{projectCode}</code>
              </div>
              <div className="project-header-actions">
                <button
                  className="project-button project-button-primary"
                >
                  <Download size={16} />
                  {isEnglish ? "Download PDF" : "تحميل PDF"}
                </button>
              </div>
            </div>
          </header>

          {/* Project Hero — Image + Badges + Description (unique per project, shown once) */}
          <section className="project-hero-section">
            <div className="hero-grid">
              <div className="hero-copy">
                <span className="project-eyebrow">{categoryLabel}</span>
                <h1>{title}</h1>
                <div className="hero-badges">
                  <span className="project-badge">{difficulty}</span>
                  <span className="project-badge">{status}</span>
                </div>
                <p className="project-detail-copy" lang={language}>
                  {project?.public_description_en || project?.public_description_ar || ""}
                </p>
              </div>
              <div className="hero-image">
                {project?.image_url ? (
                  <img
                    className="project-detail-image"
                    src={project.image_url}
                    alt={project.image_alt_text || title}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div className="project-detail-image-placeholder">
                    <Boxes size={42} aria-hidden="true" />
                    <span>{isEnglish ? "No image available" : "لا توجد صورة متوفرة"}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Dynamic Documentation Blocks — unique per project from document.documentation JSON */}
          <ProjectDocumentation
            project={project}
            document={document}
            access={access}
            documentation={data?.document?.documentation}
            isEnglish={isEnglish}
          />

          {/* Files Section — unique per project */}
          {data?.document?.private_files?.length > 0 && (
            <section className="project-info-card private-files">
              <div className="card-icon"><FileText /></div>
              <h2>{isEnglish ? "Project Assets & Files" : "أصول وملفات المشروع"}</h2>
              <ul className="private-file-list">
                {data.document.private_files.map((file) => (
                  <li key={file.file_name}>
                    <div className="file-info">
                      <FileText size={18} />
                      <span>{isEnglish ? (file.label_en || file.file_name) : (file.label_ar || file.file_name)}</span>
                    </div>
                    <button
                      type="button"
                      className="project-button project-button-secondary"
                      disabled={downloadingFile === file.file_name}
                      onClick={() => handleDownload(file)}
                    >
                      {downloadingFile === file.file_name ? <span className="spinner" /> : <Download size={16} />}
                      {isEnglish ? "Download" : "تحميل"}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Support & Community */}
          <ProjectSupportContact
            key={`${data?.access?.id}-${language}`}
            customer={data?.customer?.name || data?.customer?.email}
            projectName={title}
            projectCode={project?.project_code}
            orderReference={data?.access?.order_reference}
          />
        </article>
      </main>
    </>
  );
}
