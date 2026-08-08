import { useMemo, useState } from 'react'

import { searchProducts } from '../intelligence/searchEngine'

export default function useGlobalSearch(products) {
    const [query, setQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)

    const results = useMemo(
        () => searchProducts(products, query),
        [products, query],
    )

    function openSearch() {
        setIsOpen(true)
    }

    function closeSearch() {
        setIsOpen(false)
        setQuery('')
    }

    function handleQueryChange(event) {
        setQuery(event.target.value)

        if (!isOpen) {
            setIsOpen(true)
        }
    }

    return {
        query,
        results,
        isOpen,
        setQuery,
        openSearch,
        closeSearch,
        handleQueryChange,
    }
}