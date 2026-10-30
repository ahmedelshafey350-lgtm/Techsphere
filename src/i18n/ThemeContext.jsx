import { useLayoutEffect, useMemo, useState } from "react";
import { ThemeContext } from "./theme";

function getInitialTheme() {
    return window.localStorage.getItem("techsphere-theme") === "dark"
        ? "dark"
        : "light";
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getInitialTheme);

    useLayoutEffect(() => {
        document.documentElement.dataset.theme = theme;
        window.localStorage.setItem("techsphere-theme", theme);
    }, [theme]);

    const value = useMemo(() => ({ theme, setTheme }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}
