import { useMemo, useState } from 'react'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem('access_token'),
  )

  function login(accessToken) {
    localStorage.setItem('access_token', accessToken)
    setToken(accessToken)
  }

  function logout() {
    localStorage.removeItem('access_token')
    setToken(null)
  }

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}