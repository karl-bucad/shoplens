import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { registerUser } from '../api/auth'
import { useAuth } from '../context/useAuth'

function RegisterPage() {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
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

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters.')
            return
        }

        setIsSubmitting(true)

        try {
            await registerUser({
                email: formData.email,
                password: formData.password,
            })

            navigate('/login', {
                replace: true,
                state: {
                    registered: true,
                },
            })
        } catch (requestError) {
            const message =
                requestError.response?.data?.detail ??
                'Unable to create account. Please try again.'

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
                            Start Researching
                        </p>

                        <h2>
                            Build a clearer view of your market.
                        </h2>

                        <p>
                            Create an account, import a market
                            snapshot, and turn product data into
                            structured research and competitive
                            insights.
                        </p>
                    </div>

                    <div className="login-feature-list">
                        <div className="login-feature-item">
                            <span>01</span>

                            <div>
                                <strong>
                                    Import Market Data
                                </strong>

                                <p>
                                    Upload structured product data
                                    and create reusable snapshots.
                                </p>
                            </div>
                        </div>

                        <div className="login-feature-item">
                            <span>02</span>

                            <div>
                                <strong>
                                    Discover Opportunities
                                </strong>

                                <p>
                                    Compare products, categories,
                                    and shops from one workspace.
                                </p>
                            </div>
                        </div>

                        <div className="login-feature-item">
                            <span>03</span>

                            <div>
                                <strong>
                                    Track Market Changes
                                </strong>

                                <p>
                                    Compare snapshots and identify
                                    changes over time.
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
                            Get Started
                        </p>

                        <h2>Create your account</h2>

                        <p>
                            Start exploring ShopLens market intelligence.
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
                                placeholder="At least 8 characters"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <div className="login-field">
                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>

                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Re-enter your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
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
                                ? 'Creating account...'
                                : 'Create account'}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Already have an account?{' '}
                        <Link to="/login">
                            Sign in
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    )
}

export default RegisterPage