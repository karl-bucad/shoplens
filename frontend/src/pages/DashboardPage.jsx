import { useEffect, useState } from 'react'
import {
    getAnalyticsOverview,
    getCategoryAnalytics,
    getShopAnalytics,
} from '../api/analytics'

function formatDate(dateString) {
    if (!dateString) {
        return 'No imports yet'
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(dateString))
}

function DashboardPage() {
    const [overview, setOverview] = useState(null)
    const [categories, setCategories] = useState([])
    const [shops, setShops] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadDashboard() {
            try {
                const [overviewData, categoryData, shopData] = await Promise.all([
                    getAnalyticsOverview(),
                    getCategoryAnalytics(),
                    getShopAnalytics(),
                ])

                setOverview(overviewData)
                setCategories(categoryData)
                setShops(shopData)
            } catch {
                setError('Unable to load dashboard analytics.')
            } finally {
                setIsLoading(false)
            }
        }

        loadDashboard()
    }, [])

    if (isLoading) {
        return <p>Loading dashboard...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    return (
        <>
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Monitor your ShopLens product data.</p>
                </div>
            </div>

            <section className="overview-grid">
                <article className="overview-card">
                    <p>Total Products</p>
                    <h2>{overview.total_products}</h2>
                </article>

                <article className="overview-card">
                    <p>Total Shops</p>
                    <h2>{overview.total_shops}</h2>
                </article>

                <article className="overview-card">
                    <p>Total Categories</p>
                    <h2>{overview.total_categories}</h2>
                </article>

                <article className="overview-card">
                    <p>Latest Import</p>
                    <h2 className="overview-date">
                        {formatDate(overview.latest_import)}
                    </h2>
                </article>
            </section>

            <section className="analytics-section">
                <div className="section-header">
                    <h2>Products by Category</h2>
                    <p>See how your products are distributed across categories.</p>
                </div>

                <div className="category-card">
                    {categories.length === 0 ? (
                        <p className="empty-state">No category data available.</p>
                    ) : (
                        <div className="category-list">
                            {categories.map((item) => {
                                const percentage =
                                    overview.total_products > 0
                                        ? (item.product_count / overview.total_products) * 100
                                        : 0

                                return (
                                    <div className="category-row" key={item.category}>
                                        <div className="category-row-header">
                                            <span>{item.category}</span>
                                            <span>{item.product_count} products</span>
                                        </div>

                                        <div className="category-track">
                                            <div
                                                className="category-bar"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>

            <section className="analytics-section">
                <div className="section-header">
                    <h2>Products by Shop</h2>
                    <p>Compare how many products belong to each shop.</p>
                </div>

                <div className="category-card">
                    {shops.length === 0 ? (
                        <p className="empty-state">No shop data available.</p>
                    ) : (
                        <div className="category-list">
                            {shops.map((shop) => {
                                const percentage =
                                    overview.total_products > 0
                                        ? (shop.product_count / overview.total_products) * 100
                                        : 0

                                return (
                                    <div className="category-row" key={shop.shop_name}>
                                        <div className="category-row-header">
                                            <span>{shop.shop_name}</span>
                                            <span>{shop.product_count} products</span>
                                        </div>

                                        <div className="category-track">
                                            <div
                                                className="category-bar"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}

export default DashboardPage