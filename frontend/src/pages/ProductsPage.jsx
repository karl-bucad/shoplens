import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import DeleteProductModal from '../components/DeleteProductModal'
import EditProductModal from '../components/EditProductModal'
import ProductDetailsModal from '../components/ProductDetailsModal'
import ProductDiscoveryCard from '../components/ProductDiscoveryCard'
import ProductFilters from '../components/ProductFilters'
import ProductsPagination from '../components/ProductsPagination'

import { deleteProduct } from '../api/deleteProduct'
import { getProducts } from '../api/products'
import { updateProduct } from '../api/updateProduct'

function calculateShopLensScore(
    product,
    products,
    categories,
    shops,
) {
    if (products.length === 0) {
        return 50
    }

    const categoryCount = products.filter(
        (item) => item.category === product.category,
    ).length

    const shopCount = products.filter(
        (item) => item.shop_name === product.shop_name,
    ).length

    const categoryShare = categoryCount / products.length

    let score = 40

    // Strong category presence
    score += Math.min(categoryShare * 40, 25)

    // Focused shops receive a small discovery boost
    if (shopCount <= 2) {
        score += 20
    } else if (shopCount <= 5) {
        score += 12
    } else {
        score += 5
    }

    // Reward products in markets with multiple categories
    if (categories.length > 3) {
        score += 8
    }

    // Reward a diverse shop landscape
    if (shops.length > 3) {
        score += 7
    }

    return Math.min(100, Math.round(score))
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

    const [deletingProduct, setDeletingProduct] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    const itemsPerPage = 6

    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await getProducts()
                setProducts(data)
            } catch {
                setError('Unable to load product discovery data.')
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

        const matchesSearch =
            product.name.toLowerCase().includes(search) ||
            (product.shop_name ?? '').toLowerCase().includes(search) ||
            (product.category ?? '').toLowerCase().includes(search)

        const matchesCategory =
            selectedCategory === 'All' ||
            product.category === selectedCategory

        const matchesShop =
            selectedShop === 'All' ||
            product.shop_name === selectedShop

        return matchesSearch && matchesCategory && matchesShop
    })

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortOption === 'oldest') {
            return (
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            )
        }

        if (sortOption === 'name-ascending') {
            return a.name.localeCompare(b.name)
        }

        if (sortOption === 'name-descending') {
            return b.name.localeCompare(a.name)
        }

        return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        )
    })

    const totalPages = Math.max(
        1,
        Math.ceil(sortedProducts.length / itemsPerPage),
    )

    const safeCurrentPage = Math.min(currentPage, totalPages)

    const startIndex = (safeCurrentPage - 1) * itemsPerPage

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

    function resetToFirstPage() {
        setCurrentPage(1)
    }

    function handleSearchChange(event) {
        setSearchTerm(event.target.value)
        resetToFirstPage()
    }

    function handleCategoryChange(event) {
        setSelectedCategory(event.target.value)
        resetToFirstPage()
    }

    function handleShopChange(event) {
        setSelectedShop(event.target.value)
        resetToFirstPage()
    }

    function handleSortChange(event) {
        setSortOption(event.target.value)
        resetToFirstPage()
    }

    function openEditModal(product) {
        setEditingProduct(product)
    }

    function openDeleteModal(product) {
        setDeletingProduct(product)
    }

    async function handleSaveProduct(updatedProduct) {
        setIsSaving(true)

        try {
            const savedProduct = await updateProduct(updatedProduct)

            setProducts((current) =>
                current.map((product) =>
                    product.id === savedProduct.id
                        ? savedProduct
                        : product,
                ),
            )

            if (selectedProduct?.id === savedProduct.id) {
                setSelectedProduct(savedProduct)
            }

            setEditingProduct(null)

            toast.success('Product updated', {
                description: `${savedProduct.name} was updated successfully.`,
            })
        } catch (error) {
            toast.error('Update failed', {
                description:
                    error.response?.data?.detail ??
                    'Unable to update product.',
            })
        } finally {
            setIsSaving(false)
        }
    }

    async function handleDeleteProduct() {
        if (!deletingProduct) {
            return
        }

        setIsDeleting(true)

        try {
            await deleteProduct(deletingProduct.id)

            const deletedName = deletingProduct.name

            setProducts((current) =>
                current.filter(
                    (product) => product.id !== deletingProduct.id,
                ),
            )

            if (selectedProduct?.id === deletingProduct.id) {
                setSelectedProduct(null)
            }

            setDeletingProduct(null)

            toast.success('Product removed', {
                description: `${deletedName} was removed from this snapshot.`,
            })
        } catch (error) {
            toast.error('Delete failed', {
                description:
                    error.response?.data?.detail ??
                    'Unable to delete product.',
            })
        } finally {
            setIsDeleting(false)
        }
    }

    if (isLoading) {
        return (
            <>
                <div className="page-header">
                    <div>
                        <p className="page-eyebrow">Discovery</p>
                        <h1>Product Discovery</h1>
                        <p>Scanning your market snapshot for products...</p>
                    </div>
                </div>

                <div className="discovery-loading">
                    <div className="skeleton skeleton-discovery-card" />
                    <div className="skeleton skeleton-discovery-card" />
                    <div className="skeleton skeleton-discovery-card" />
                </div>
            </>
        )
    }

    if (error) {
        return (
            <div className="error-state">
                <h2>Unable to load Product Discovery</h2>
                <p>{error}</p>
            </div>
        )
    }

    return (
        <>
            <div className="page-header market-page-header">
                <div>
                    <p className="page-eyebrow">Discovery</p>

                    <h1>Product Discovery</h1>

                    <p>
                        Find products worth investigating across your latest
                        TikTok Shop market snapshot.
                    </p>
                </div>

                <div className="discovery-summary">
                    <span>Tracked opportunities</span>
                    <strong>{products.length}</strong>
                </div>
            </div>

            <section className="market-section">
                <ProductFilters
                    searchTerm={searchTerm}
                    selectedCategory={selectedCategory}
                    selectedShop={selectedShop}
                    sortOption={sortOption}
                    categories={categories}
                    shops={shops}
                    onSearchChange={handleSearchChange}
                    onCategoryChange={handleCategoryChange}
                    onShopChange={handleShopChange}
                    onSortChange={handleSortChange}
                />

                <div className="discovery-results-header">
                    <div>
                        <p className="page-eyebrow">Research Feed</p>
                        <h2>Tracked Products</h2>
                    </div>

                    <span>
                        Showing {startItem}–{endItem} of {sortedProducts.length}
                    </span>
                </div>

                {products.length === 0 ? (
                    <div className="empty-research-state">
                        <h2>No products to discover yet</h2>
                        <p>
                            Import a market snapshot to begin finding product
                            opportunities.
                        </p>
                    </div>
                ) : sortedProducts.length === 0 ? (
                    <div className="empty-research-state">
                        <h2>No matching opportunities</h2>
                        <p>
                            Try changing your search or research filters.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="discovery-feed">
                            {currentProducts.map((product, index) => {
                                const score = calculateShopLensScore(
                                    product,
                                    products,
                                    categories,
                                    shops,
                                )

                                return (
                                    <ProductDiscoveryCard
                                        key={product.id}
                                        product={product}
                                        rank={startIndex + index + 1}
                                        score={score}
                                        onAnalyze={setSelectedProduct}
                                        onEdit={openEditModal}
                                        onDelete={openDeleteModal}
                                    />
                                )
                            })}
                        </div>

                        <ProductsPagination
                            currentPage={safeCurrentPage}
                            totalPages={totalPages}
                            onPrevious={() =>
                                setCurrentPage((page) =>
                                    Math.max(page - 1, 1),
                                )
                            }
                            onNext={() =>
                                setCurrentPage((page) =>
                                    Math.min(page + 1, totalPages),
                                )
                            }
                        />
                    </>
                )}
            </section>

            <ProductDetailsModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />

            <EditProductModal
                key={editingProduct?.id ?? 'closed'}
                product={editingProduct}
                isOpen={editingProduct !== null}
                isSaving={isSaving}
                error=""
                onClose={() => setEditingProduct(null)}
                onSave={handleSaveProduct}
            />

            <DeleteProductModal
                product={deletingProduct}
                isOpen={deletingProduct !== null}
                isDeleting={isDeleting}
                error=""
                onClose={() => setDeletingProduct(null)}
                onConfirm={handleDeleteProduct}
            />
        </>
    )
}

export default ProductsPage