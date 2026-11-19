import { configureStore } from '@reduxjs/toolkit'
import appReducer from './slices/appSlice'
import authReducer from './slices/authSlice'
import productsReducer from './slices/productsSlice'
import { saveStoredAuth, setAuthToken } from '../services/api'

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    products: productsReducer,
  },
})

// Keep the login (token + user) in localStorage so it survives a page refresh,
// and keep the API client's token header in sync.
let lastToken = store.getState().auth.token
let lastUser = store.getState().auth.user
store.subscribe(() => {
  const { token, user } = store.getState().auth
  if (token === lastToken && user === lastUser) return
  lastToken = token
  lastUser = user
  setAuthToken(token)
  saveStoredAuth(token ? { token, user } : null)
})
