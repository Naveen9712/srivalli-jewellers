import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'

export default function PageHeader({ title, subtitle, breadcrumbs = [], actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6"
    >
      <div className="min-w-0 flex-1">
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-xs text-slate-500 mb-2">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-1">
                {i > 0 && <FiChevronRight className="text-slate-400" />}
                {crumb.path ? (
                  <Link to={crumb.path} className="hover:text-primary-600">{crumb.label}</Link>
                ) : (
                  <span className="text-primary-700 font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full md:w-auto shrink-0 [&_.btn-gold]:justify-center [&_.btn-primary]:justify-center [&_.btn-outline]:justify-center">
          {actions}
        </div>
      )}
    </motion.div>
  )
}
