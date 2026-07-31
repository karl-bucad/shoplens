function ProductDetailsModal({ product, onClose }) {
    if (!product) {
        return null
    }

    function formatDate(dateString) {
        return new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        }).format(new Date(dateString))
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-card"
                onClick={(event) => event.stopPropagation()}
            >
                <h2>Product Details</h2>

                <div className="modal-content">
                    <div>
                        <strong>Name</strong>
                        <p>{product.name}</p>
                    </div>

                    <div>
                        <strong>Shop</strong>
                        <p>{product.shop_name}</p>
                    </div>

                    <div>
                        <strong>Category</strong>
                        <p>{product.category}</p>
                    </div>

                    <div>
                        <strong>Created</strong>
                        <p>{formatDate(product.created_at)}</p>
                    </div>
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="close-button"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailsModal