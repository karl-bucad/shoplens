import { useEffect, useState } from 'react'

import EditProductModal from '../components/EditProductModal'
import ProductDetailsModal from '../components/ProductDetailsModal'
import { getProducts } from '../api/products'
import { updateProduct } from '../api/updateProduct'

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
    const [currentPage, setCurrentPage] = useState(1)

    const [selectedProduct, setSelectedProduct] = useState(null)
    const [editingProduct, setEditingProduct] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState('')

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    const itemsPerPage = 10

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
        ...new Set(
            products
                .map((product) => product.category)
                .filter(Boolean),
        ),
    ]

    const shops = [
        'All',
        ...new Set(
            products
                .map((product) => product.shop_name)
                .filter(Boolean),
        ),
    ]

    const filteredProducts = products.filter((product) => {
        const search = searchTerm.trim().toLowerCase()
        const productName = product.name.toLowerCase()
        const shopName = (product.shop_name ?? '').toLowerCase()
        const category = (product.category ?? '').toLowerCase()

        const matchesSearch =
            productName.includes(search) ||
            shopName.includes(search) ||
            category.includes(search)

        const matchesCategory =
            selectedCategory === 'All' ||
            product.category === selectedCategory

        const matchesShop =
            selectedShop === 'All' ||
            product.shop_name === selectedShop

        return matchesSearch && matchesCategory && matchesShop
    })

    const sortedProducts = [...filteredProducts].sort(
        (productA, productB) => {
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
        },
    )

    const totalPages = Math.max(
        1,
        Math.ceil(sortedProducts.length / itemsPerPage),
    )

    const startIndex = (currentPage - 1) * itemsPerPage

    const currentProducts = sortedProducts.slice(
        startIndex,
        startIndex + itemsPerPage,
    )

    const startItem =
        sortedProducts.length === 0 ? 0 : startIndex + 1

    const endItem = Math.min(
        startIndex + itemsPerPage,
        sortedProducts.length,
    )

    function handleSearchChange(event) {
        setSearchTerm(event.target.value)
        setCurrentPage(1)
    }

    function handleCategoryChange(event) {
        setSelectedCategory(event.target.value)
        setCurrentPage(1)
    }

    function handleShopChange(event) {
        setSelectedShop(event.target.value)
        setCurrentPage(1)
    }

    function handleSortChange(event) {
        setSortOption(event.target.value)
        setCurrentPage(1)
    }

    function goToPreviousPage() {
        setCurrentPage((page) => Math.max(page - 1, 1))
    }

    function goToNextPage() {
        setCurrentPage((page) => Math.min(page + 1, totalPages))
    }

    function openEditModal(product) {
        setSaveError('')
        setEditingProduct(product)
    }

    function closeEditModal() {
        if (isSaving) {
            return
        }

        setEditingProduct(null)
        setSaveError('')
    }

    async function handleSaveProduct(updatedProduct) {
        setIsSaving(true)
        setSaveError('')

        try {
            const savedProduct = await updateProduct(updatedProduct)

            setProducts((currentProductsList) =>
                currentProductsList.map((product) =>
                    product.id === savedProduct.id
                        ? savedProduct
                        : product,
                ),
            )

            setSelectedProduct((currentSelectedProduct) =>
                currentSelectedProduct?.id === savedProduct.id
                    ? savedProduct
                    : currentSelectedProduct,
            )

            setEditingProduct(null)
        } catch (requestError) {
            const message =
                requestError.response?.data?.detail ??
                'Unable to update product.'

            setSaveError(message)
        } finally {
            setIsSaving(false)
        }
    }

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
                        onChange={handleSearchChange}
                    />
                </div>

                <div className="filter-group">
                    <select
                        aria-label="Filter by category"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category === 'All'
                                    ? 'All categories'
                                    : category}
                            </option>
                        ))}
                    </select>

                    <select
                        aria-label="Filter by shop"
                        value={selectedShop}
                        onChange={handleShopChange}
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
                        onChange={handleSortChange}
                    >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="name-ascending">Product A–Z</option>
                        <option value="name-descending">Product Z–A</option>
                    </select>
                </div>
            </div>

            <p className="pagination-info">
                Showing {startItem}–{endItem} of {sortedProducts.length}{' '}
                products
            </p>

            <div className="table-card">
                {products.length === 0 ? (
                    <p className="empty-state">No products available.</p>
                ) : sortedProducts.length === 0 ? (
                    <p className="empty-state">
                        No products match your filters.
                    </p>
                ) : (
                    <>
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
                                    {currentProducts.map((product) => (
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
                                                        onClick={() =>
                                                            setSelectedProduct(product)
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="edit-button"
                                                        onClick={() => openEditModal(product)}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="delete-button"
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

                        <div className="pagination">
                            <button
                                type="button"
                                disabled={currentPage === 1}
                                onClick={goToPreviousPage}
                            >
                                Previous
                            </button>

                            <span>
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                type="button"
                                disabled={currentPage === totalPages}
                                onClick={goToNextPage}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>

            <ProductDetailsModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />

            <EditProductModal
                key={editingProduct?.id ?? 'closed-edit-modal'}
                product={editingProduct}
                isOpen={editingProduct !== null}
                isSaving={isSaving}
                error={saveError}
                onClose={closeEditModal}
                onSave={handleSaveProduct}
            />
        </>
    )
}

export default ProductsPage