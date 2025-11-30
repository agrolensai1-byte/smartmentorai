import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const api = axios.create({ baseURL: API_URL })

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('token', token)
  } else {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem('token')
  }
}

// Restore token from localStorage on load
const savedToken = localStorage.getItem('token')
if (savedToken) setAuthToken(savedToken)

// Auth
export async function register(name, password) {
  const { data } = await api.post('/api/auth/register', { name, password })
  setAuthToken(data.token)
  return data.user
}

export async function login(name, password) {
  const { data } = await api.post('/api/auth/login', { name, password })
  setAuthToken(data.token)
  return data.user
}

export async function logout() {
  setAuthToken(null)
}

// Courses
export async function getCourses() {
  const { data } = await api.get('/api/courses')
  return data
}

export async function getCourse(slug) {
  const { data } = await api.get(`/api/courses/${slug}`)
  return data
}

export async function seedDemoCourse() {
  const { data } = await api.post('/api/courses/seed-demo')
  return data
}

// Sync
export async function syncProgress(name, path, changes) {
  const { data } = await api.post('/api/sync', { name, path, changes })
  return data
}

export default api
