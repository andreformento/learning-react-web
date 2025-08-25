import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { connect } from 'getstream'

interface StreamContextType {
  streamClient: any
  chatClient: any | null
  currentUser: any
  login: (userId: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const StreamContext = createContext<StreamContextType | undefined>(undefined)

export const useStream = () => {
  const context = useContext(StreamContext)
  if (!context) {
    throw new Error('useStream must be used within a StreamProvider')
  }
  return context
}

interface StreamProviderProps {
  children: ReactNode
}

export const StreamProvider: React.FC<StreamProviderProps> = ({ children }) => {
  const [streamClient, setStreamClient] = useState<any>(null)
  const [chatClient, setChatClient] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const apiKey = (import.meta as any).env.VITE_STREAM_API_KEY
    const apiSecret = (import.meta as any).env.VITE_STREAM_API_SECRET
    const appId = (import.meta as any).env.VITE_STREAM_APP_ID
    if (apiKey && apiSecret && appId) {
      const client = connect(apiKey, apiSecret, appId)
      setStreamClient(client)
    }
  }, [])

  const login = async (userId: string) => {
    try {
      const apiKey = (import.meta as any).env.VITE_STREAM_API_KEY
      const apiSecret = (import.meta as any).env.VITE_STREAM_API_SECRET
      const appId = (import.meta as any).env.VITE_STREAM_APP_ID
      const backendUrl = (import.meta as any).env.VITE_BACKEND_URL || 'http://localhost:3000'

      if (!apiKey || !apiSecret || !appId) {
        throw new Error('Missing Stream API configuration')
      }

      // Call backend to create/login user
      const response = await fetch(`${backendUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      })

      if (!response.ok) {
        throw new Error('Failed to create user')
      }

      // Ensure streamClient is initialized
      if (!streamClient) {
        const client = connect(apiKey, apiSecret, appId)
        setStreamClient(client)
      }

      // For now, just set the user as authenticated without chat
      setCurrentUser({ id: userId })
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    if (chatClient) {
      // chatClient.disconnectUser()
    }
    setChatClient(null)
    setCurrentUser(null)
    setIsAuthenticated(false)
  }

  const value: StreamContextType = {
    streamClient,
    chatClient,
    currentUser,
    login,
    logout,
    isAuthenticated
  }

  return (
    <StreamContext.Provider value={value}>
      {children}
    </StreamContext.Provider>
  )
}
