import apiClient from './client'

export async function getAnalyticsOverview() {
  const response = await apiClient.get('/analytics/overview')
  return response.data
}