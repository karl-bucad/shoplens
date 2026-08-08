function FeaturedOpportunity({
    opportunity,
    onAnalyze,
}) {
    if (!opportunity) {
        return null
    }

    const {
        product,
        scoreData,
    } = opportunity

    return (
        <section className="featured-opportunity">
            <div className="featured-opportunity-accent" />

            <div className="featured-opportunity-content">
                <div>
                    <p className="page-eyebrow">
                        Featured Opportunity
                    </p>

                    <h2>{product.name}</h2>

                    <p className="featured-opportunity-meta">
                        {product.shop_name ?? 'Unknown shop'}
                        <span>•</span>
                        {product.category ?? 'Uncategorized'}
                    </p>
                </div>

                <div className="featured-opportunity-score">
                    <span>ShopLens Score</span>
                    <strong>{scoreData.score}</strong>
                    <small>{scoreData.recommendation}</small>
                </div>
            </div>

            <div className="featured-opportunity-footer">
                <div>
                    <span className="featured-opportunity-label">
                        Why it stands out
                    </span>

                    <p>
                        {scoreData.factors
                            .slice(0, 2)
                            .map((factor) => factor.title)
                            .join(' • ')}
                    </p>
                </div>

                <button
                    type="button"
                    className="analyze-button"
                    onClick={() => onAnalyze(product)}
                >
                    View Intelligence
                </button>
            </div>
        </section>
    )
}

export default FeaturedOpportunity