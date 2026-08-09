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
        </section>
    )
}

export default HistoricalTrends