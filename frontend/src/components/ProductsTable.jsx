function ProductsTable({
    products,
    formatDate,
    onView,
    onEdit,
    onDelete,
}) {
    return (
        <div className="table-wrapper">
            <table className="products-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Shop</th>
                        <th>Category</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td className="product-name">
                                {product.name}
                            </td>

                            <td>{product.shop_name ?? '—'}</td>

                            <td>
                                <span className="category-badge">
                                    {product.category ?? 'Uncategorized'}
                                </span>
                            </td>

                            <td>{formatDate(product.created_at)}</td>

                            <td>
                                <div className="action-buttons">
                                    <button
                                        type="button"
                                        className="view-button"
                                        onClick={() => onView(product)}
                                    >
                                        View
                                    </button>

                                    <button
                                        type="button"
                                        className="edit-button"
                                        onClick={() => onEdit(product)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        className="delete-button"
                                        onClick={() => onDelete(product)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ProductsTable