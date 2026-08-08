import ShopLensScorePanel from './ShopLensScorePanel'

function formatDate(dateString) {
    if (!dateString) {
        return 'Unknown'
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(dateString))
}

function ProductDetailsModal({
    product,
    scoreData,
    onClose,
}) {
    if (!product || !scoreData) {
        return null
    }

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
        >
            <div
                className="modal-card product-intelligence-modal"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="product-intelligence-header">
                    <div>
                        <p className="page-eyebrow">
                            Product Intelligence
                        </p>

                        <h2>{product.name}</h2>

                        <p>
                            Research context from your current market snapshot.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="intelligence-close"
                        onClick={onClose}
                        aria-label="Close product intelligence"
                    >
                        ×
                    </button>
                </div>

                <div className="product-intelligence-meta">
                    <div>
                        <span>Shop</span>
                        <strong>
                            {product.shop_name ?? 'Unknown shop'}
                        </strong>
                    </div>

                    <div>
                        <span>Category</span>
                        <strong>
                            {product.category ?? 'Uncategorized'}
                        </strong>
                    </div>

                    <div>
                        <span>Imported</span>
                        <strong>
                            {formatDate(product.created_at)}
                        </strong>
                    </div>
                </div>

                <ShopLensScorePanel
                    score={scoreData.score}
                    factors={scoreData.factors}
                    recommendation={scoreData.recommendation}
                    confidence={scoreData.confidence}
                />

                <div className="product-intelligence-note">
                    <p className="page-eyebrow">
                        Research Note
                    </p>

                    <p>
                        ShopLens highlights this product based on patterns in
                        your imported dataset. Use the score as a research
                        signal, then validate demand, competition, pricing,
                        creator activity, and sales performance separately.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailsModal