import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AppRoutes from './routes/AppRoutes'
import { setUnauthorizedHandler } from './services/api'
import { refreshUser, sessionExpired } from './redux/slices/authSlice'

export default function App() {
  const dispatch = useDispatch()
  const hasToken = useSelector((state) => Boolean(state.auth.token))

  // If WordPress rejects the saved token, send the user back to the login page.
  useEffect(() => {
    setUnauthorizedHandler(() => dispatch(sessionExpired()))
    return () => setUnauthorizedHandler(null)
  }, [dispatch])

  // Check a saved login once when the app opens.
  useEffect(() => {
    if (hasToken) dispatch(refreshUser())
  }, [])

  return <AppRoutes />
}
