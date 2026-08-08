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
                        <h3>{product.name}</h3>

                        <p>
                            {product.shop_name ?? 'Unknown shop'}
                            <span>•</span>
                            {product.category ?? 'Uncategorized'}
                        </p>
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
                                Analyze
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

                <div className="discovery-card-footer">
                    <div className="discovery-score">
                        <div className="discovery-score-label">
                            <span>ShopLens Score</span>
                            <strong>{score}</strong>
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