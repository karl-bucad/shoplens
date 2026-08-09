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
        return {
            summary: '',
            insights: [],
            opportunity: '',
        }
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

    const topThreeProductCount = rankedCategories
        .slice(0, 3)
        .reduce(
            (sum, category) =>
                sum + category.product_count,
            0,
        )

    const concentration =
        overview.total_products > 0
            ? topThreeProductCount /
            overview.total_products
            : 0

    const marketStructure =
        concentration >= 0.75
            ? 'highly concentrated'
            : concentration >= 0.55
                ? 'moderately concentrated'
                : 'well diversified'

    const insights = [
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

    const summary =
        `${topCategory.category} leads the current market snapshot with approximately ${categoryShare}% of tracked products. ` +
        `${topShop.shop_name} has the largest individual shop presence, while overall competition appears ${competition}. ` +
        `Across ${overview.total_categories} categories and ${overview.total_shops} active shops, the marketplace is currently ${marketStructure}.`

    let opportunity

    if (competition === 'low') {
        opportunity =
            `Competition is currently limited, which may indicate room to research additional products in ${topCategory.category} and other underrepresented categories before the market becomes more crowded.`
    } else if (
        competition === 'moderate'
    ) {
        opportunity =
            `Competition is moderate, so the strongest opportunities are likely to come from identifying categories with strong demand signals but fewer established shops.`
    } else {
        opportunity =
            `Competition is high, so product selection should prioritize differentiated opportunities with strong ShopLens Scores and less concentrated category competition.`
    }

    return {
        summary,
        insights,
        opportunity,
    }
}