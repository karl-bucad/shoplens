function DeleteProductModal({
    product,
    isOpen,
    isDeleting,
    error,
    onClose,
    onConfirm,
}) {
    if (!isOpen || !product) {
        return null
    }

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
        >
            <div
                className="modal-card"
                onClick={(event) => event.stopPropagation()}
            >
                <h2>Delete Product</h2>

                <p>
                    Are you sure you want to permanently delete
                    <strong> {product.name}</strong>?
                </p>

                {error && (
                    <p role="alert">
                        {error}
                    </p>
                )}

                <div className="modal-actions">
                    <button
                        type="button"
                        className="close-button"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="delete-button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting
                            ? 'Deleting...'
                            : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteProductModal