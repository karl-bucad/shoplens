import { useEffect, useState } from 'react'
import { getAnalyticsOverview } from '../api/analytics'

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
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadOverview() {
      try {
        const data = await getAnalyticsOverview()
        setOverview(data)
      } catch {
        setError('Unable to load dashboard analytics.')
      } finally {
        setIsLoading(false)
      }
    }

    loadOverview()
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
    </>
  )
}

export default DashboardPage