import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

/** Only lets signed-in users through; everyone else goes to the login page. */
export default function ProtectedRoute() {
  const token = useSelector((state) => state.auth.token)
  const signedOutByUser = useSelector((state) => state.auth.signedOutByUser)
  const location = useLocation()

  if (!token) {
    // Remember the page only when the session expired, so the same user can pick up
    // where they left off. After "Log out" the next user starts on their own dashboard.
    return <Navigate to="/login" replace state={signedOutByUser ? undefined : { from: location }} />
  }
  return <Outlet />
}
