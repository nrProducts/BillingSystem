import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../supabase/client'

const Login = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // ✅ Redirect when session is present (login or signup)
        navigate('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  return (
    <div>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        // providers={['google']} // optional
      />
    </div>
  )
}

export default Login
