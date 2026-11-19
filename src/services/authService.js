import api, { endpoints } from './api'

export async function loginRequest({ username, password }) {
  const { data } = await api.post(endpoints.login, { username, password })
  return data // { token, user }
}

export async function registerRequest({ name, username, email, password }) {
  const { data } = await api.post(endpoints.register, { name, username, email, password })
  return data // { token, user }
}

export async function fetchCurrentUser() {
  const { data } = await api.get(endpoints.me)
  return data.user
}

export async function logoutRequest(token) {
  if (!token) return
  await api.post(endpoints.logout, null, { headers: { 'X-SJ-Token': token } })
}
