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
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [selectedShop, setSelectedShop] = useState('All')
    const [sortOption, setSortOption] = useState('newest')
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

    const categories = [
        'All',
        ...new Set(products.map((product) => product.category)),
    ]

    const shops = [
        'All',
        ...new Set(products.map((product) => product.shop_name)),
    ]

    const filteredProducts = products.filter((product) => {
        const search = searchTerm.trim().toLowerCase()

        const matchesSearch =
            product.name.toLowerCase().includes(search) ||
            product.shop_name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search)

        const matchesCategory =
            selectedCategory === 'All' ||
            product.category === selectedCategory

        const matchesShop =
            selectedShop === 'All' ||
            product.shop_name === selectedShop

        return matchesSearch && matchesCategory && matchesShop
    })

    const sortedProducts = [...filteredProducts].sort((productA, productB) => {
        if (sortOption === 'oldest') {
            return (
                new Date(productA.created_at).getTime() -
                new Date(productB.created_at).getTime()
            )
        }

        if (sortOption === 'name-ascending') {
            return productA.name.localeCompare(productB.name)
        }

        if (sortOption === 'name-descending') {
            return productB.name.localeCompare(productA.name)
        }

        return (
            new Date(productB.created_at).getTime() -
            new Date(productA.created_at).getTime()
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

            <div className="table-controls">
                <div className="search-bar">
                    <input
                        type="search"
                        placeholder="Search products, shops, or categories..."
                        aria-label="Search products"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <select
                        aria-label="Filter by category"
                        value={selectedCategory}
                        onChange={(event) => setSelectedCategory(event.target.value)}
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category === 'All' ? 'All categories' : category}
                            </option>
                        ))}
                    </select>

                    <select
                        aria-label="Filter by shop"
                        value={selectedShop}
                        onChange={(event) => setSelectedShop(event.target.value)}
                    >
                        {shops.map((shop) => (
                            <option key={shop} value={shop}>
                                {shop === 'All' ? 'All shops' : shop}
                            </option>
                        ))}
                    </select>

                    <select
                        aria-label="Sort products"
                        value={sortOption}
                        onChange={(event) => setSortOption(event.target.value)}
                    >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="name-ascending">Product A–Z</option>
                        <option value="name-descending">Product Z–A</option>
                    </select>
                </div>
            </div>

            <div className="table-card">
                {products.length === 0 ? (
                    <p className="empty-state">No products available.</p>
                ) : sortedProducts.length === 0 ? (
                    <p className="empty-state">
                        No products match your filters.
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
                                {sortedProducts.map((product) => (
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