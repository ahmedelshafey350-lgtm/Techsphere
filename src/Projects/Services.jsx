import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Boxes, MessageCircle } from "lucide-react";
import { useLanguage } from "../i18n/language";
import { servicesWhatsAppLink } from "../config/servicesContact";
import { callProjectService } from "./marketplaceApi";
import { categoryDescription } from "./categoryContent";
import { projectDescription } from "./projectSummary";
import "./Projects.css";

function projectTitle(project, isEnglish) {
    return isEnglish ? project.title_en : project.title_ar;
}

export function ProjectCard({ project, isEnglish, category, categorySlug }) {
    const [imageFailed, setImageFailed] = useState(false);
    return (
        <article className="service-project-card">
            <Link className="service-project-image" to={`/services/${project.slug}`} aria-label={projectTitle(project, isEnglish)}>
                {project.image_url && !imageFailed ? (
                    <img
                        src={project.image_url}
                        alt={project.image_alt_text || projectTitle(project, isEnglish)}
                        loading="lazy"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <span className="service-project-placeholder" aria-hidden="true"><Boxes size={36} /></span>
                )}
            </Link>
            <div className="service-project-card-body">
                <div className="service-project-meta">
                    <span>{category}</span>
                </div>
                <h3><Link to={`/services/${project.slug}`}>{projectTitle(project, isEnglish)}</Link></h3>
                <p>{projectDescription({ ...project, category_slug: categorySlug }, isEnglish)}</p>
                <div className="service-project-card-footer">
                    {project.is_for_sale && Number(project.price) > 0 ? (
                        <strong>{`${new Intl.NumberFormat(isEnglish ? "en-US" : "ar-EG").format(project.price)} ${project.currency_code}`}</strong>
                    ) : (
                        <strong className="service-project-price-quote">
                            {isEnglish ? "Price by request" : "السعر حسب الطلب"}
                        </strong>
                    )}
                    <Link to={`/services/${project.slug}`} className="service-project-view">
                        {isEnglish ? "View project" : "تفاصيل المشروع"}
                        {isEnglish ? <ArrowRight size={17} /> : <ArrowLeft size={17} />}
                    </Link>
                </div>
            </div>
        </article>
    );
}

function CategoryCard({ category, isEnglish }) {
    const [imageFailed, setImageFailed] = useState(false);
    const title = isEnglish ? category.title_en : category.title_ar;
    const description = categoryDescription(category, isEnglish);
    return (
        <article className="service-category-card">
            <Link to={`/services/category/${category.slug}`} className="service-category-image" aria-label={title}>
                {category.image_url && !imageFailed ? (
                    <img
                        src={category.image_url}
                        alt={category.image_alt_text || title}
                        loading="lazy"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <span className="service-project-placeholder" aria-hidden="true"><Boxes size={42} /></span>
                )}
            </Link>
            <div className="service-category-card-body">
                <h3>{title}</h3>
                <p>{description}</p>
                <Link to={`/services/category/${category.slug}`} className="service-project-view">
                    {isEnglish ? "Explore projects" : "استكشف المشاريع"}
                    {isEnglish ? <ArrowRight size={17} /> : <ArrowLeft size={17} />}
                </Link>
            </div>
        </article>
    );
}

export default function Services() {
    const { language } = useLanguage();
    const isEnglish = language === "en";
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let isActive = true;
        callProjectService("catalog")
            .then((data) => {
                if (isActive) setCategories(data.categories || []);
            })
            .catch((error) => {
                if (isActive) setErrorMessage(error.message);
            })
            .finally(() => {
                if (isActive) setIsLoading(false);
            });
        return () => { isActive = false; };
    }, []);

    const contactMessage = isEnglish
        ? "Hello Techshpere, I am interested in purchasing an engineering project. Please share the available options."
        : "مرحبًا Techshpere، أنا مهتم بشراء أحد المشاريع الهندسية. أرجو توضيح الخيارات المتاحة.";

    return (
        <>
            <main className="services-page" dir={isEnglish ? "ltr" : "rtl"}>
                <section className="services-hero">
                    <div className="services-hero-copy">
                        <span className="project-eyebrow">{isEnglish ? "TECHSPHERE SERVICES" : "خدمات ومشاريع تك اسفير"}</span>
                        <h1>{isEnglish ? "Engineering projects, ready to explore." : "مشاريع هندسية عملية، جاهزة للاستكشاف."}</h1>
                        <p>{isEnglish
                            ? "Explore practical engineering and technology projects, review what each one does, and request a project when you are ready."
                            : "استكشف مشاريع عملية في الهندسة والتقنية، وتعرّف على هدف كل مشروع، ثم أرسل طلبك عند الاستعداد."}</p>
                        <a
                            className="project-button project-button-whatsapp"
                            href={servicesWhatsAppLink(contactMessage)}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <MessageCircle size={19} aria-hidden="true" />
                            {isEnglish ? "Ask about buying a project" : "استفسر عن شراء مشروع"}
                            <ArrowUpRight size={17} aria-hidden="true" />
                        </a>
                    </div>
                    <div className="services-hero-mark" aria-hidden="true"><Boxes size={104} strokeWidth={1} /></div>
                </section>

                <section className="services-catalog">
                    <div className="services-section-heading">
                        <div>
                            <span className="project-eyebrow">{isEnglish ? "PROJECT CATALOG" : "كتالوج المشاريع"}</span>
                            <h2>{isEnglish ? "Explore by category" : "استكشف حسب القسم"}</h2>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="services-state" role="status">{isEnglish ? "Loading project categories..." : "جارٍ تحميل أقسام المشاريع..."}</div>
                    ) : errorMessage ? (
                        <div className="services-state is-error" role="alert">{errorMessage}</div>
                    ) : categories.length ? (
                        <div className="services-category-grid">
                            {categories.map((category) => (
                                <CategoryCard key={category.id} category={category} isEnglish={isEnglish} />
                            ))}
                        </div>
                    ) : (
                        <div className="services-state">
                            <Boxes size={32} aria-hidden="true" />
                            <p>{isEnglish ? "No project categories are available yet." : "لا توجد أقسام مشاريع متاحة حاليًا."}</p>
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}
