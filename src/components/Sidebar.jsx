import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import {
  MdDashboard, MdPointOfSale, MdAddBox, MdInventory, MdPeople, MdAssessment, MdSettings,
  MdChevronLeft, MdChevronRight,
} from 'react-icons/md'
import { toggleSidebar } from '../redux/slices/appSlice'
import { SIDEBAR_LINKS } from '../utils/constants'

const iconMap = {
  MdDashboard, MdPointOfSale, MdAddBox, MdInventory, MdPeople, MdAssessment, MdSettings,
}

export default function Sidebar() {
  const { sidebarOpen } = useSelector((state) => state.app)
  const dispatch = useDispatch()
  const location = useLocation()

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 0 }}
        className="hidden lg:block fixed lg:sticky top-14 left-0 h-[calc(100vh-3.5rem)] bg-white border-r border-slate-200 z-30 overflow-hidden shrink-0"
      >
        <div className="w-60 h-full flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Access</p>
          </div>
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {SIDEBAR_LINKS.map((link) => {
              const Icon = iconMap[link.icon]
              const active = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-primary-900 text-white shadow-md'
                      : 'text-slate-600 hover:bg-primary-50 hover:text-primary-800'
                  }`}
                >
                  {Icon && <Icon className={`text-lg ${active ? 'text-gold-400' : ''}`} />}
                  {link.label}
                </Link>
              )
            })}
          </nav>
          <div className="p-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => dispatch(toggleSidebar())}
              className="flex w-full items-center justify-center gap-2 py-2 text-sm text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <MdChevronLeft /> Collapse
            </button>
          </div>
        </div>
      </motion.aside>
      {!sidebarOpen && (
        <button
          type="button"
          onClick={() => dispatch(toggleSidebar())}
          className="hidden lg:flex fixed left-0 top-20 z-30 p-1 bg-primary-800 text-white rounded-r-lg shadow"
          aria-label="Expand sidebar"
        >
          <MdChevronRight />
        </button>
      )}
    </>
  )
}
