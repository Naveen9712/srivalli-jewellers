import { motion } from 'framer-motion'
import { formatCurrency } from '../utils/productIdGenerator'

export default function ProductCard({ product, onAdd, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={() => onClick?.(product)}
      className="card p-3 cursor-pointer hover:border-gold-500/50 transition-colors"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-28 object-cover rounded-lg bg-slate-100"
      />
      <div className="mt-3">
        <p className="text-xs text-gold-600 font-mono">{product.uniqueId}</p>
        <h3 className="font-semibold text-sm text-primary-900 mt-0.5 line-clamp-1">{product.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs badge-info">{product.carat}</span>
          {product.metalType && (
            <span className="text-xs text-slate-500">{product.metalType}</span>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          {product.sellingPrice != null && product.sellingPrice > 0 && (
            <p className="font-bold text-primary-800">{formatCurrency(product.sellingPrice)}</p>
          )}
          {onAdd && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onAdd(product) }}
              className="text-xs btn-gold py-1 px-2"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
