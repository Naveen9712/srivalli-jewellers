import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { formatCurrency, formatWeight } from '../utils/productIdGenerator'
import { getProductImage } from '../utils/categoryImages'

export default function ProductCard({ product, onAdd, onDelete, onClick, deletedAt, linkToDetails = true, showEdit = false }) {
  const navigate = useNavigate()
  const imageSrc = getProductImage(product)

  const handleCardClick = () => {
    if (onClick) {
      onClick(product)
      return
    }
    if (linkToDetails && !onAdd) {
      navigate(`/product/${encodeURIComponent(product.id)}`)
    }
  }

  const handleEdit = (event) => {
    event.stopPropagation()
    navigate(`/stocks/edit/${encodeURIComponent(product.id)}`)
  }

  const handleDelete = (event) => {
    event.stopPropagation()
    if (confirm(`Move "${product.name}" to Deleted Items?`)) {
      onDelete?.(product)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={handleCardClick}
      className="card p-3 cursor-pointer hover:border-gold-500/50 transition-colors overflow-hidden"
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick()
        }
      }}
    >
      <img
        src={imageSrc}
        alt={product.name}
        className="w-full h-36 object-cover rounded-lg bg-slate-100"
      />
      <div className="mt-3">
        <p className="text-xs text-gold-600 font-mono">{product.uniqueId}</p>
        <h3 className="font-semibold text-sm text-primary-900 mt-0.5 line-clamp-1">{product.name}</h3>
        {deletedAt && (
          <p className="text-xs text-red-600 mt-1">
            Deleted {new Date(deletedAt).toLocaleDateString('en-IN')}
          </p>
        )}
        <div className="flex items-center justify-between mt-2 gap-2">
          <span className="text-xs badge-info">{product.carat}</span>
          {product.netWeight > 0 && (
            <span className="text-xs text-slate-500">{formatWeight(product.netWeight)}</span>
          )}
        </div>
        {product.metalType && (
          <p className="text-xs text-slate-500 mt-1">{product.metalType}</p>
        )}
        <div className="flex items-center justify-between mt-2 gap-2">
          {product.sellingPrice != null && product.sellingPrice > 0 ? (
            <p className="font-bold text-primary-800">{formatCurrency(product.sellingPrice)}</p>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2 ml-auto flex-wrap justify-end">
            {showEdit && (
              <button
                type="button"
                onClick={handleEdit}
                className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-primary-200 text-primary-700 hover:bg-primary-50 transition-colors"
                aria-label={`Edit ${product.name}`}
              >
                <FiEdit2 className="text-sm" />
                Edit
              </button>
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
            {onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                aria-label={`Delete ${product.name}`}
              >
                <FiTrash2 className="text-sm" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
