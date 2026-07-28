import { useState } from 'react'
import { loginUser } from '../api/auth'
import { useAuth } from '../context/useAuth'
import { Navigate, useNavigate } from 'react-router-dom'

function LoginPage() {
    const { login, isAuthenticated } = useAuth()
    const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const data = await loginUser(formData)
      login(data.access_token)
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      const message =
        requestError.response?.data?.detail ??
        'Unable to log in. Please try again.'

      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <main>
      <section>
        <h1>Welcome back</h1>
        <p>Log in to your ShopLens dashboard.</p>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p role="alert">{error}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default LoginPage