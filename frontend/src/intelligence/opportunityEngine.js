import CategoryDistributionChart from '../components/charts/CategoryDistributionChart'
import ShopDistributionChart from '../components/charts/ShopDistributionChart'
import ExecutiveSummary from '../components/dashboard/ExecutiveSummary'
import KpiCard from '../components/dashboard/KpiCard'
import InsightCard from '../components/InsightCard'

import useMarketAnalytics from '../hooks/useMarketAnalytics'
import { generateOpportunityInsights } from '../intelligence/opportunityEngine'

function formatDate(dateString) {
    if (!dateString) {
        return 'No snapshots yet'
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(dateString))
}

function DashboardPage() {
    const {
        overview,
        rankedCategories,
        rankedShops,
        loading,
        error,
    } = useMarketAnalytics()

    const opportunityInsights = generateOpportunityInsights(
        overview,
        rankedCategories,
    )

    if (loading) {
        return <p>Loading market overview...</p>
    }

    if (error || !overview) {
        return (
            <div className="error-state">
                <h2>Unable to load market overview</h2>
                <p>{error || 'No overview data available.'}</p>
            </div>
        )
    }

    return (
        <>
            <div className="page-header market-page-header">
                <div>
                    <p className="page-eyebrow">
                        Market Intelligence
                    </p>

                    <h1>Market Overview</h1>

                    <p>
                        See where products, shops, and categories are
                        concentrated across your latest TikTok Shop snapshot.
                    </p>
                </div>

                <div className="snapshot-date">
                    <span>Latest snapshot</span>

                    <strong>
                        {formatDate(overview.latest_import)}
                    </strong>
                </div>
            </div>

            <section className="market-section">
                <div className="section-header">
                    <p className="page-eyebrow">Snapshot</p>

                    <h2>Current Market</h2>

                    <p>
                        The latest composition of your tracked product dataset.
                    </p>
                </div>

                <div className="kpi-grid">
                    <KpiCard
                        label="Tracked Products"
                        value={overview.total_products}
                        subtitle="Products in the latest snapshot"
                        icon="◎"
                    />

                    <KpiCard
                        label="Active Shops"
                        value={overview.total_shops}
                        subtitle="Shops represented in the market"
                        icon="◫"
                    />

                    <KpiCard
                        label="Categories"
                        value={overview.total_categories}
                        subtitle="Unique tracked categories"
                        icon="◈"
                    />

                    <KpiCard
                        label="Largest Shop"
                        value={rankedShops[0]?.shop_name ?? '—'}
                        subtitle={
                            rankedShops[0]
                                ? `${rankedShops[0].product_count} tracked products`
                                : 'No shop data available'
                        }
                        icon="◇"
                    />
                </div>
            </section>

            <ExecutiveSummary
                overview={overview}
                rankedCategories={rankedCategories}
            />

            <section className="market-section">
                <div className="section-header">
                    <p className="page-eyebrow">Signals</p>

                    <h2>Opportunity Feed</h2>

                    <p>
                        Quick signals derived from your current market snapshot.
                    </p>
                </div>

                {opportunityInsights.length === 0 ? (
                    <div className="empty-research-state">
                        <h2>No market signals yet</h2>

                        <p>
                            Import more product data to generate category
                            opportunities.
                        </p>
                    </div>
                ) : (
                    <div className="insight-grid">
                        {opportunityInsights.map((insight) => (
                            <InsightCard
                                key={insight.title}
                                title={insight.title}
                                description={insight.description}
                                status={insight.status}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section className="market-section">
                <div className="section-header">
                    <p className="page-eyebrow">
                        Visual Analytics
                    </p>

                    <h2>Market Distribution</h2>

                    <p>
                        Compare category concentration and shop presence across
                        your latest snapshot.
                    </p>
                </div>

                <div className="market-charts-grid">
                    <CategoryDistributionChart
                        categories={rankedCategories}
                    />

                    <ShopDistributionChart
                        shops={rankedShops}
                    />
                </div>
            </section>

            <section className="market-section market-two-column">
                <div>
                    <div className="section-header">
                        <p className="page-eyebrow">
                            Distribution
                        </p>

                        <h2>Category Concentration</h2>

                        <p>
                            Understand which categories dominate the tracked
                            market.
                        </p>
                    </div>

                    <div className="research-panel">
                        {rankedCategories.length === 0 ? (
                            <p className="empty-state">
                                No category data available.
                            </p>
                        ) : (
                            rankedCategories.map((category, index) => {
                                const percentage =
                                    overview.total_products > 0
                                        ? (
                                            category.product_count /
                                            overview.total_products
                                        ) * 100
                                        : 0

                                return (
                                    <div
                                        className="ranking-row"
                                        key={category.category}
                                    >
                                        <div className="ranking-position">
                                            #{index + 1}
                                        </div>

                                        <div className="ranking-content">
                                            <div className="ranking-label">
                                                <strong>
                                                    {category.category}
                                                </strong>

                                                <span>
                                                    {category.product_count}{' '}
                                                    {category.product_count === 1
                                                        ? 'product'
                                                        : 'products'}
                                                </span>
                                            </div>

                                            <div className="research-track">
                                                <div
                                                    className="research-bar"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                <div>
                    <div className="section-header">
                        <p className="page-eyebrow">
                            Competition
                        </p>

                        <h2>Top Shops</h2>

                        <p>
                            Shops with the largest presence in your current
                            dataset.
                        </p>
                    </div>

                    <div className="research-panel">
                        {rankedShops.length === 0 ? (
                            <p className="empty-state">
                                No shop data available.
                            </p>
                        ) : (
                            rankedShops.slice(0, 5).map((shop, index) => (
                                <div
                                    className="shop-ranking-row"
                                    key={shop.shop_name}
                                >
                                    <span className="shop-rank">
                                        {index + 1}
                                    </span>

                                    <div>
                                        <strong>{shop.shop_name}</strong>

                                        <p>
                                            {shop.product_count}{' '}
                                            {shop.product_count === 1
                                                ? 'product'
                                                : 'products'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}

export default DashboardPage