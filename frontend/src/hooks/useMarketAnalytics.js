import { useEffect, useMemo, useState } from 'react'

import {
    getAnalyticsOverview,
    getCategoryAnalytics,
    getMarketComparison,
    getShopAnalytics,
} from '../api/analytics'

export default function useMarketAnalytics() {
    const [overview, setOverview] = useState(null)
    const [categories, setCategories] = useState([])
    const [shops, setShops] = useState([])
    const [comparison, setComparison] = useState(null)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadAnalytics() {
            try {
                const [
                    overviewData,
                    categoryData,
                    shopData,
                    comparisonData,
                ] = await Promise.all([
                    getAnalyticsOverview(),
                    getCategoryAnalytics(),
                    getShopAnalytics(),
                    getMarketComparison(),
                ])

                setOverview(overviewData)
                setCategories(categoryData)
                setShops(shopData)
                setComparison(comparisonData)
            } catch {
                setError('Unable to load market overview.')
            } finally {
                setLoading(false)
            }
        }

        loadAnalytics()
    }, [])

    const rankedCategories = useMemo(
        () =>
            [...categories].sort(
                (a, b) => b.product_count - a.product_count,
            ),
        [categories],
    )

    const rankedShops = useMemo(
        () =>
            [...shops].sort(
                (a, b) => b.product_count - a.product_count,
            ),
        [shops],
    )

    return {
        overview,
        rankedCategories,
        rankedShops,
        comparison,
        loading,
        error,
    }
}