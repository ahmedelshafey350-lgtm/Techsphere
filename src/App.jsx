
import { useEffect } from "react"
import BasicExample from "./Router/Router"
import { LanguageProvider } from "./i18n/LanguageContext"
import { ThemeProvider } from "./i18n/ThemeContext"

function App() {
  useEffect(() => {
    const loader = document.getElementById("app-loader")

    if (!loader) {
      return undefined
    }

    loader.classList.add("is-hidden")
    const removeTimeout = window.setTimeout(() => {
      loader.remove()
    }, 300)

    return () => {
      window.clearTimeout(removeTimeout)
    }
  }, [])

  return (
    <LanguageProvider>
      <ThemeProvider>
        <BasicExample />
      </ThemeProvider>
    </LanguageProvider>
  )
}

export default App
