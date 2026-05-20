import { motion } from 'framer-motion'
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

export default function RateCard({ label, rate, unit = '/g', trend = 0 }) {
  const isUp = trend >= 0

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-xl p-4 text-white relative overflow-hidden"
    >
      <div className="absolute -right-4 -top-4 w-20 h-20 bg-gold-500/20 rounded-full" />
      <p className="text-xs font-medium text-primary-200 uppercase tracking-wider">{label}</p>
      <p className="text-xl sm:text-2xl font-bold mt-1 text-gold-400">
        ₹{rate.toLocaleString('en-IN')}
        <span className="text-sm text-primary-300 font-normal">{unit}</span>
      </p>
      {trend !== 0 && (
        <div className={`flex items-center gap-1 mt-2 text-xs ${isUp ? 'text-emerald-300' : 'text-red-300'}`}>
          {isUp ? <FiTrendingUp /> : <FiTrendingDown />}
          <span>{isUp ? '+' : ''}{trend} today</span>
        </div>
      )}
    </motion.div>
  )
}
