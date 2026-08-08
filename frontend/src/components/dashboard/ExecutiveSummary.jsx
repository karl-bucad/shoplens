function ExecutiveSummary({
    overview,
    rankedCategories,
}) {
    const topCategory = rankedCategories[0]

    const topThreeProducts = rankedCategories
        .slice(0, 3)
        .reduce(
            (sum, category) => sum + category.product_count,
            0,
        )

    const concentration =
        overview.total_products > 0
            ? Math.round(
                (topThreeProducts / overview.total_products) * 100,
            )
            : 0

    const averageShopSize =
        overview.total_shops > 0
            ? (
                overview.total_products / overview.total_shops
            ).toFixed(1)
            : '0.0'

    const topCategoryShare =
        topCategory && overview.total_products > 0
            ? Math.round(
                (topCategory.product_count /
                    overview.total_products) *
                100,
            )
            : 0

    let competition = 'Low'

    if (overview.total_shops >= 15) {
        competition = 'High'
    } else if (overview.total_shops >= 8) {
        competition = 'Medium'
    }

    const cards = [
        {
            label: 'Leading Category',
            value: topCategory?.category ?? '—',
            detail: topCategory
                ? `${topCategoryShare}% of tracked products`
                : 'No category data',
        },
        {
            label: 'Market Concentration',
            value: `${concentration}%`,
            detail: 'Share held by the top 3 categories',
        },
        {
            label: 'Average Shop Size',
            value: averageShopSize,
            detail: 'Tracked products per shop',
        },
        {
            label: 'Competition',
            value: competition,
            detail: `${overview.total_shops} active shops`,
        },
    ]

    return (
        <section className="market-section">
            <div className="section-header">
                <p className="page-eyebrow">Executive</p>

                <h2>Executive Summary</h2>

                <p>
                    High-level insights generated from your latest market
                    snapshot.
                </p>
            </div>

            <div className="market-snapshot-grid">
                {cards.map((card) => (
                    <div
                        className="market-metric"
                        key={card.label}
                    >
                        <span>{card.label}</span>

                        <strong>{card.value}</strong>

                        <small>{card.detail}</small>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default ExecutiveSummary