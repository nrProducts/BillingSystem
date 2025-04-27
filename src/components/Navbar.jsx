import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'

const Navbar = () => {
    const [session, setSession] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        // Get current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    return (
        <nav style={{ marginBottom: '20px' }}>
            <Link to="/">Home</Link>
            {session ? (
                <>
                    {' | '}
                    <Link to="/items">Manage Items</Link>
                    {' | '}
                    {/* <Link to="/profile">Profile</Link> */}
                    {/* {' | '} */}
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    {' | '}
                    <Link to="/login">Login</Link>
                </>
            )}
        </nav>
    )
}

export default Navbar
