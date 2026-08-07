function TableSkeleton({ rows = 8 }) {
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
                    {Array.from({ length: rows }).map((_, index) => (
                        <tr key={index}>
                            <td>
                                <div className="skeleton skeleton-text skeleton-long" />
                            </td>

                            <td>
                                <div className="skeleton skeleton-text" />
                            </td>

                            <td>
                                <div className="skeleton skeleton-pill" />
                            </td>

                            <td>
                                <div className="skeleton skeleton-text" />
                            </td>

                            <td>
                                <div className="skeleton skeleton-button" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TableSkeleton