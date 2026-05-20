import { motion } from 'framer-motion'

export default function DashboardCard({ title, value, subtitle, icon: Icon, color = 'blue', trend }) {
  const colors = {
    blue: 'from-primary-700 to-primary-900',
    gold: 'from-gold-500 to-gold-600',
    green: 'from-emerald-500 to-emerald-700',
    purple: 'from-violet-500 to-violet-700',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-rose-500 to-rose-700',
  }

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
      className="card p-4 sm:p-5 relative overflow-hidden group"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colors[color]} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-primary-900 mt-1 break-words">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
          {trend && (
            <p className={`text-xs font-medium mt-2 ${trend > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs yesterday
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} text-white shadow-lg`}>
            <Icon className="text-xl" />
          </div>
        )}
      </div>
    </motion.div>
  )
}
