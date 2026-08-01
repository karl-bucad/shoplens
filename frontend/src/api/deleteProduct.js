import apiClient from './client'

export async function deleteProduct(productId) {
  await apiClient.delete(`/products/${productId}`)
}