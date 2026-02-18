import React, { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
    isDarkSection: boolean
    setIsDarkSection: (value: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDarkSection, setIsDarkSection] = useState(false)

    useEffect(() => {
        if (typeof document !== 'undefined') {
            if (isDarkSection) {
                document.documentElement.setAttribute('data-theme', 'dark')
            } else {
                document.documentElement.removeAttribute('data-theme')
            }
        }
    }, [isDarkSection])

    return <ThemeContext.Provider value={{ isDarkSection, setIsDarkSection }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider')
    }
    return context
}
