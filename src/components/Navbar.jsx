import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MdDashboard, MdShoppingCart, MdInventory, MdPointOfSale, MdRecycling,
  MdPayments, MdAssessment, MdReceiptLong, MdPeople, MdSettings, MdDeleteOutline,
  MdMenu, MdNotifications, MdAccountCircle, MdClose,
} from 'react-icons/md'
import { FiChevronDown } from 'react-icons/fi'
import { FiSearch } from 'react-icons/fi'
import { NAV_MENUS } from '../utils/constants'
import ItemSearchBar from './ItemSearchBar'

const iconMap = {
  MdDashboard, MdShoppingCart, MdInventory, MdPointOfSale, MdRecycling,
  MdPayments, MdAssessment, MdReceiptLong, MdPeople, MdSettings, MdDeleteOutline,
}

function NavDropdown({ menu, isActive }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const Icon = iconMap[menu.icon]

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!menu.children) {
    return (
      <Link
        to={menu.path}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
          isActive ? 'bg-gold-500/20 text-gold-400' : 'text-white/80 hover:bg-white/10 hover:text-white'
        }`}
      >
        {Icon && <Icon className="text-lg" />}
        {menu.label}
      </Link>
    )
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
          isActive ? 'bg-gold-500/20 text-gold-400' : 'text-white/80 hover:bg-white/10 hover:text-white'
        }`}
      >
        {Icon && <Icon className="text-lg" />}
        {menu.label}
        <FiChevronDown className={`text-xs transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute top-full left-0 mt-1 min-w-[200px] bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50"
          >
            {menu.children.map((child) => (
              <Link
                key={child.path}
                to={child.path}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-800 transition-colors"
              >
                {child.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenu, setMobileMenu] = useState(false)

  const isMenuActive = (menu) => {
    if (menu.path) return location.pathname === menu.path
    return menu.children?.some((c) => location.pathname.startsWith(c.path.split('/').slice(0, 2).join('/')))
  }

  useEffect(() => {
    setMobileMenu(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileMenu ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenu])

  return (
    <header className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 shadow-lg sticky top-0 z-40">
      <div className="flex items-center h-14 px-3 sm:px-4 gap-2 sm:gap-4 min-w-0">
        <Link to="/" className="flex items-center gap-2 shrink-0 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center font-bold text-primary-900 text-xs sm:text-sm shadow shrink-0">
            SJ
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-xs sm:text-sm leading-tight font-[family-name:var(--font-display)] truncate max-w-[140px] sm:max-w-none">
              <span className="sm:hidden">Srivalli</span>
              <span className="hidden sm:inline">Srivalli jewellers</span>
            </p>
            <p className="text-gold-400 text-[9px] sm:text-[10px] leading-tight hidden sm:block truncate">
              Jewellery Management
            </p>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-0.5 flex-1 overflow-x-auto scrollbar-hide ml-2 min-w-0">
          {NAV_MENUS.map((menu) => (
            <NavDropdown key={menu.label} menu={menu} isActive={isMenuActive(menu)} />
          ))}
        </nav>

        <div className="hidden md:block flex-1 max-w-md mx-2 min-w-0">
          <ItemSearchBar
            compact
            placeholder="Search unique number..."
            iconClassName="text-white/50"
            inputClassName="w-full pl-10 pr-3 py-1.5 text-sm rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50 focus:bg-white/15"
          />
        </div>

        <div className="flex items-center gap-1 sm:gap-2 ml-auto shrink-0">
          <button
            type="button"
            onClick={() => navigate('/search')}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg md:hidden"
            aria-label="Search items"
          >
            <FiSearch className="text-xl" />
          </button>
          <button
            type="button"
            className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
            aria-label="Notifications"
          >
            <MdNotifications className="text-xl" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2 p-1.5 sm:pr-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
            aria-label="Settings"
          >
            <MdAccountCircle className="text-2xl" />
            <span className="hidden md:block text-sm font-medium">Admin</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileMenu(!mobileMenu)}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg xl:hidden"
            aria-label={mobileMenu ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenu}
          >
            {mobileMenu ? <MdClose className="text-xl" /> : <MdMenu className="text-xl" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-14 bg-black/40 z-40 xl:hidden"
              onClick={() => setMobileMenu(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="fixed top-14 right-0 bottom-0 w-full max-w-xs bg-primary-900 z-50 xl:hidden overflow-y-auto shadow-2xl border-l border-white/10"
            >
              <div className="p-4 flex flex-col gap-1">
                <div className="mb-4 px-1">
                  <ItemSearchBar
                    compact
                    placeholder="Search unique number..."
                    iconClassName="text-white/50"
                    inputClassName="w-full pl-10 pr-3 py-2 text-sm rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                  />
                </div>
                {NAV_MENUS.map((menu) =>
                  menu.children ? (
                    <div key={menu.label} className="mb-3">
                      <p className="text-gold-400 text-xs font-semibold uppercase px-3 py-2 tracking-wider">{menu.label}</p>
                      {menu.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={() => setMobileMenu(false)}
                          className={`block px-4 py-3 text-sm rounded-lg transition-colors ${
                            location.pathname === child.path
                              ? 'bg-gold-500/20 text-gold-400 font-medium'
                              : 'text-white/90 hover:bg-white/10'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      key={menu.path}
                      to={menu.path}
                      onClick={() => setMobileMenu(false)}
                      className={`px-4 py-3 text-sm rounded-lg transition-colors ${
                        location.pathname === menu.path
                          ? 'bg-gold-500/20 text-gold-400 font-medium'
                          : 'text-white/90 hover:bg-white/10'
                      }`}
                    >
                      {menu.label}
                    </Link>
                  ),
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
