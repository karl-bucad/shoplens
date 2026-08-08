export function searchProducts(
    products,
    query,
) {
    const search = query.trim().toLowerCase()

    if (!search) {
        return products
    }

    return products.filter((product) => {
        return (
            product.name
                ?.toLowerCase()
                .includes(search) ||
            product.shop_name
                ?.toLowerCase()
                .includes(search) ||
            product.category
                ?.toLowerCase()
                .includes(search)
        )
    })
}