import KpiCard from '../components/dashboard/KpiCard'

import useMarketAnalytics from '../hooks/useMarketAnalytics'

function ShopResearchPage() {
    const {
        overview,
        rankedShops,
        loading,
        error,
    } = useMarketAnalytics()

    if (loading) {
        return <p>Loading shop research...</p>
    }

    if (error || !overview) {
        return (
            <div className="error-state">
                <h2>Unable to load shop research</h2>
                <p>{error || 'No market data available.'}</p>
            </div>
        )
    }

    const topShop = rankedShops[0] ?? null

    const averageShopSize =
        overview.total_shops > 0
            ? (
                overview.total_products /
                overview.total_shops
            ).toFixed(1)
            : '0.0'

    const topThreeProducts = rankedShops
        .slice(0, 3)
        .reduce(
            (total, shop) =>
                total + shop.product_count,
            0,
        )

    const topThreeShare =
        overview.total_products > 0
            ? Math.round(
                (
                    topThreeProducts /
                    overview.total_products
                ) * 100,
            )
            : 0

    const largestShopCount =
        topShop?.product_count ?? 0

    return (
        <>
            <div className="page-header market-page-header">
                <div>
                    <p className="page-eyebrow">
                        Competition Research
                    </p>

                    <h1>Shop Research</h1>

                    <p>
                        Compare shops in your latest market
                        snapshot and understand where product
                        concentration is strongest.
                    </p>
                </div>
            </div>

            <section className="market-section">
                <div className="section-header">
                    <p className="page-eyebrow">
                        Snapshot
                    </p>

                    <h2>Shop Landscape</h2>

                    <p>
                        A high-level view of competition across
                        the latest imported market snapshot.
                    </p>
                </div>

                <div className="kpi-grid">
                    <KpiCard
                        label="Active Shops"
                        value={overview.total_shops}
                        subtitle="Shops represented in the latest snapshot"
                        icon="◫"
                    />

                    <KpiCard
                        label="Largest Shop"
                        value={topShop?.shop_name ?? '—'}
                        subtitle={
                            topShop
                                ? `${topShop.product_count} tracked products`
                                : 'No shop data available'
                        }
                        icon="◇"
                    />

                    <KpiCard
                        label="Top 3 Share"
                        value={`${topThreeShare}%`}
                        subtitle="Market share held by the three largest shops"
                        icon="◎"
                    />

                    <KpiCard
                        label="Avg. Shop Size"
                        value={averageShopSize}
                        subtitle="Tracked products per active shop"
                        icon="◈"
                    />
                </div>
            </section>

            <section className="market-section">
                <div className="section-header">
                    <p className="page-eyebrow">
                        Competition
                    </p>

                    <h2>Shop Rankings</h2>

                    <p>
                        Rank shops by their product presence in
                        the current market snapshot.
                    </p>
                </div>

                <div className="research-panel">
                    {rankedShops.length === 0 ? (
                        <div className="empty-research-state">
                            <h2>No shop data available</h2>

                            <p>
                                Import a market snapshot containing
                                shop data to begin comparing
                                competitors.
                            </p>
                        </div>
                    ) : (
                        rankedShops.map((shop, index) => {
                            const relativePresence =
                                largestShopCount > 0
                                    ? (
                                        shop.product_count /
                                        largestShopCount
                                    ) * 100
                                    : 0

                            const marketShare =
                                overview.total_products > 0
                                    ? Math.round(
                                        (
                                            shop.product_count /
                                            overview.total_products
                                        ) * 100,
                                    )
                                    : 0

                            return (
                                <div
                                    className="ranking-row"
                                    key={shop.shop_name}
                                >
                                    <div className="ranking-position">
                                        #{index + 1}
                                    </div>

                                    <div className="ranking-content">
                                        <div className="ranking-label">
                                            <strong>
                                                {shop.shop_name}
                                            </strong>

                                            <span>
                                                {shop.product_count}{' '}
                                                {shop.product_count === 1
                                                    ? 'product'
                                                    : 'products'}
                                                {' • '}
                                                {marketShare}% of market
                                            </span>
                                        </div>

                                        <div className="research-track">
                                            <div
                                                className="research-bar"
                                                style={{
                                                    width: `${relativePresence}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </section>
        </>
    )
}

export default ShopResearchPage