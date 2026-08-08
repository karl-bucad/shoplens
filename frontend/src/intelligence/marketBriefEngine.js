export function generateMarketBrief(
    overview,
    rankedCategories,
    rankedShops,
) {
    if (
        !overview ||
        rankedCategories.length === 0 ||
        rankedShops.length === 0
    ) {
        return []
    }

    const topCategory = rankedCategories[0]
    const topShop = rankedShops[0]

    const categoryShare =
        overview.total_products > 0
            ? Math.round(
                (topCategory.product_count /
                    overview.total_products) *
                100,
            )
            : 0

    let competition = 'low'

    if (overview.total_shops >= 15) {
        competition = 'high'
    } else if (overview.total_shops >= 8) {
        competition = 'moderate'
    }

    const concentration =
        rankedCategories
            .slice(0, 3)
            .reduce(
                (sum, category) => sum + category.product_count,
                0,
            ) / overview.total_products

    const marketStructure =
        concentration >= 0.75
            ? 'highly concentrated'
            : concentration >= 0.55
                ? 'moderately concentrated'
                : 'well diversified'

    return [
        {
            title: 'Category Leader',
            text: `${topCategory.category} represents approximately ${categoryShare}% of tracked products, making it the largest category in this snapshot.`,
        },
        {
            title: 'Largest Shop',
            text: `${topShop.shop_name} currently has the largest presence with ${topShop.product_count} tracked products.`,
        },
        {
            title: 'Market Competition',
            text: `The current market appears ${competition} in competition with ${overview.total_shops} active shops across ${overview.total_categories} categories.`,
        },
        {
            title: 'Market Structure',
            text: `Based on category distribution, the marketplace is ${marketStructure}.`,
        },
    ]
}