import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import DeleteProductModal from '../components/DeleteProductModal'
import EditProductModal from '../components/EditProductModal'
import FeaturedOpportunity from '../components/FeaturedOpportunity'
import ProductDetailsModal from '../components/ProductDetailsModal'
import ProductDiscoveryCard from '../components/ProductDiscoveryCard'
import ProductFilters from '../components/ProductFilters'
import ProductsPagination from '../components/ProductsPagination'

import { deleteProduct } from '../api/deleteProduct'
import { getProducts } from '../api/products'
import { updateProduct } from '../api/updateProduct'

import useProductDiscovery from '../hooks/useProductDiscovery'
import { getFeaturedOpportunity } from '../intelligence/featuredOpportunityEngine'
import { getShopLensScore } from '../services/shoplensScore'

function ProductsPage() {
    const [products, setProducts] = useState([])

    const [editingProduct, setEditingProduct] = useState(null)
    const [isSaving, setIsSaving] = useState(false)

    const [deletingProduct, setDeletingProduct] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    const {
        searchTerm,
        selectedCategory,
        selectedShop,
        sortOption,
        selectedProduct,

        categories,
        shops,
        sortedProducts,
        currentProducts,

        totalPages,
        safeCurrentPage,
        startIndex,
        startItem,
        endItem,

        setCurrentPage,
        setSelectedProduct,

        handleSearchChange,
        handleCategoryChange,
        handleShopChange,
        handleSortChange,
    } = useProductDiscovery(products, 6)

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

    const selectedScoreData = selectedProduct
        ? getShopLensScore(
            selectedProduct,
            products,
            categories,
            shops,
        )
        : null

    const featuredOpportunity = getFeaturedOpportunity(
        sortedProducts,
        categories,
        shops,
    )

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
                        <p>
                            Scanning your market snapshot for products...
                        </p>
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
                    <p className="page-eyebrow">
                        Discovery
                    </p>

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

                <FeaturedOpportunity
                    opportunity={featuredOpportunity}
                    onAnalyze={setSelectedProduct}
                />

                <div className="discovery-results-header">
                    <div>
                        <p className="page-eyebrow">
                            Research Feed
                        </p>

                        <h2>Tracked Products</h2>
                    </div>

                    <span>
                        Showing {startItem}–{endItem} of{' '}
                        {sortedProducts.length}
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
                                const scoreData = getShopLensScore(
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
                                        score={scoreData.score}
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
                scoreData={selectedScoreData}
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