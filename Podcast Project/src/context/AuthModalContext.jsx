/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

const AuthModalContext = createContext(null)

export function AuthModalProvider({ children }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'login',
    reason: '',
  })

  const openAuthModal = (mode = 'login', reason = '') => {
    setModalState({ isOpen: true, mode, reason })
  }

  const closeAuthModal = () => {
    setModalState((current) => ({ ...current, isOpen: false, reason: '' }))
  }

  const switchAuthMode = (mode) => {
    setModalState((current) => ({ ...current, mode }))
  }

  return (
    <AuthModalContext.Provider
      value={{
        ...modalState,
        openAuthModal,
        closeAuthModal,
        switchAuthMode,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  const context = useContext(AuthModalContext)

  if (!context) {
    throw new Error('useAuthModal must be used within AuthModalProvider')
  }

  return context
}
