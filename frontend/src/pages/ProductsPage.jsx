import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import DeleteProductModal from '../components/DeleteProductModal'
import EditProductModal from '../components/EditProductModal'
import ProductDetailsModal from '../components/ProductDetailsModal'
import ProductFilters from '../components/ProductFilters'
import ProductsPagination from '../components/ProductsPagination'
import ProductsTable from '../components/ProductsTable'
import TableSkeleton from '../components/TableSkeleton'

import { deleteProduct } from '../api/deleteProduct'
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

    const [deletingProduct, setDeletingProduct] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

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

            toast.success('Product deleted', {
                description: `${deletedName} was removed successfully.`,
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

    return (
        <>
            <div className="page-header">
                <div>
                    <h1>Products</h1>
                    <p>Browse and manage your imported product data.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="table-card">
                    <TableSkeleton rows={8} />
                </div>
            ) : error ? (
                <div className="error-state">
                    <h2>Unable to load products</h2>
                    <p>{error}</p>
                </div>
            ) : (
                <>
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
                                <ProductsTable
                                    products={currentProducts}
                                    formatDate={formatDate}
                                    onView={setSelectedProduct}
                                    onEdit={openEditModal}
                                    onDelete={openDeleteModal}
                                />

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
                    </div>
                </>
            )}

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