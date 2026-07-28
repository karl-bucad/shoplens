import { useEffect, useState } from 'react'
import { getProducts } from '../api/products'

function formatDate(dateString) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(dateString))
}

function ProductsPage() {
    const [products, setProducts] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await getProducts()
                setProducts(data)
            } catch {
                setError('Unable to load products.')
            } finally {
                setIsLoading(false)
            }
        }

        loadProducts()
    }, [])

    const filteredProducts = products.filter((product) => {
        const search = searchTerm.trim().toLowerCase()

        return (
            product.name.toLowerCase().includes(search) ||
            product.shop_name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search)
        )
    })

    if (isLoading) {
        return <p>Loading products...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    return (
        <>
            <div className="page-header">
                <div>
                    <h1>Products</h1>
                    <p>Browse and manage your imported product data.</p>
                </div>
            </div>

            <div className="search-bar">
                <input
                    type="search"
                    placeholder="Search products, shops, or categories..."
                    aria-label="Search products"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
            </div>

            <div className="table-card">
                {products.length === 0 ? (
                    <p className="empty-state">No products available.</p>
                ) : filteredProducts.length === 0 ? (
                    <p className="empty-state">
                        No products match your search.
                    </p>
                ) : (
                    <div className="table-wrapper">
                        <table className="products-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Shop</th>
                                    <th>Category</th>
                                    <th>Created</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td className="product-name">
                                            {product.name}
                                        </td>

                                        <td>{product.shop_name}</td>

                                        <td>
                                            <span className="category-badge">
                                                {product.category}
                                            </span>
                                        </td>

                                        <td>{formatDate(product.created_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    )
}

export default ProductsPage