import React, { useEffect } from "react";
import {
    Switch,
    Route,
    useLocation
} from "react-router-dom";

import Home from "../Home/Home";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import About from "../About/About";
import Review from "../Opinins/Review";
import Courses from "../Courses/Courses";
import CourseDetails from "../Courses/CourseDetails";
import Contact from "../Contact/Contact";
import Articals from "../Artcalis/Articals";
import Education from "../Education/Education";
import ContactForm from "../Traning/TraningCompany";
import PayMant from "../Paymant/PayMant";
import CourseBannerCard from "../OneArticals/OneArticals";
import BookingSuccessCard from "../SuccesPayment/PaymentSucces";
import Induvuial from "../Traning/TraningIndivual";
import FormIndivual from "../Traning/FormIndivual";
import Login from "../login/Login";
import Profile from "../login/Profile";
import Jobs from "../Jobs/Jobs";
import { FAQPage, PoliciesPage } from "../InfoPages/InfoPages";
import AdminDashboard from "../Admin/AdminDashboard";
import { useLanguage } from "../i18n/language";
import Services from "../Projects/Services";
import CategoryProjects from "../Projects/CategoryProjects";
import ProjectDetails from "../Projects/ProjectDetails";
import ProjectRequestForm from "../Projects/ProjectRequestForm";
import PrivateProjectDetails from "../Projects/PrivateProjectDetails";
import MyProjects from "../Projects/MyProjects";
import TrackList from "../Roadmaps/components/TrackList";
import RoadmapView from "../Roadmaps/components/RoadmapView";

const pageTitles = {
    "/": "Techsphere | التعليم والتدريب التقني",
    "/How": "من نحن | Techsphere",
    "/opinins": "آراء الطلاب | Techsphere",
    "/Courses": "الدورات التدريبية | Techsphere",
    "/jobs": "الوظائف | Techsphere",
    "/faq": "الأسئلة الشائعة | Techsphere",
    "/policies": "الخصوصية وسياسات التسجيل | Techsphere",
    "/admin": "إدارة الطلبات | Techsphere",
    "/contact": "تواصل معنا | Techsphere",
    "/articals": "المقالات | Techsphere",
    "/learn": "الرحلة التعليمية | Techsphere",
    "/traning/company": "تدريب الشركات | Techsphere",
    "/traning/induvial": "تفعيل حساب الطالب | Techsphere",
    "/FormIndivuail": "تدريب الأفراد | Techsphere",
    "/FormInduvuail": "تدريب الأفراد | Techsphere",
    "/login": "تسجيل الدخول | Techsphere",
    "/account": "حسابي | Techsphere",
    "/services": "الخدمات والمشاريع | Techsphere",
    "/my-projects": "مشاريعي | Techsphere",
    "/project-request": "طلب مشروع | Techsphere",
    "/roadmaps": "خارطات التعلم | Techsphere",
};

