export function getShopLensScore(
    product,
    products,
    categories,
    shops,
) {
    if (!product) {
        return {
            score: 0,
            factors: [],
            recommendation: '',
            confidence: 'Low',
        }
    }

    const categoryCount = products.filter(
        (item) => item.category === product.category,
    ).length

    const shopCount = products.filter(
        (item) => item.shop_name === product.shop_name,
    ).length

    const categoryShare =
        products.length > 0
            ? categoryCount / products.length
            : 0

    const factors = []

    let score = 40

    if (categoryShare >= 0.3) {
        score += 25

        factors.push({
            title: 'Strong category presence',
            points: 25,
            description: `${Math.round(
                categoryShare * 100,
            )}% of tracked products belong to this category.`,
        })
    } else if (categoryShare >= 0.15) {
        score += 15

        factors.push({
            title: 'Healthy category presence',
            points: 15,
            description: `${Math.round(
                categoryShare * 100,
            )}% of tracked products belong to this category.`,
        })
    } else {
        score += 8

        factors.push({
            title: 'Emerging category',
            points: 8,
            description:
                'This category currently represents a smaller portion of the market.',
        })
    }

    if (shopCount <= 2) {
        score += 20

        factors.push({
            title: 'Focused shop catalog',
            points: 20,
            description: `Only ${shopCount} tracked product${shopCount === 1 ? '' : 's'
                } from this shop.`,
        })
    } else if (shopCount <= 5) {
        score += 12

        factors.push({
            title: 'Balanced shop catalog',
            points: 12,
            description: `${shopCount} tracked products from this shop.`,
        })
    } else {
        score += 5

        factors.push({
            title: 'Large shop catalog',
            points: 5,
            description: `${shopCount} tracked products from this shop.`,
        })
    }

    if (categories.length > 3) {
        score += 8

        factors.push({
            title: 'Diverse category landscape',
            points: 8,
            description: `${categories.length - 1} categories are represented in this snapshot.`,
        })
    }

    if (shops.length > 3) {
        score += 7

        factors.push({
            title: 'Competitive marketplace',
            points: 7,
            description: `${shops.length - 1} shops are represented in this snapshot.`,
        })
    }

    const finalScore = Math.min(
        100,
        Math.round(score),
    )

    let recommendation = 'Monitor'

    if (finalScore >= 85) {
        recommendation = 'Worth investigating'
    } else if (finalScore >= 70) {
        recommendation = 'Research further'
    }

    let confidence = 'Low'

    if (factors.length >= 4) {
        confidence = 'High'
    } else if (factors.length >= 3) {
        confidence = 'Medium'
    }

    return {
        score: finalScore,
        factors,
        recommendation,
        confidence,
    }
}