import { useEffect, useMemo, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Boxes } from "lucide-react";
import { useLanguage } from "../i18n/language";
import { callProjectService } from "./marketplaceApi";
import { ProjectCard } from "./Services";
import { categoryDescription } from "./categoryContent";
import "./Projects.css";

export default function CategoryProjects() {
    const { slug } = useParams();
    const history = useHistory();
    const location = useLocation();
    const { language } = useLanguage();
    const isEnglish = language === "en";
    const requestedPage = Number(new URLSearchParams(location.search).get("page"));
    const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 && requestedPage <= 1_000_000
        ? requestedPage
        : 1;
    const searchTerm = new URLSearchParams(location.search).get("q")?.trim() || "";
    const requestedSaleFilter = new URLSearchParams(location.search).get("sale");
    const saleFilter = ["available", "unpriced"].includes(requestedSaleFilter) ? requestedSaleFilter : "all";
    const [category, setCategory] = useState(null);
    const [projects, setProjects] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [searchInput, setSearchInput] = useState(searchTerm);
    const [loadedKey, setLoadedKey] = useState("");
    const [requestError, setRequestError] = useState(null);
    const requestKey = `${slug}:${page}:${searchTerm}:${saleFilter}`;
    const isLoading = loadedKey !== requestKey && requestError?.key !== requestKey;
    const errorMessage = requestError?.key === requestKey ? requestError.message : "";

    useEffect(() => {
        let isActive = true;
        callProjectService("category_projects", { slug, page, search: searchTerm, saleFilter })
            .then((result) => {
                if (!isActive) return;
                setCategory(result.category);
                setProjects(result.projects || []);
                setPagination(result.pagination);
                setLoadedKey(requestKey);
                if (result.pagination.total_pages > 0 && page > result.pagination.total_pages) {
                    const lastPage = result.pagination.total_pages;
                    const params = new URLSearchParams(location.search);
                    if (lastPage === 1) params.delete("page");
                    else params.set("page", String(lastPage));
                    history.replace({
                        pathname: location.pathname,
                        search: params.toString() ? `?${params.toString()}` : "",
                    });
                }
            })
            .catch((error) => {
                if (isActive) setRequestError({ key: requestKey, message: error.message });
            });
        return () => { isActive = false; };
    }, [history, location.pathname, page, requestKey, saleFilter, searchTerm, slug]);

    useEffect(() => {
        setSearchInput(searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        const normalizedSearch = searchInput.trim();
        if (normalizedSearch === searchTerm) return undefined;
        const timeout = window.setTimeout(() => {
            const params = new URLSearchParams(location.search);
            if (normalizedSearch) params.set("q", normalizedSearch);
            else params.delete("q");
            params.delete("page");
            history.replace({
                pathname: location.pathname,
                search: params.toString() ? `?${params.toString()}` : "",
            });
        }, 300);
        return () => window.clearTimeout(timeout);
    }, [history, location.pathname, location.search, searchInput, searchTerm]);

    const categoryTitle = category && (isEnglish ? category.title_en : category.title_ar);
    const description = category && categoryDescription(category, isEnglish);
    const pageNumbers = useMemo(
        () => Array.from({ length: pagination?.total_pages || 0 }, (_, index) => index + 1),
        [pagination?.total_pages],
    );
    const goToPage = (nextPage) => {
        if (!pagination || nextPage < 1 || nextPage > pagination.total_pages) return;
        const params = new URLSearchParams(location.search);
        if (nextPage === 1) params.delete("page");
        else params.set("page", String(nextPage));
        history.push({
            pathname: location.pathname,
            search: params.toString() ? `?${params.toString()}` : "",
        });
    };
    const changeSaleFilter = (value) => {
        const params = new URLSearchParams(location.search);
        if (value === "all") params.delete("sale");
        else params.set("sale", value);
        params.delete("page");
        history.push({
            pathname: location.pathname,
            search: params.toString() ? `?${params.toString()}` : "",
        });
    };

    return (
        <>
            <main className="services-page" dir={isEnglish ? "ltr" : "rtl"}>
                <section className="services-catalog category-projects-page">
                    <Link className="project-back-link" to="/services">
                        {isEnglish ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}
                        {isEnglish ? "All categories" : "كل الأقسام"}
                    </Link>
                    {isLoading ? (
                        <div className="services-state" role="status">{isEnglish ? "Loading category projects..." : "جارٍ تحميل مشاريع القسم..."}</div>
                    ) : errorMessage ? (
                        <div className="services-state is-error" role="alert">{errorMessage}</div>
                    ) : category ? (
                        <>
                            <header className="services-section-heading category-projects-heading">
                                <div>
                                    <span className="project-eyebrow">{isEnglish ? "PROJECT CATEGORY" : "قسم المشاريع"}</span>
                                    <h1>{categoryTitle}</h1>
                                    <p>{description}</p>
                                </div>
                                <span className="category-project-count">
                                    {pagination?.total_items || 0} {isEnglish ? "projects" : "مشروع"}
                                </span>
                            </header>
                            <div className="services-project-filters">
                                <label className="services-project-search">
                                    <span>{isEnglish ? "Search projects" : "ابحث في المشاريع"}</span>
                                    <input
                                        type="search"
                                        value={searchInput}
                                        onChange={(event) => setSearchInput(event.target.value)}
                                        placeholder={isEnglish ? "Project name or description" : "اسم المشروع أو وصفه"}
                                    />
                                </label>
                                <label className="services-project-sale-filter">
                                    <span>{isEnglish ? "Availability" : "حالة الإتاحة"}</span>
                                    <select value={saleFilter} onChange={(event) => changeSaleFilter(event.target.value)}>
                                        <option value="all">{isEnglish ? "All projects" : "كل المشاريع"}</option>
                                        <option value="available">{isEnglish ? "Available to purchase" : "متاح للشراء"}</option>
                                        <option value="unpriced">{isEnglish ? "Price not set" : "السعر غير محدد"}</option>
                                    </select>
                                </label>
                            </div>
                            {projects.length ? (
                                <>
                                    <div className="services-project-grid">
                                        {projects.map((project) => (
                                            <ProjectCard
                                                key={project.id}
                                                project={project}
                                                isEnglish={isEnglish}
                                                category={categoryTitle}
                                                categorySlug={category.slug}
                                            />
                                        ))}
                                    </div>
                                    {pagination?.total_pages > 1 && (
                                        <nav className="project-pagination" aria-label={isEnglish ? "Project pages" : "صفحات المشاريع"}>
                                            <button type="button" onClick={() => goToPage(page - 1)} disabled={page <= 1}>
                                                {isEnglish ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}
                                                {isEnglish ? "Previous" : "السابت"}
                                            </button>
                                            {pageNumbers.map((pageNumber) => (
                                                <button
                                                    key={pageNumber}
                                                    type="button"
                                                    className={pageNumber === page ? "is-current" : ""}
                                                    aria-current={pageNumber === page ? "page" : undefined}
                                                    onClick={() => goToPage(pageNumber)}
                                                >
                                                    {pageNumber}
                                                </button>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => goToPage(page + 1)}
                                                disabled={page >= pagination.total_pages}
                                            >
                                                {isEnglish ? "Next" : "التالي"}
                                                {isEnglish ? <ArrowRight size={17} /> : <ArrowLeft size={17} />}
                                            </button>
                                        </nav>
                                    )}
                                </>
                            ) : (
                                <div className="services-state">
                                    <Boxes size={32} aria-hidden="true" />
                                <p>{searchTerm || saleFilter !== "all"
                                    ? (isEnglish ? "No projects match these filters." : "لا توجد مشاريع مطابقة لخيارات التصفية.")
                                    : (isEnglish ? "No public projects are available in this category yet." : "لا توجد مشاريع ظاهرة في هذا القسم حاليًا.")}</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="services-state">
                            <Boxes size={32} aria-hidden="true" />
                            <p>{isEnglish ? "This category is unavailable." : "هذا القسم غير متاح."}</p>
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}
