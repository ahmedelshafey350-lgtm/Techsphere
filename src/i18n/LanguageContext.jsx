import { useLayoutEffect, useMemo, useState } from "react";
import { LanguageContext } from "./language";

function getInitialLanguage() {
    const savedLanguage = window.localStorage.getItem("techsphere-language");
    return savedLanguage === "en" ? "en" : "ar";
}

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(getInitialLanguage);

    useLayoutEffect(() => {
        const isEnglish = language === "en";
        document.documentElement.lang = language;
        document.documentElement.dir = isEnglish ? "ltr" : "rtl";
        window.localStorage.setItem("techsphere-language", language);
    }, [language]);

    const value = useMemo(() => ({ language, setLanguage }), [language]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}
