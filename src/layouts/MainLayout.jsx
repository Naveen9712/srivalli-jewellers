import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { setSidebarOpen } from '../redux/slices/appSlice'
import { useMediaQuery } from '../hooks/useMediaQuery'

export default function MainLayout() {
  const location = useLocation()
  const dispatch = useDispatch()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const desktopInitialized = useRef(false)

  useEffect(() => {
    if (!isDesktop) {
      dispatch(setSidebarOpen(false))
      return
    }
    if (!desktopInitialized.current) {
      dispatch(setSidebarOpen(true))
      desktopInitialized.current = true
    }
  }, [isDesktop, dispatch])

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <div className="flex flex-1 min-w-0">
        <Sidebar />
        <main className="flex-1 min-w-0 w-full overflow-x-hidden">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
