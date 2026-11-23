import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Boxes } from "lucide-react";
import { useLanguage } from "../i18n/language";
import { callProjectService } from "./marketplaceApi";
import "./Projects.css";

function ShowcaseRow({ projects, isEnglish, reverse }) {
    if (!projects.length) return null;
    const cards = (prefix) => projects.map((project, index) => (
        <Link
            className="project-showcase-card"
            key={`${prefix}-${project.id}-${index}`}
            to={`/services/${project.slug}`}
            tabIndex={prefix === "duplicate" ? -1 : undefined}
        >
            {project.image_url
                ? <img src={project.image_url} alt={project.image_alt_text || (isEnglish ? project.title_en : project.title_ar)} loading="lazy" />
                : <span className="project-showcase-image-fallback"><Boxes size={30} /></span>}
            <span>{isEnglish ? project.title_en : project.title_ar}</span>
        </Link>
    ));
    return (
        <div className="project-showcase-viewport">
            <div className={`project-showcase-track${reverse ? " is-reverse" : ""}`}>
                {cards("main")}
                {cards("duplicate")}
            </div>
        </div>
    );
}

export default function ProjectShowcase() {
    const { language } = useLanguage();
    const isEnglish = language === "en";
    const [projects, setProjects] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        let isActive = true;
        callProjectService("featured_projects")
            .then((catalog) => {
                if (isActive) setProjects(catalog.projects || []);
            })
            .catch((error) => {
                if (isActive) setErrorMessage(error.message);
            })
            .finally(() => {
                if (isActive) setIsLoading(false);
            });
        return () => { isActive = false; };
    }, []);

    if (!isLoading && !errorMessage && !projects.length) return null;
    const firstRow = projects.filter((_, index) => index % 2 === 0);
    const secondRow = projects.filter((_, index) => index % 2 === 1);
    const rowTwo = secondRow.length ? secondRow : firstRow;

    return (
        <section className="project-showcase" dir={isEnglish ? "ltr" : "rtl"}>
            <header className="project-showcase-heading">
                <span className="project-eyebrow">{isEnglish ? "TECHSPHERE SERVICES" : "خدمات تك اسفير"}</span>
                <h2>{isEnglish ? "Explore practical engineering projects" : "استكشف مشاريع هندسية عملية"}</h2>
                <p>{isEnglish
                    ? "Browse projects across engineering, electronics, automation, and software."
                    : "تصفح مشاريع في الهندسة والإلكترونيات والأتمتة والبرمجيات."}</p>
            </header>
            {isLoading
                ? <p className="project-showcase-message" role="status">{isEnglish ? "Loading project showcase..." : "جارٍ تحميل المشاريع..."}</p>
                : errorMessage
                    ? <p className="project-showcase-message" role="alert">{errorMessage}</p>
                    : <>
                        <ShowcaseRow projects={firstRow} isEnglish={isEnglish} />
                        <div className="project-showcase-second-row">
                            <ShowcaseRow projects={rowTwo} isEnglish={isEnglish} reverse />
                        </div>
                    </>}
            <div className="project-showcase-actions">
                <Link className="project-button project-button-whatsapp" to="/services">
                    {isEnglish ? "View all projects" : "عرض كل المشاريع"}
                    {isEnglish ? <ArrowRight size={17} /> : <ArrowLeft size={17} />}
                </Link>
            </div>
        </section>
    );
}
