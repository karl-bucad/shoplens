import OpportunityBadge from './OpportunityBadge'

function formatDate(dateString) {
    if (!dateString) {
        return 'Unknown'
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(dateString))
}

function ProductDiscoveryCard({
    product,
    rank,
    score,
    onAnalyze,
    onEdit,
    onDelete,
}) {
    return (
        <article className="discovery-card">
            <div className="discovery-card-rank">
                #{rank}
            </div>

            <div className="discovery-card-main">
                <div className="discovery-card-heading">
                    <div>
                        <div className="discovery-card-title-row">
                            <h3>{product.name}</h3>

                            <OpportunityBadge score={score} />
                        </div>

                        <div className="discovery-card-tags">
                            <span className="discovery-tag">
                                {product.shop_name ?? 'Unknown shop'}
                            </span>

                            <span className="discovery-tag">
                                {product.category ?? 'Uncategorized'}
                            </span>
                        </div>
                    </div>

                    <details className="discovery-actions">
                        <summary aria-label={`Actions for ${product.name}`}>
                            •••
                        </summary>

                        <div className="discovery-actions-menu">
                            <button
                                type="button"
                                onClick={() => onAnalyze(product)}
                            >
                                View Intelligence
                            </button>

                            <button
                                type="button"
                                onClick={() => onEdit(product)}
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                className="discovery-delete-action"
                                onClick={() => onDelete(product)}
                            >
                                Delete
                            </button>
                        </div>
                    </details>
                </div>

                <div className="discovery-card-details">
                    <div>
                        <span>Imported</span>
                        <strong>{formatDate(product.created_at)}</strong>
                    </div>

                    <div>
                        <span>ShopLens Score</span>
                        <strong>{score}/100</strong>
                    </div>
                </div>

                <div className="discovery-card-footer">
                    <div className="discovery-score">
                        <div className="discovery-score-label">
                            <span>Opportunity strength</span>
                            <strong>{score}%</strong>
                        </div>

                        <div className="discovery-score-track">
                            <div
                                className="discovery-score-bar"
                                style={{ width: `${score}%` }}
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        className="analyze-button"
                        onClick={() => onAnalyze(product)}
                    >
                        View Intelligence
                    </button>
                </div>
            </div>
        </article>
    )
}

export default ProductDiscoveryCard