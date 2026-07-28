import apiClient from './client'

export async function getProducts() {
  const response = await apiClient.get('/products')
  return response.data
}