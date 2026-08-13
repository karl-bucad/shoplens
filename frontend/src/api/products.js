import apiClient from './client'

export async function getProducts() {
    const response = await apiClient.get('/products')
    return response.data
}

export async function getLatestProducts() {
    const response = await apiClient.get('/products/latest')
    return response.data
}