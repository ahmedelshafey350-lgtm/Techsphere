import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { useLanguage } from '../i18n/language';
import { publicAsset } from '../utils/publicAsset.js';

function Footer() {
    const { language } = useLanguage();
    const isEnglish = language === 'en';

    return (
        <footer className="modern-footer" dir={isEnglish ? "ltr" : "rtl"}>
            {/* Top decorative wave */}
            <div className="footer-wave">
                <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,60C288,60 576,180 864,180S1152,60 1440,60V120H0V60Z" fill="#ffffff" opacity="0.9" />
                </svg>
            </div>

            <div className="footer-container">
                {/* Brand Section */}
                <div className="footer-brand">
                    <div className="footer-logo">
                        <img src={publicAsset('Techshpere Orbit Tech Logo.png')} alt="Techshpere" />
                    </div>
                    <p className="footer-desc">
                        {isEnglish
                            ? 'Empowering the next generation of tech innovators through world-class education in programming, artificial intelligence, and electronics.'
                            : 'تمكين الجيل القادم من المبتكرين التقنيين من خلال تعليم عالمي المستوى في البرمجة والذكاء الاصطناعي والإلكترونيات.'}
                    </p>
                    <div className="footer-social">
                        <a href="#" className="social-link" aria-label="Facebook">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.084 3.013 9.42 7.15 11.285v-8.285H4.916v-2.262h2.234v-2.262c0-2.456 1.392-3.916 3.53-3.916 1.054 0 2.127.218 2.127.218v3.04h3.26l-.592 2.262H8.89v4.264H10.6v8.285c4.137-1.865 6.99-6.202 6.99-11.285z" />
                            </svg>
                        </a>
                        <a href="#" className="social-link" aria-label="Twitter">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92c-1.09.325-2.26.5-3.49.6-.32-.06-.64-.15-.95-.25 1.42-.81 2.41-2.18 2.77-3.79-1.33.79-2.8 1.28-4.35 1.58-1.26-.79-2.1-2.05-2.1-3.46 0-.78.22-1.5.59-2.08-.74-.12-1.45-.23-2.21-.28a6.062 6.062 0 00-4.77 2.04 6.062 6.062 0 00-2.15-6.13C2.05 4.26 3.63 4.94 5.43 5.17c-.57-2.78-.18-5.75 1.38-7.8 0 0-1.14.37-1.21 1.25 0 0-.97-.09-1.96.67a6.04 6.04 0 00-.45 3.05c0 1.05.35 2.04.89 2.78a8.15 8.15 0 01-2.58-.64c-.53 0-1.05.1-1.56.27A8.04 8.04 0 006.6 18.05c-.45 1.73-.72 3.49-.72 5.31 0 1.04.08 2.06.22 3.05-3.98-.55-7.5-2.3-9.99-4.75 0 .06 0 .14.01.21 0 4.11 2.92 7.54 6.74 8.23a9.95 9.95 0 01-2.79.19c-.7 0-1.37-.1-2.05-.28v.05c0 4.11 3.16 7.53 7.28 8.23a9.8 9.8 0 01-2.49.65c-.68 0-1.33-.09-1.96-.27a10.02 10.02 0 007.32 2.33c-3.19 2.48-7.26 3.97-11.7 3.97z" />
                            </svg>
                        </a>
                        <a href="#" className="social-link" aria-label="Instagram">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.42 18.07 3.63 17.7 3.63 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.997.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.785.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                        <a href="#" className="social-link" aria-label="YouTube">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.245 3.245 0 00-2.122-2.122C19.505 3 19 3 19 3s-.495 0-2.374.064A3.243 3.243 0 0013.502 4A3.243 3.243 0 0012.53 2C6.477 2 4 2 4 2s-.495 0-2.374.064A3.245 3.245 0 00.502 4.064a3.245 3.245 0 000 4.502C.495 20 3 20 3 20s.495 0 2.374-.064A3.243 3.243 0 008.502 20a3.243 3.243 0 002.532-.172c1.878-.064 4.332-.064 8.464-.064s6.586 0 8.464.064a3.243 3.243 0 002.532.172c1.879.064 4.333.064 8.464.064 4.295 0 4.798 0 4.798 0a3.245 3.245 0 002.122-2.122c.416-.416.687-1.02.687-1.659s-.271-1.243-.687-1.659zM10 8H8v8h2V8zm8 8h-2v-8h2V16z" />
                            </svg>
                        </a>
                        <a href="#" className="social-link" aria-label="LinkedIn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.063 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.063-2.064 2.063zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.75v20.491C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.242V1.75C24 .774 23.2 0 22.222 0z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="footer-links">
                    <div className="footer-column">
                        <h3>{isEnglish ? 'Explore' : 'استكشف'}</h3>
                        <ul>
                            <li><Link to="/Courses">{isEnglish ? 'Courses' : 'الكورسات'}</Link></li>
                            <li><Link to="/services">{isEnglish ? 'Projects & Services' : 'المشاريع والخدمات'}</Link></li>
                            <li><Link to="/jobs">{isEnglish ? 'Careers' : 'الوظائف'}</Link></li>
                            <li><Link to="/articals">{isEnglish ? 'Articles' : 'المقالات'}</Link></li>
                            <li><Link to="/about">{isEnglish ? 'About Us' : 'عن المنصة'}</Link></li>
</ul>
</div>
                    <div className="footer-column">
                        <h3>{isEnglish ? 'Support' : 'الدعم'}</h3>
                        <ul>
                            <li><Link to="/faq">{isEnglish ? 'FAQ' : 'الأسئلة الشائعة'}</Link></li>
                            <li><Link to="/contact">{isEnglish ? 'Contact Us' : 'اتصل بنا'}</Link></li>
                            <li><Link to="/policies">{isEnglish ? 'Privacy Policy' : 'سياسة الخصوصية'}</Link></li>
                            <li><Link>{isEnglish ? 'Terms of Service' : 'شروط الخدمة'}</Link></li>
                            <li><Link to="/login">{isEnglish ? 'Login' : 'تسجيل الدخول'}</Link></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>{isEnglish ? 'Contact Info' : 'معلومات الاتصال'}</h3>
                        <ul>
                            <li><Link dir="ltr">+20 104 434 8513</Link></li>
                            <li>{isEnglish ? 'Mansoura — Toshka Gate' : 'المنصورة — بوابة توشكى'}</li>
                            <li dir="ltr">info@techsphere.edu</li>
                            <li dir="ltr">Mon - Sat: 9:00 AM - 6:00 PM</li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>{isEnglish ? 'Newsletter' : 'النشرة البريدية'}</h3>
                        <p>{isEnglish ? 'Subscribe to get the latest courses and offers.' : 'اشترك للحصول على أحدث الكورسات والعروض.'}</p>
                        <div className="newsletter">
                            <input type="email" placeholder={isEnglish ? 'Enter your email' : 'أدخل بريدك الإلكتروني'} />
                            <button>{isEnglish ? 'Subscribe' : 'اشتراك'}</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <span className="copyright">
                        © {new Date().getFullYear()} Techshpere. {isEnglish ? 'All rights reserved.' : 'جميع الحقوق محفوظة.'}
                    </span>
                    <div className="footer-bottom-links">
                        <Link to="/">{isEnglish ? 'Home' : 'الرئيسية'}</Link>
                        <Link to="/about">{isEnglish ? 'About' : 'عن المنصة'}</Link>
                        <Link to="/contact">{isEnglish ? 'Contact' : 'اتصل بنا'}</Link>
                        <Link to="/policies">{isEnglish ? 'Policies' : 'السياسات'}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
