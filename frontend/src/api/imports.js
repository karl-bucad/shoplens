import apiClient from './client'

export async function getImportJobs() {
  const response = await apiClient.get('/imports')
  return response.data
}

export async function uploadProductCsv(file) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await apiClient.post('/imports/csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}