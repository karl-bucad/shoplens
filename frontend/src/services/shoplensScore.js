function getCategoryPoints(categoryShare) {
    if (categoryShare >= 0.4) {
        return 30
    }

    if (categoryShare >= 0.25) {
        return 24
    }

    if (categoryShare >= 0.15) {
        return 18
    }

    if (categoryShare >= 0.05) {
        return 10
    }

    return 5
}

function getShopPoints(shopCount) {
    if (shopCount === 1) {
        return 25
    }

    if (shopCount <= 2) {
        return 22
    }

    if (shopCount <= 4) {
        return 16
    }

    if (shopCount <= 7) {
        return 10
    }

    return 5
}

function getDiversityPoints(categoryCount) {
    if (categoryCount >= 8) {
        return 20
    }

    if (categoryCount >= 5) {
        return 16
    }

    if (categoryCount >= 3) {
        return 12
    }

    if (categoryCount >= 2) {
        return 8
    }

    return 3
}

function getCompetitionPoints(shopCount) {
    if (shopCount >= 10) {
        return 15
    }

    if (shopCount >= 6) {
        return 12
    }

    if (shopCount >= 3) {
        return 9
    }

    if (shopCount >= 2) {
        return 6
    }

    return 3
}

function getRecencyPoints(ageInDays) {
    if (ageInDays <= 1) {
        return 10
    }

    if (ageInDays <= 7) {
        return 8
    }

    if (ageInDays <= 30) {
        return 5
    }

    if (ageInDays <= 90) {
        return 3
    }

    return 1
}

export function getShopLensScore(
    product,
    products,
    categories,
    shops,
) {
    if (!product || products.length === 0) {
        return {
            score: 0,
            factors: [],
            recommendation: 'Insufficient data',
            confidence: 'Low',
        }
    }

    const trackedCategories = categories.filter(
        (category) => category !== 'All',
    )

    const trackedShops = shops.filter(
        (shop) => shop !== 'All',
    )

    const categoryCount = products.filter(
        (item) => item.category === product.category,
    ).length

    const shopCount = products.filter(
        (item) => item.shop_name === product.shop_name,
    ).length

    const categoryShare = categoryCount / products.length

    const createdAt = new Date(product.created_at)
    const now = new Date()

    const ageInDays = Math.max(
        0,
        Math.floor(
            (now.getTime() - createdAt.getTime()) /
            (1000 * 60 * 60 * 24),
        ),
    )

    const categoryPoints = getCategoryPoints(categoryShare)
    const shopPoints = getShopPoints(shopCount)
    const diversityPoints = getDiversityPoints(
        trackedCategories.length,
    )
    const competitionPoints = getCompetitionPoints(
        trackedShops.length,
    )
    const recencyPoints = getRecencyPoints(ageInDays)

    const factors = [
        {
            title: 'Category strength',
            points: categoryPoints,
            maxPoints: 30,
            description: `${Math.round(
                categoryShare * 100,
            )}% of tracked products belong to ${product.category ?? 'this category'
                }.`,
        },
        {
            title: 'Shop focus',
            points: shopPoints,
            maxPoints: 25,
            description:
                shopCount === 1
                    ? 'This is the only tracked product from this shop.'
                    : `${shopCount} tracked products currently belong to this shop.`,
        },
        {
            title: 'Market diversity',
            points: diversityPoints,
            maxPoints: 20,
            description: `${trackedCategories.length} ${trackedCategories.length === 1
                    ? 'category is'
                    : 'categories are'
                } represented in this snapshot.`,
        },
        {
            title: 'Competitive context',
            points: competitionPoints,
            maxPoints: 15,
            description: `${trackedShops.length} ${trackedShops.length === 1 ? 'shop is' : 'shops are'
                } represented in this snapshot.`,
        },
        {
            title: 'Recency',
            points: recencyPoints,
            maxPoints: 10,
            description:
                ageInDays === 0
                    ? 'This product was imported today.'
                    : `This product was imported ${ageInDays} ${ageInDays === 1 ? 'day' : 'days'
                    } ago.`,
        },
    ]

    const score = factors.reduce(
        (total, factor) => total + factor.points,
        0,
    )

    let recommendation = 'Low priority'

    if (score >= 90) {
        recommendation = 'Exceptional signal'
    } else if (score >= 75) {
        recommendation = 'Worth investigating'
    } else if (score >= 60) {
        recommendation = 'Research further'
    } else if (score >= 40) {
        recommendation = 'Monitor'
    }

    let confidence = 'Low'

    if (products.length >= 50) {
        confidence = 'High'
    } else if (products.length >= 15) {
        confidence = 'Medium'
    }

    return {
        score,
        factors,
        recommendation,
        confidence,
    }
}