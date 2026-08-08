export function generateOpportunityInsights(
    overview,
    rankedCategories,
) {
    if (!overview || rankedCategories.length === 0) {
        return []
    }

    return rankedCategories.slice(0, 3).map((category) => {
        const categoryShare =
            overview.total_products > 0
                ? category.product_count / overview.total_products
                : 0

        const shopsInMarket = overview.total_shops || 0

        let status = 'medium'
        let label = 'Worth watching'

        if (categoryShare >= 0.4 && shopsInMarket <= 5) {
            status = 'high'
            label = 'High opportunity'
        } else if (categoryShare < 0.2) {
            status = 'low'
            label = 'Early signal'
        }

        return {
            title: category.category,
            description: `${category.product_count} tracked products • ${Math.round(
                categoryShare * 100,
            )}% of the current market • ${label}`,
            status,
        }
    })
}