function ScrollToTop() {
    const { pathname } = useLocation();
    const { language } = useLanguage();

    useEffect(() => {
        window.scrollTo(0, 0);

        const title = language === "en"
            ? ({
                "/": "Techsphere | Technical Education and Training",
                "/How": "About Us | Techsphere",
                "/opinins": "Student Reviews | Techsphere",
                "/Courses": "Courses | Techsphere",
                "/jobs": "Career paths | Techsphere",
                "/faq": "Frequently Asked Questions | Techsphere",
                "/policies": "Privacy and Enrollment Policies | Techsphere",
                "/admin": "Request Administration | Techsphere",
                "/contact": "Contact Us | Techsphere",
                "/articals": "Articles | Techsphere",
                "/learn": "Learning Journey | Techsphere",
                "/traning/company": "Company Training | Techsphere",
                "/traning/induvial": "Student Activation | Techsphere",
                "/FormIndivuail": "Individual Training | Techsphere",
                "/FormInduvuail": "Individual Training | Techsphere",
                "/login": "Log in | Techsphere",
                "/account": "My Account | Techsphere",
                "/services": "Services & Projects | Techsphere",
                "/my-projects": "My Projects | Techsphere",
            }[pathname]
                || (pathname.startsWith("/Payment/") && "Complete Your Enrollment | Techsphere")
                || (pathname.startsWith("/Courses/") && "Course Details | Techsphere")
                || (pathname.startsWith("/services/") && "Project Details | Techsphere")
                || (pathname.startsWith("/projects/") && "Private Project | Techsphere")
                || (pathname.startsWith("/Success/") && "Enrollment Confirmed | Techsphere")
                || (pathname.startsWith("/articalis/") && "Learning Article | Techsphere")
                || (pathname.startsWith("/roadmaps/") && "Learning Roadmap | Techsphere")
                || "Techsphere | Technical Education and Training")
            : pageTitles[pathname]
            || (pathname.startsWith("/Payment/") && "إتمام الاشتراك | Techsphere")
            || (pathname.startsWith("/Courses/") && "تفاصيل الكورس | Techsphere")
            || (pathname.startsWith("/services/") && "تفاصيل المشروع | Techsphere")
            || (pathname.startsWith("/projects/") && "مشروع خاص | Techsphere")
            || (pathname.startsWith("/Success/") && "تأكيد الاشتراك | Techsphere")
            || (pathname.startsWith("/articalis/") && "مقال تعليمي | Techsphere")
            || (pathname.startsWith("/roadmaps/") && "خارطة تعلم | Techsphere")
            || "Techsphere | التعليم والتدريب التقني";

        document.title = title;
    }, [language, pathname]);

    return null;
}

export default function BasicExample() {
    return (
        <>
            <ScrollToTop />
            <Header />
            <div className="page-layout">
                <main className="page-content">
                    <Switch>
                        <Route exact path="/">
                        <Home />
                    </Route>
                    <Route exact path="/How">
                        <About />
                    </Route>
                    <Route exact path="/opinins">
                        <Review />
                    </Route>
                    <Route exact path="/Courses">
                        <Courses />
                    </Route>
                    <Route exact path="/Courses/:id">
                        <CourseDetails />
                    </Route>
                    <Route exact path="/services">
                        <Services />
                    </Route>
                    <Route exact path="/services/category/:slug">
                        <CategoryProjects />
                    </Route>
                    <Route exact path="/services/:slug">
                        <ProjectDetails />
                    </Route>
                    <Route exact path="/project-request">
                        <ProjectRequestForm />
                    </Route>
                    <Route exact path="/projects/:projectCode">
                        <PrivateProjectDetails />
                    </Route>
                    <Route exact path="/my-projects">
                        <MyProjects />
                    </Route>
                    <Route exact path="/jobs">
                        <Jobs />
                    </Route>
                    <Route exact path="/faq">
                        <FAQPage />
                    </Route>
                    <Route exact path="/policies">
                        <PoliciesPage />
                    </Route>
                    <Route exact path="/admin">
                        <AdminDashboard />
                    </Route>
                    <Route exact path="/contact">
                        <Contact />
                    </Route>
                    <Route exact path="/articals">
                        <Articals />
                    </Route>
                    <Route exact path="/roadmaps">
                        <TrackList />
                    </Route>
                    <Route exact path="/roadmaps/:trackId">
                        <RoadmapView />
                    </Route>
                    <Route exact path="/learn">
                        <Education />
                    </Route>
                    <Route exact path="/traning/company">
                        <ContactForm/>
                    </Route>
                    <Route exact path="/traning/induvial">
                        <Induvuial/>
                    </Route>
                    <Route exact path="/FormInduvuail">
                        <FormIndivual/>
                    </Route>
                    <Route exact path="/FormIndivuail">
                        <FormIndivual/>
                    </Route>
                    <Route exact path="/login">
                        <Login />
                    </Route>
                    <Route exact path="/account">
                        <Profile />
                    </Route>
                    <Route exact path="/Payment/:id">
                        <PayMant/>
                    </Route>
                    <Route exact path="/articalis/:id">
                        <CourseBannerCard/>
                    </Route>
                    <Route exact path="/Success/:id">
                        <BookingSuccessCard/>
                    </Route>
                </Switch>
                </main>
                <Footer />
            </div>
        </>
    );
}
