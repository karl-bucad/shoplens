import { useMemo, useState } from 'react'

export default function useProductDiscovery(
    products,
    itemsPerPage = 6,
) {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] =
        useState('All')
    const [selectedShop, setSelectedShop] = useState('All')
    const [sortOption, setSortOption] = useState('newest')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedProduct, setSelectedProduct] = useState(null)

    const categories = useMemo(
        () => [
            'All',
            ...new Set(
                products
                    .map((product) => product.category)
                    .filter(Boolean),
            ),
        ],
        [products],
    )

    const shops = useMemo(
        () => [
            'All',
            ...new Set(
                products
                    .map((product) => product.shop_name)
                    .filter(Boolean),
            ),
        ],
        [products],
    )

    const filteredProducts = useMemo(() => {
        const search = searchTerm.trim().toLowerCase()

        return products.filter((product) => {
            const matchesSearch =
                product.name.toLowerCase().includes(search) ||
                (product.shop_name ?? '')
                    .toLowerCase()
                    .includes(search) ||
                (product.category ?? '')
                    .toLowerCase()
                    .includes(search)

            const matchesCategory =
                selectedCategory === 'All' ||
                product.category === selectedCategory

            const matchesShop =
                selectedShop === 'All' ||
                product.shop_name === selectedShop

            return (
                matchesSearch &&
                matchesCategory &&
                matchesShop
            )
        })
    }, [
        products,
        searchTerm,
        selectedCategory,
        selectedShop,
    ])

    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
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
    }, [filteredProducts, sortOption])

    const totalPages = Math.max(
        1,
        Math.ceil(sortedProducts.length / itemsPerPage),
    )

    const safeCurrentPage = Math.min(
        currentPage,
        totalPages,
    )

    const startIndex =
        (safeCurrentPage - 1) * itemsPerPage

    const currentProducts = sortedProducts.slice(
        startIndex,
        startIndex + itemsPerPage,
    )

    const startItem =
        sortedProducts.length === 0
            ? 0
            : startIndex + 1

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

    return {
        searchTerm,
        selectedCategory,
        selectedShop,
        sortOption,
        currentPage,
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
    }
}