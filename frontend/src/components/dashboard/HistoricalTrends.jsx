function formatChange(change) {
    if (change > 0) {
        return `+${change}`
    }

    return `${change}`
}

function formatPercent(percent) {
    if (percent === null || percent === undefined) {
        return 'New'
    }

    if (percent > 0) {
        return `+${percent}%`
    }

    return `${percent}%`
}

function getTrendClass(change) {
    if (change > 0) {
        return 'trend-positive'
    }

    if (change < 0) {
        return 'trend-negative'
    }

    return 'trend-neutral'
}

function HistoricalTrends({ comparison }) {
    if (
        !comparison ||
        comparison.current_import_id === 0 ||
        comparison.previous_import_id === 0
    ) {
        return null
    }

    const metrics = [
        {
            label: 'Products',
            data: comparison.products,
        },
        {
            label: 'Shops',
            data: comparison.shops,
        },
        {
            label: 'Categories',
            data: comparison.categories,
        },
    ]

    const categoryTrends = comparison.category_trends ?? []
    const newShops = comparison.new_shops ?? []
    const removedShops = comparison.removed_shops ?? []

    return (
        <section className="market-section">
            <div className="section-header">
                <p className="page-eyebrow">
                    Historical Analytics
                </p>

                <h2>Market Changes</h2>

                <p>
                    Compare the latest market snapshot with the previous import.
                </p>
            </div>

            <div className="trend-grid">
                {metrics.map((metric) => (
                    <article
                        className="trend-card"
                        key={metric.label}
                    >
                        <span className="trend-label">
                            {metric.label}
                        </span>

                        <strong className="trend-value">
                            {metric.data.current}
                        </strong>

                        <div
                            className={`trend-change ${getTrendClass(
                                metric.data.change,
                            )}`}
                        >
                            <span>
                                {formatChange(metric.data.change)}
                            </span>

                            <span>
                                {formatPercent(
                                    metric.data.percent_change,
                                )}
                            </span>
                        </div>

                        <p>
                            Previous snapshot: {metric.data.previous}
                        </p>
                    </article>
                ))}
            </div>

            <div className="historical-detail-grid">
                <div className="historical-panel">
                    <div className="historical-panel-header">
                        <div>
                            <span className="trend-label">
                                Category Movement
                            </span>

                            <h3>Category Trends</h3>
                        </div>

                        <span className="historical-count">
                            {categoryTrends.length}
                        </span>
                    </div>

                    {categoryTrends.length === 0 ? (
                        <p className="historical-empty">
                            No category trend data is available yet.
                        </p>
                    ) : (
                        <div className="category-trend-list">
                            {categoryTrends.map((category) => (
                                <div
                                    className="category-trend-row"
                                    key={category.category}
                                >
                                    <div className="category-trend-info">
                                        <strong>
                                            {category.category}
                                        </strong>

                                        <span>
                                            {category.previous_count}
                                            {' → '}
                                            {category.current_count}
                                        </span>
                                    </div>

                                    <div
                                        className={`category-trend-change ${getTrendClass(
                                            category.change,
                                        )}`}
                                    >
                                        <span>
                                            {formatChange(
                                                category.change,
                                            )}
                                        </span>

                                        <span>
                                            {formatPercent(
                                                category.percent_change,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="historical-shop-grid">
                    <div className="historical-panel">
                        <div className="historical-panel-header">
                            <div>
                                <span className="trend-label">
                                    Market Entries
                                </span>

                                <h3>New Shops</h3>
                            </div>

                            <span className="historical-count">
                                {newShops.length}
                            </span>
                        </div>

                        {newShops.length === 0 ? (
                            <p className="historical-empty">
                                No new shops entered the latest snapshot.
                            </p>
                        ) : (
                            <div className="historical-shop-list">
                                {newShops.map((shop) => (
                                    <div
                                        className="historical-shop-row"
                                        key={shop}
                                    >
                                        <span className="shop-change-icon trend-positive">
                                            +
                                        </span>

                                        <strong>{shop}</strong>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="historical-panel">
                        <div className="historical-panel-header">
                            <div>
                                <span className="trend-label">
                                    Market Exits
                                </span>

                                <h3>Removed Shops</h3>
                            </div>

                            <span className="historical-count">
                                {removedShops.length}
                            </span>
                        </div>

                        {removedShops.length === 0 ? (
                            <p className="historical-empty">
                                No shops disappeared from the latest snapshot.
                            </p>
                        ) : (
                            <div className="historical-shop-list">
                                {removedShops.map((shop) => (
                                    <div
                                        className="historical-shop-row"
                                        key={shop}
                                    >
                                        <span className="shop-change-icon trend-negative">
                                            −
                                        </span>

                                        <strong>{shop}</strong>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HistoricalTrends