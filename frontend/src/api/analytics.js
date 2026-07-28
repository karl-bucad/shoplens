import apiClient from './client'

export async function getAnalyticsOverview() {
  const response = await apiClient.get('/analytics/overview')
  return response.data
}

export async function getCategoryAnalytics() {
  const response = await apiClient.get('/analytics/categories')
  return response.data
}