import axios from 'axios'

/**
 * WordPress REST API address, set in .env as VITE_API_URL. Two formats work:
 *
 *   https://your-site.com/?rest_route=/srivalli/v1     ← works with ANY permalink setting
 *                                                         (including "Plain") – recommended
 *   https://your-site.com/wp-json/srivalli/v1          ← only when pretty permalinks are on
 */
const API_URL = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '')

export const isApiConfigured = Boolean(API_URL)

const usesRestRoute = API_URL.includes('rest_route=')

/**
 * Builds the full request URL for an API path such as "/products/12".
 * With "?rest_route=" the path goes inside the rest_route value
 * (…/?rest_route=/srivalli/v1/products/12) and any query string is joined with "&".
 */
export function buildApiUrl(path) {
  if (!usesRestRoute) return API_URL + path

  const [routePath, query] = path.split('?')
  const [beforeRoute, afterRoute] = API_URL.split('rest_route=')
  const [routeBase, ...otherParams] = afterRoute.split('&')
  const route = decodeURIComponent(routeBase).replace(/\/+$/, '') + routePath
  const extra = [...otherParams, ...(query ? [query] : [])]
  return `${beforeRoute}rest_route=${route}${extra.length ? `&${extra.join('&')}` : ''}`
}

export const AUTH_STORAGE_KEY = 'srivalli:auth'

export function loadStoredAuth() {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return parsed?.token ? parsed : null
  } catch {
    return null
  }
}

export function saveStoredAuth(auth) {
  try {
    if (auth?.token) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  } catch {
    // storage unavailable (private mode) – session just won't survive a refresh
  }
}

let authToken = loadStoredAuth()?.token || null
let onUnauthorized = null

export function setAuthToken(token) {
  authToken = token || null
}

/** Called when the server says the token is no longer valid (401). */
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

const api = axios.create({
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  config.apiPath = config.url // e.g. "/auth/login" – kept for the 401 check below
  config.url = buildApiUrl(config.url)
  if (authToken) config.headers['X-SJ-Token'] = authToken
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.apiPath || ''
    const isLoginCall = url.includes('/auth/login') || url.includes('/auth/register')
    const sentToken = error.config?.headers?.['X-SJ-Token']
    // Only expire the session if the rejected token is the one currently in use.
    if (error.response?.status === 401 && authToken && sentToken === authToken && !isLoginCall) {
      onUnauthorized?.()
    }
    return Promise.reject(error)
  },
)

export default api

export const endpoints = {
  login: '/auth/login',
  register: '/auth/register',
  me: '/auth/me',
  logout: '/auth/logout',
  products: '/products',
}

/** Turns an Axios error into { message, code, field, status } for the UI. */
export function toApiError(error, fallback = 'Something went wrong. Please try again.') {
  if (!isApiConfigured) {
    return { message: 'The server address is not set. Add VITE_API_URL to the .env file and restart the app.' }
  }
  if (error?.response) {
    const body = error.response.data || {}
    return {
      status: error.response.status,
      code: body.code,
      field: body.data?.field,
      message: body.message || fallback,
    }
  }
  if (error?.code === 'ECONNABORTED') {
    return { message: 'The server took too long to respond. Please try again.' }
  }
  return { message: 'Cannot reach the server. Check your internet connection and the VITE_API_URL setting.' }
}
