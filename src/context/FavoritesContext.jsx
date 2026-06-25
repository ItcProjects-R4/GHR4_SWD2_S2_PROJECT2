/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { createContext, useState, useEffect, useContext } from 'react'
import { userContext } from './UserContext'
import { useAuthModal } from './AuthModalContext'
import toast from 'react-hot-toast'

export const FavoritesContext = createContext()

export function FavoritesProvider({ children }) {
  const { isLogin } = useContext(userContext)
  const { openAuthModal } = useAuthModal()

  // Initialize favorites from localStorage immediately
  const [favorites, setFavorites] = useState(() => {
    // Try to load from localStorage on initial render
    if (isLogin && isLogin.email) {
      const key = `podcastFavorites_${isLogin.email}`
      const savedFavorites = localStorage.getItem(key)
      if (savedFavorites) {
        try {
          return JSON.parse(savedFavorites)
        } catch (error) {
          console.error('Error parsing favorites:', error)
          return []
        }
      }
    }
    return []
  })

  // Build the localStorage key for the current user's email
  const getStorageKey = () => {
    if (isLogin && isLogin.email) {
      return `podcastFavorites_${isLogin.email}`
    }
    return null
  }

  // Load favorites from localStorage when user changes (login/logout)
  useEffect(() => {
    const key = getStorageKey()
    if (key) {
      const savedFavorites = localStorage.getItem(key)
      if (savedFavorites) {
        try {
          const parsed = JSON.parse(savedFavorites)
          setFavorites(parsed)
        } catch (error) {
          console.error('Error loading favorites:', error)
          setFavorites([])
        }
      } else {
        setFavorites([])
      }
    } else {
      // No user logged in, clear favorites from state
      setFavorites([])
    }
  }, [isLogin])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    const key = getStorageKey()
    if (key) {
      localStorage.setItem(key, JSON.stringify(favorites))
    }
  }, [favorites, isLogin])

  // Also save to a general key for persistence across refreshes
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem('podcastFavorites_lastUser', JSON.stringify(favorites))
    }
  }, [favorites])

  const addFavorite = (podcast) => {
    setFavorites((prev) => {
      // Check if already exists
      const exists = prev.some((fav) => fav.id === podcast.id)
      if (exists) return prev
      return [...prev, podcast]
    })
  }

  const removeFavorite = (podcastId) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== podcastId))
  }

  const isFavorite = (podcastId) => {
    return favorites.some((fav) => fav.id === podcastId)
  }

  const toggleFavorite = (podcast) => {
    if (!isLogin) {
      openAuthModal('login', 'Log in to save podcasts to your favorites.')
      return
    }

    if (isFavorite(podcast.id)) {
      removeFavorite(podcast.id)
      toast.success('Removed from favorites')
    } else {
      addFavorite(podcast)
      toast.success('Added to favorites')
    }
  }

  const clearFavorites = () => {
    setFavorites([])
    const key = getStorageKey()
    if (key) {
      localStorage.removeItem(key)
    }
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}
