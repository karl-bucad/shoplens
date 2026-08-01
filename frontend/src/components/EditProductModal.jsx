import { useState } from 'react'

function EditProductModal({
    product,
    isOpen,
    isSaving,
    error,
    onClose,
    onSave,
}) {
    const [formData, setFormData] = useState(() => ({
        id: product?.id ?? null,
        name: product?.name ?? '',
        shop_name: product?.shop_name ?? '',
        category: product?.category ?? '',
    }))

    if (!isOpen || !product) {
        return null
    }

    function handleChange(event) {
        const { name, value } = event.target

        setFormData((currentFormData) => ({
            ...currentFormData,
            [name]: value,
        }))
    }

    function handleSubmit(event) {
        event.preventDefault()

        onSave({
            id: product.id,
            name: formData.name.trim(),
            shop_name: formData.shop_name.trim(),
            category: formData.category.trim(),
        })
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-card"
                onClick={(event) => event.stopPropagation()}
            >
                <h2>Edit Product</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="edit-product-name">Name</label>
                        <input
                            id="edit-product-name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            maxLength={255}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="edit-product-shop">Shop</label>
                        <input
                            id="edit-product-shop"
                            name="shop_name"
                            value={formData.shop_name}
                            onChange={handleChange}
                            maxLength={255}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="edit-product-category">Category</label>
                        <input
                            id="edit-product-category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            maxLength={255}
                        />
                    </div>

                    {error && <p role="alert">{error}</p>}

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="close-button"
                            onClick={onClose}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="edit-button"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditProductModal