import { useState, useCallback } from 'react'
import { tokenStorage } from '@/shared/api/apiClient'

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => tokenStorage.get() !== null)

  const login = useCallback((token: string) => {
    tokenStorage.set(token)
    setIsLoggedIn(true)
  }, [])

  const logout = useCallback(() => {
    tokenStorage.remove()
    setIsLoggedIn(false)
  }, [])

  return { isLoggedIn, login, logout }
}
