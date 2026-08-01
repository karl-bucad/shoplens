import apiClient from './client'

export async function updateProduct(product) {
  const response = await apiClient.put(
    `/products/${product.id}`,
    {
      name: product.name,
      shop_name: product.shop_name,
      category: product.category,
    }
  )

  return response.data
}