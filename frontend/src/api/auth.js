import apiClient from './client'

export async function registerUser(userData) {
  const response = await apiClient.post('/auth/register', userData)
  return response.data
}

export async function loginUser(credentials) {
  const formData = new URLSearchParams()

  formData.append('username', credentials.email)
  formData.append('password', credentials.password)

  const response = await apiClient.post('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  return response.data
}