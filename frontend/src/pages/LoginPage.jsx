import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { loginUser } from '../api/auth'
import { useAuth } from '../context/useAuth'

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

            navigate('/overview', {
                replace: true,
            })
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
        return (
            <Navigate
                to="/overview"
                replace
            />
        )
    }

    return (
        <main className="login-page">
            <section className="login-brand-panel">
                <div className="login-brand-content">
                    <div className="login-brand">
                        <span className="login-brand-mark">
                            S
                        </span>

                        <div>
                            <h1>ShopLens</h1>
                            <p>Market Intelligence</p>
                        </div>
                    </div>

                    <div className="login-hero-copy">
                        <p className="login-eyebrow">
                            TikTok Shop Research
                        </p>

                        <h2>
                            Turn product data into clearer market decisions.
                        </h2>

                        <p>
                            Research products, analyze shops,
                            compare market snapshots, and surface
                            opportunities from one workspace.
                        </p>
                    </div>

                    <div className="login-feature-list">
                        <div className="login-feature-item">
                            <span>01</span>

                            <div>
                                <strong>
                                    Product Intelligence
                                </strong>

                                <p>
                                    Identify promising products
                                    using structured market signals.
                                </p>
                            </div>
                        </div>

                        <div className="login-feature-item">
                            <span>02</span>

                            <div>
                                <strong>
                                    Market Analytics
                                </strong>

                                <p>
                                    Understand category and shop
                                    concentration at a glance.
                                </p>
                            </div>
                        </div>

                        <div className="login-feature-item">
                            <span>03</span>

                            <div>
                                <strong>
                                    Historical Trends
                                </strong>

                                <p>
                                    Compare imports and see how the
                                    market changes over time.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="login-brand-footer">
                    Built for focused product research.
                </div>
            </section>

            <section className="login-form-panel">
                <div className="login-card">
                    <div className="login-card-header">
                        <p className="login-eyebrow">
                            Welcome back
                        </p>

                        <h2>Sign in to ShopLens</h2>

                        <p>
                            Access your market research workspace.
                        </p>
                    </div>

                    <form
                        className="login-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="login-field">
                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="login-field">
                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        {error && (
                            <div
                                className="login-error"
                                role="alert"
                            >
                                {error}
                            </div>
                        )}

                        <button
                            className="login-submit"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? 'Signing in...'
                                : 'Sign in'}
                        </button>
                    </form>

                    <p className="login-card-footer">
                        ShopLens market intelligence workspace
                    </p>
                </div>
            </section>
        </main>
    )
}

export default LoginPage
