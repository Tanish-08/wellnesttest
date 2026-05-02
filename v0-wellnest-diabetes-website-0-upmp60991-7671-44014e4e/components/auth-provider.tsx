"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { apiUrl } from "@/lib/api"

interface User {
  id: string
  full_name: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (token: string, userData: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadSession() {
      const savedToken = localStorage.getItem("token")
      const savedUser = localStorage.getItem("wellnest_user")

      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
        
        // Verify token validity with backend
        try {
          const res = await fetch(apiUrl("/auth/me"), {
            headers: {
              "Authorization": `Bearer ${savedToken}`
            }
          })
          if (!res.ok) {
            throw new Error("Session expired")
          }
          const userData = await res.json()
          setUser(userData)
          localStorage.setItem("wellnest_user", JSON.stringify(userData))
        } catch (err) {
          console.error("Session verification failed:", err)
          logout()
        }
      }
      setIsLoading(false)
    }

    loadSession()
  }, [])

  const login = (newToken: string, userData: User) => {
    setToken(newToken)
    setUser(userData)
    localStorage.setItem("token", newToken)
    localStorage.setItem("wellnest_user", JSON.stringify(userData))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("wellnest_user")
    window.location.href = "/login"
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
