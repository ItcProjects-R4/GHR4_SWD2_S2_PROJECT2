import React, { createContext, useState, useEffect, useContext } from 'react'
import { userContext } from './UserContext'

export const SearchContext = createContext()

export function SearchProvider({ children }) {
  const { isLogin } = useContext(userContext)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState({ podcasts: [] })
  const [isSearching, setIsSearching] = useState(false)

  const getThemeKey = () => {
    return isLogin && isLogin.email ? `darkMode_${isLogin.email}` : 'darkMode'
  }

  // Dark Mode with system preference detection and per-user saving
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first
    // Use the per-user key if available
    let key = 'darkMode'
    // Since this runs on initial render, we can use the current isLogin state
    if (isLogin && isLogin.email) {
      key = `darkMode_${isLogin.email}`
    }
    
    const savedDarkMode = localStorage.getItem(key)
    if (savedDarkMode !== null) {
      return JSON.parse(savedDarkMode)
    }
    // Fall back to general darkMode if per-user doesn't exist
    if (isLogin && isLogin.email) {
       const globalTheme = localStorage.getItem('darkMode')
       if (globalTheme !== null) {
         return JSON.parse(globalTheme)
       }
    }
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Listen for user changes to reload their theme preference
  useEffect(() => {
    const key = getThemeKey()
    const savedDarkMode = localStorage.getItem(key)
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode))
    } else if (isLogin === null) {
      // If logged out and no global theme, check system preference
       const globalTheme = localStorage.getItem('darkMode')
       if (globalTheme !== null) {
         setDarkMode(JSON.parse(globalTheme))
       } else {
         setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
       }
    }
  }, [isLogin])

  // Apply dark mode class to document and save preference
  useEffect(() => {
    const key = getThemeKey()
    localStorage.setItem(key, JSON.stringify(darkMode))

    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [darkMode])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set preference
      const key = getThemeKey()
      const savedDarkMode = localStorage.getItem(key)
      if (savedDarkMode === null) {
        setDarkMode(e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults({ podcasts: [] })
  }

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
        isSearching,
        setIsSearching,
        clearSearch,
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}