import React, { useEffect, useState } from "react";
import { NavLink  } from "react-router-dom";
import { WhatsApp } from  '@mui/icons-material';
import { Menu } from  '@mui/icons-material';
import { Close }  from '@mui/icons-material';
import { DarkMode, LightMode } from "@mui/icons-material";
import { getSupabaseClient, isSupabaseConfigured } from "../login/supabase";
import { useLanguage } from "../i18n/language";
import { useTheme } from "../i18n/theme";
import './Header.css'

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

    const displayName = user?.user_metadata?.full_name?.trim()
        || user?.email?.split("@")[0]
        || (isEnglish ? "My account" : "حسابي");
    const avatarUrl = user?.user_metadata?.avatar_url
        || user?.user_metadata?.picture;
    const userInitial = [...displayName][0]?.toLocaleUpperCase(language) || (isEnglish ? "A" : "ح");

    return (
        <>
            <header className="content" dir={isEnglish ? "ltr" : "rtl"}>
                <div className="logo">
                    <NavLink to="/" onClick={() => setMenuOpen(false)}>
                        <img
                            src="/Techshpere Orbit Tech Logo.png"
                            alt="Techshpere Logo"
                        />
                    </NavLink>
                </div>

                <nav id="main-navigation" className={`NavLink${menuOpen ? " is-open" : ""}`}>
                    <ul>
                        <li><NavLink to="/" activeClassName="active" onClick={() => setMenuOpen(false)}>{isEnglish ? "Home" : "الرئيسية"}</NavLink></li>
                        <li><NavLink to="/Courses" activeClassName="active" onClick={() => setMenuOpen(false)}>{isEnglish ? "Courses" : "الدورات"}</NavLink></li>
                        <li>
                            <NavLink
                                to="/jobs"
                                className="jobs-nav-link"
                                activeClassName="active"
                                onClick={() => setMenuOpen(false)}
                            >
                                <span>{isEnglish ? "Jobs" : "الوظائف"}</span>
                            </NavLink>
                        </li>
                        <li><NavLink to="/learn" activeClassName="active" onClick={() => setMenuOpen(false)}>{isEnglish ? "Learning journey" : "الرحلة التعليمية"}</NavLink></li>
                        <li><NavLink to="/opinins" activeClassName="active" onClick={() => setMenuOpen(false)}>{isEnglish ? "Student reviews" : "آراء الطلاب"}</NavLink></li>
                        <li><NavLink to="/articals" activeClassName="active" onClick={() => setMenuOpen(false)}>{isEnglish ? "Articles" : "المقالات"}</NavLink></li>
                        <li><NavLink to="/How" activeClassName="active" onClick={() => setMenuOpen(false)}>{isEnglish ? "About us" : "من نحن"}</NavLink></li>
                        <li><NavLink to="/contact" activeClassName="active" onClick={() => setMenuOpen(false)}>{isEnglish ? "Contact" : "تواصل معنا"}</NavLink></li>
                        <li className="mobile-login-link">
                            <NavLink
                                to={user ? "/account" : "/login"}
                                activeClassName="active"
                                onClick={() => setMenuOpen(false)}
                            >
                                {user ? (isEnglish ? "My account" : "حسابي") : (isEnglish ? "Log in" : "تسجيل الدخول")}
                            </NavLink>
                        </li>
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
                    {hasResolvedSession && user ? (
                        <NavLink
                            to="/account"
                            className="account-button"
                            onClick={() => setMenuOpen(false)}
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
                            onClick={() => setMenuOpen(false)}
                        >
                            {isEnglish ? "Log in" : "تسجيل الدخول"}
                        </NavLink>
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
                href="https://wa.me/201271611263?s=t"
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
