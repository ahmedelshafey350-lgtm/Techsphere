
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

    const hideTimeout = window.setTimeout(() => {
      loader.classList.add("is-hidden")
    }, 350)
    const removeTimeout = window.setTimeout(() => {
      loader.remove()
    }, 700)

    return () => {
      window.clearTimeout(hideTimeout)
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
