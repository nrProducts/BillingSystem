import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabase/client'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {    
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
      }
    }
    initSession()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)
