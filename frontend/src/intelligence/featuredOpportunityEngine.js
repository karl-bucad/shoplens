import { getShopLensScore } from '../services/shoplensScore'

export function getFeaturedOpportunity(
    products,
    categories,
    shops,
) {
    if (products.length === 0) {
        return null
    }

    const scoredProducts = products.map((product) => ({
        product,
        scoreData: getShopLensScore(
            product,
            products,
            categories,
            shops,
        ),
    }))

    scoredProducts.sort((a, b) => {
        if (b.scoreData.score !== a.scoreData.score) {
            return b.scoreData.score - a.scoreData.score
        }

        return (
            new Date(b.product.created_at).getTime() -
            new Date(a.product.created_at).getTime()
        )
    })

    return scoredProducts[0]
}