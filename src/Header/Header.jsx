import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { WhatsApp } from '@mui/icons-material';
import { Menu } from '@mui/icons-material';
import { Close } from '@mui/icons-material';
import { DarkMode, LightMode } from "@mui/icons-material";
import { getSupabaseClient, isSupabaseConfigured } from "../login/supabase";
import { useLanguage } from "../i18n/language";
import { useTheme } from "../i18n/theme";
import { publicAsset } from "../utils/publicAsset.js";
import { loadPublishedCourses, formatCoursePrice } from "../utils/courses";
import './Header.css';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const { language, setLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();
    const isEnglish = language === "en";
    const isDark = theme === "dark";
    const [hasResolvedSession, setHasResolvedSession] = useState(
        () => !isSupabaseConfigured()
    );
    const [courses, setCourses] = useState([]);
    const [coursesLoaded, setCoursesLoaded] = useState(false);
    const [megaOpen, setMegaOpen] = useState(false);
    const [exploreOpen, setExploreOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [filterLevel, setFilterLevel] = useState("all");
    const megaMenuRef = useRef(null);
    const exploreMenuRef = useRef(null);
    const navRef = useRef(null);

    // Supabase auth session
    useEffect(() => {
        if (!isSupabaseConfigured()) {
            return undefined;
        }

        const supabase = getSupabaseClient();
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user ?? null);
                if (event === "INITIAL_SESSION") {
                    setHasResolvedSession(true);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // Click outside to close mega/explore menus
    useEffect(() => {
        function handleClickOutside(event) {
            if (megaOpen && megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
                setMegaOpen(false);
            }
            if (exploreOpen && exploreMenuRef.current && !exploreMenuRef.current.contains(event.target)) {
                setExploreOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [megaOpen, exploreOpen]);

    // Load courses
    useEffect(() => {
        let isActive = true;
        loadPublishedCourses()
            .then(({ courses: loadedCourses }) => {
                if (isActive) {
                    setCourses(loadedCourses);
                    setCoursesLoaded(true);
                }
            })
            .catch(() => {
                if (isActive) setCoursesLoaded(true);
            });
        return () => { isActive = false; };
    }, []);

    // Mobile menu: close on escape, click outside, prevent body scroll
    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === "Escape" && menuOpen) {
                setMenuOpen(false);
            }
        }
        function handleClickOutside(event) {
            if (menuOpen && navRef.current && !navRef.current.contains(event.target)) {
                // Only close if clicking outside the header entirely
                if (!event.target.closest('header')) {
                    setMenuOpen(false);
                }
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleClickOutside);

        // Prevent body scroll when mobile menu is open
        if (menuOpen && window.innerWidth <= 900) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    const closeMenu = () => setMenuOpen(false);

    const displayName = user?.user_metadata?.full_name?.trim()
        || user?.email?.split("@")[0]
        || (isEnglish ? "My account" : "حسابي");
    const avatarUrl = user?.user_metadata?.avatar_url
        || user?.user_metadata?.picture;
    const userInitial = [...displayName][0]?.toLocaleUpperCase(language) || (isEnglish ? "A" : "ح");

    // Get unique categories from courses
    const categories = Array.from(new Set(
        courses.map(c => c.category).filter(Boolean)
    ));

    // Filter courses based on search and filters
    const filteredCourses = courses.filter((course) => {
        const name = isEnglish ? (course.name || course.title_en || "") : (course.nameAr || course.title_ar || "");
        const desc = isEnglish ? (course.description || course.description_en || "") : (course.descriptionAr || course.description_ar || "");
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase())
            || desc.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === "all" || course.category === filterCategory;
        const matchesLevel = filterLevel === "all" || (course.difficulty && course.difficulty === filterLevel);
        return matchesSearch && matchesCategory && matchesLevel;
    });

    const levelNames = {
        beginner: isEnglish ? "Beginner" : "مبتدئ",
        intermediate: isEnglish ? "Intermediate" : "متوسط",
        advanced: isEnglish ? "Advanced" : "متقدم",
    };

    const categoryDisplayNames = {
        software: isEnglish ? "Programming & Software" : "البرمجيات والبرمجيات",
        electronics: isEnglish ? "Electronics & PCB" : "الإلكترونيات وتصميم اللوحات",
        robotics: isEnglish ? "Robotics" : "الروبوتات",
    };

    const exploreItems = [
        { path: "/learn", label: isEnglish ? "Learning Journey" : "الرحلة التعليمية" },
        { path: "/opinins", label: isEnglish ? "Student Reviews" : "آراء الطلاب" },
        { path: "/articals", label: isEnglish ? "Articles" : "المقالات" },
        { path: "/How", label: isEnglish ? "About Us" : "عن المنصة" },
        { path: "/contact", label: isEnglish ? "Contact" : "اتصل بنا" },
    ];

    return (
        <>
            <header className="content" ref={navRef} dir={isEnglish ? "ltr" : "rtl"}>
                <div className="logo">
                    <NavLink to="/" onClick={closeMenu}>
                        {isDark ? (
                            <img
                                src={publicAsset('Techshpere Logo Dark.svg')}
                                alt="Techshpere Logo"
                                className="logo-img"
                            />
                        ) : (
                            <img
                                src={publicAsset('Techshpere Logo Light.svg')}
                                alt="Techshpere Logo"
                                className="logo-img"
                            />
                        )}
                    </NavLink>
                </div>

                <nav id="main-navigation" className={`NavLink${menuOpen ? " is-open" : ""}`}>
                    <ul>
                        <li><NavLink to="/" activeClassName="active" onClick={closeMenu}>{isEnglish ? "Home" : "الرئيسية"}</NavLink></li>

                        {/* Courses with Mega Menu */}
                        <li className="mega-menu-item" onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)} onClick={closeMenu}>
                            <NavLink
                                to="/Courses"
                                activeClassName="active"
                                onClick={closeMenu}
                                className="courses-nav-link"
                            >
                                {isEnglish ? "Courses" : "الدورات"}
                                <span className="mega-arrow">▾</span>
                            </NavLink>
                            <div className="mega-menu" ref={megaMenuRef} onMouseEnter={() => setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)}>
                                <div className="mega-menu-header">
                                    <input
                                        type="text"
                                        placeholder={isEnglish ? "Search courses..." : "ابحث عن الكورسات..."}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="mega-search"
                                    />
                                    <button className="mega-view-all" onClick={() => { setMegaOpen(false); setMenuOpen(false); }}>
                                        {isEnglish ? "View All Courses" : "عرض جميع الكورسات"}
                                    </button>
                                </div>
                                <div className="mega-menu-body">
                                    {/* Left Sidebar: Filters */}
                                    <div className="mega-filters">
                                        <h4>{isEnglish ? "Category" : "القسم"}</h4>
                                        <ul className="filter-list">
                                            <li
                                                className={filterCategory === "all" ? "active" : ""}
                                                onClick={() => setFilterCategory("all")}
                                            >
                                                {isEnglish ? "All Courses" : "جميع الكورسات"}
                                            </li>
                                            {categories.map((cat) => (
                                                <li
                                                    key={cat}
                                                    className={filterCategory === cat ? "active" : ""}
                                                    onClick={() => setFilterCategory(cat)}
                                                >
                                                    {categoryDisplayNames[cat] || cat}
                                                </li>
                                            ))}
                                        </ul>
                                        <h4>{isEnglish ? "Level" : "المستوى"}</h4>
                                        <ul className="filter-list">
                                            <li className={filterLevel === "all" ? "active" : ""} onClick={() => setFilterLevel("all")}>
                                                {isEnglish ? "All Levels" : "جميع المستويات"}
                                            </li>
                                            <li className={filterLevel === "beginner" ? "active" : ""} onClick={() => setFilterLevel("beginner")}>
                                                {levelNames.beginner}
                                            </li>
                                            <li className={filterLevel === "intermediate" ? "active" : ""} onClick={() => setFilterLevel("intermediate")}>
                                                {levelNames.intermediate}
                                            </li>
                                            <li className={filterLevel === "advanced" ? "active" : ""} onClick={() => setFilterLevel("advanced")}>
                                                {levelNames.advanced}
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Right Content: Course Cards */}
                                    <div className="mega-courses">
                                        <h3>{isEnglish ? "Available Courses" : "الكورسات المتاحة"}</h3>
                                        {coursesLoaded && filteredCourses.length > 0 ? (
                                            <div className="course-grid">
                                                {filteredCourses.slice(0, 12).map((course) => (
                                                    <article
                                                        key={course.id || course.legacy_id}
                                                        className="mega-course-card"
                                                        onClick={() => {
                                                            setMegaOpen(false);
                                                            setMenuOpen(false);
                                                        }}
                                                    >
                                                        <div className="mega-course-image">
                                                            <img
                                                                src={course.image || publicAsset('image/programing.jpg')}
                                                                alt={isEnglish ? course.name : course.nameAr}
                                                                loading="lazy"
                                                            />
                                                        </div>
                                                        <div className="mega-course-info">
                                                            <span className="mega-course-category">
                                                                {categoryDisplayNames[course.category] || course.category || ''}
                                                            </span>
                                                            <h4 className="mega-course-title">
                                                                {isEnglish ? course.name : course.nameAr}
                                                            </h4>
                                                            <p className="mega-course-desc">
                                                                {isEnglish ? course.description : course.descriptionAr}
                                                            </p>
                                                            <div className="mega-course-footer">
                                                                <span className="mega-course-level">
                                                                    {levelNames[course.difficulty || 'beginner']}
                                                                </span>
                                                                <span className="mega-course-price">
                                                                    {formatCoursePrice(course.current_price, course.currency_code, language)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </article>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="mega-no-courses">
                                                {isEnglish ? "No courses available." : "لا توجد كورسات متاحة."}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li><NavLink to="/services" activeClassName="active" onClick={closeMenu}>{isEnglish ? "Services & Projects" : "الخدمات والمشاريع"}</NavLink></li>
                        <li><NavLink to="/jobs" className="jobs-nav-link" activeClassName="active" onClick={closeMenu}><span>{isEnglish ? "Jobs" : "الوظائف"}</span></NavLink></li>

                        {/* Explore Dropdown */}
                        <li className="dropdown-item" onMouseEnter={() => setExploreOpen(true)} onMouseLeave={() => setExploreOpen(false)} onClick={closeMenu}>
                            <NavLink
                                to="/learn"
                                activeClassName="active"
                                onClick={(e) => {
                                    if (window.innerWidth <= 900) {
                                        e.preventDefault();
                                        setExploreOpen(!exploreOpen);
                                    }
                                }}
                                className="explore-nav-link"
                            >
                                {isEnglish ? "Explore" : "استكشف"}
                                <span className="mega-arrow">▾</span>
                            </NavLink>
                            <div className={`explore-menu${exploreOpen && window.innerWidth <= 900 ? ' open' : ''}`} ref={exploreMenuRef} onMouseEnter={() => setExploreOpen(true)} onMouseLeave={() => setExploreOpen(false)}>
                                <ul className="explore-list">
                                    {exploreItems.map((item, idx) => (
                                        <li key={idx}>
                                            <NavLink
                                                to={item.path}
                                                activeClassName="active"
                                                onClick={closeMenu}
                                            >
                                                {item.label}
                                            </NavLink>
                                        </li>
                                    ))}
                                    <li>
                                        <NavLink
                                            to="/roadmaps"
                                            activeClassName="active"
                                            onClick={closeMenu}
                                        >
                                            {isEnglish ? "Roadmaps" : "خارطات التعلم"}
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </li>

                        {/* Mobile-only: Login/Account inside the menu */}
                        {window.innerWidth <= 900 && (
                            <li className="mobile-auth-item" style={{ marginTop: 16 }}>
                                {hasResolvedSession && user ? (
                                    <NavLink
                                        to="/account"
                                        className="account-button mobile-account-button"
                                        onClick={closeMenu}
                                        aria-label={isEnglish ? `Profile: ${displayName}` : `الملف الشخصي: ${displayName}`}
                                    >
                                        <span className="account-avatar" aria-hidden="true">
                                            {userInitial}
                                            {avatarUrl && (
                                                <img
                                                    src={avatarUrl}
                                                    alt=""
                                                    onError={(event) => {
                                                        event.currentTarget.style.display = "none";
                                                    }}
                                                />
                                            )}
                                        </span>
                                        <span className="account-button-name">{displayName}</span>
                                    </NavLink>
                                ) : (
                                    <NavLink
                                        to="/login"
                                        className="login-button mobile-login-button"
                                        onClick={closeMenu}
                                    >
                                        {isEnglish ? "Log in" : "تسجيل الدخول"}
                                    </NavLink>
                                )}
                            </li>
                        )}
                    </ul>
                </nav>

                <div className="icon">
                    <button
                        type="button"
                        className="theme-toggle"
                        aria-label={isDark
                            ? (isEnglish ? "Switch to light mode" : "التبديل إلى الوضع النهاري")
                            : (isEnglish ? "Switch to dark mode" : "التبديل إلى الوضع الليلي")}
                        title={isDark
                            ? (isEnglish ? "Light mode" : "الوضع النهاري")
                            : (isEnglish ? "Dark mode" : "الوضع الليلي")}
                        onClick={() => setTheme(isDark ? "light" : "dark")}
                    >
                        {isDark
                            ? <LightMode aria-hidden="true" />
                            : <DarkMode aria-hidden="true" />}
                    </button>
                    <div className="language-switch" role="group" aria-label={isEnglish ? "Choose language" : "اختيار اللغة"}>
                        <button
                            type="button"
                            className={language === "ar" ? "is-selected" : ""}
                            aria-pressed={language === "ar"}
                            onClick={() => setLanguage("ar")}
                        >
                            عربي
                        </button>
                        <button
                            type="button"
                            className={language === "en" ? "is-selected" : ""}
                            aria-pressed={language === "en"}
                            onClick={() => setLanguage("en")}
                        >
                            English
                        </button>
                    </div>
                    {window.innerWidth > 900 && (
                        <>
                            {hasResolvedSession && user ? (
                                <NavLink
                                    to="/account"
                                    className="account-button"
                                    onClick={closeMenu}
                                    aria-label={isEnglish ? `Profile: ${displayName}` : `الملف الشخصي: ${displayName}`}
                                >
                                    <span className="account-avatar" aria-hidden="true">
                                        {userInitial}
                                        {avatarUrl && (
                                            <img
                                                src={avatarUrl}
                                                alt=""
                                                onError={(event) => {
                                                    event.currentTarget.style.display = "none";
                                                }}
                                            />
                                        )}
                                    </span>
                                    <span className="account-button-name">{displayName}</span>
                                </NavLink>
                            ) : (
                                <NavLink
                                    to="/login"
                                    className="login-button"
                                    onClick={closeMenu}
                                >
                                    {isEnglish ? "Log in" : "تسجيل الدخول"}
                                </NavLink>
                            )}
                        </>
                    )}
                    <button
                        type="button"
                        className="nav-toggle"
                        aria-label={menuOpen
                            ? (isEnglish ? "Close menu" : "إغلاق القائمة")
                            : (isEnglish ? "Open menu" : "فتح القائمة")}
                        aria-expanded={menuOpen}
                        aria-controls="main-navigation"
                        onClick={() => setMenuOpen((isOpen) => !isOpen)}
                    >
                        {menuOpen ? <Close /> : <Menu />}
                    </button>
                </div>
            </header>
            <a
                className="whatsapp-float"
                href="https://chat.whatsapp.com/EzalDnBGtEW1elVg0c1lcK"
                target="_blank"
                rel="noreferrer"
                aria-label={isEnglish ? "Contact us on WhatsApp" : "تواصل معنا عبر واتساب"}
                title={isEnglish ? "Contact us on WhatsApp" : "تواصل معنا عبر واتساب"}
            >
                <WhatsApp />
            </a>
        </>
    );
}

export default Header;
