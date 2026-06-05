import { motion } from 'framer-motion'
import { getCategoryImage } from '../utils/categoryImages'

export default function CategoryCard({ category, itemCount = 0, selected, onClick }) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(category)}
      className={`group relative overflow-hidden rounded-2xl text-left shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 ${
        selected
          ? 'ring-2 ring-gold-500 shadow-md'
          : 'hover:shadow-md hover:ring-1 hover:ring-gold-500/40'
      }`}
    >
      <div className="aspect-[4/3] relative">
        <img
          src={getCategoryImage(category)}
          alt={category}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/35 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-semibold text-white text-lg font-[family-name:var(--font-display)]">
            {category}
          </h3>
          <p className="text-primary-100 text-xs mt-0.5">
            {itemCount === 0 ? 'No items yet' : `${itemCount} item${itemCount === 1 ? '' : 's'}`}
          </p>
        </div>
        {itemCount > 0 && (
          <span className="absolute top-3 right-3 min-w-[1.75rem] h-7 px-2 flex items-center justify-center rounded-full bg-gold-500 text-primary-900 text-xs font-bold shadow">
            {itemCount}
          </span>
        )}
      </div>
    </motion.button>
  )
}
