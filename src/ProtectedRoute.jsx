import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './supabase/client'

const ProtectedRoute = ({ children }) => {
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setLoading(false)
        })

        // Optional: Subscribe to auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (loading) return <div>Loading...</div>
    if (!session) return <Navigate to="/login" />
    return children
}

export default ProtectedRoute
