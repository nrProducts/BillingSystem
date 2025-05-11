import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../../supabase/client'
import './login.css'

const Login = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth?.onAuthStateChange((event, session) => {
      if (session) {
        sessionStorage.setItem('userId', session?.user?.id);
        sessionStorage.setItem('emailId', session?.user?.email);
        // ✅ Redirect when session is present (login or signup)
        navigate('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  return (
    <div className="container">
      <div className="image-side" />
      <div className="form-side">
        <div className="login-box">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#087890',
                    brandAccent: '#087890',
                  },
                },
              },
            }}
            providers={['google', 'apple', 'facebook']} //  twitter
          />
        </div>
      </div>
    </div>
  )

}

export default Login
