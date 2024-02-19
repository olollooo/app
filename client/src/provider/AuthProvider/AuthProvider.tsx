import { createContext, useState, useContext, useEffect } from 'react'
import { auth } from '../../lib/Firebase/FireBase'
import type { User } from 'firebase/auth'
import { Box, CircularProgress } from '@mui/material'

import './AuthProvider.scss'

type Props = {
  children: React.ReactNode
}

type UserType = User | null

const AuthContext = createContext<UserType>(null)

export const useAuthContext = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserType>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribed = auth.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })
    return () => {
      unsubscribed()
    }
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress id="load-icon" />
      </Box>
    )
  } else {
    return (
      <AuthContext.Provider value={user}>
        {!loading && children}
      </AuthContext.Provider>
    )
  }
}
