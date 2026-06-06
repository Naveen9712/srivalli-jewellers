import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiPlus } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import ProductCard from '../components/ProductCard'
import { CATEGORIES } from '../utils/constants'
import { getCategoryImage } from '../utils/categoryImages'
import { useSavedProducts } from '../hooks/useSavedProducts'

export default function CategoryItems() {
  const { category: categoryParam } = useParams()
  const category = decodeURIComponent(categoryParam || '')
  const { items, removeItem } = useSavedProducts()

  const categoryItems = useMemo(
    () => items.filter((item) => item.category === category),
    [items, category],
  )

  if (!CATEGORIES.includes(category)) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="page-container">
      <PageHeader
        title={category}
        subtitle={`${categoryItems.length} saved item${categoryItems.length === 1 ? '' : 's'}`}
        breadcrumbs={[
          { label: 'Dashboard', path: '/' },
          { label: category },
        ]}
        actions={
          <Link to="/stocks/add" className="btn-gold">
            <FiPlus /> Add Item
          </Link>
        }
      />

      <Link to="/" className="btn-outline text-sm inline-flex mb-6">
        <FiArrowLeft /> Back to categories
      </Link>

      {categoryItems.length === 0 ? (
        <div className="card p-10 text-center">
          <img
            src={getCategoryImage(category)}
            alt={category}
            className="w-32 h-32 mx-auto rounded-2xl object-cover mb-4 opacity-80"
          />
          <p className="text-slate-600 mb-4">
            No items saved in <strong>{category}</strong> yet.
          </p>
          <Link to="/stocks/add" className="btn-gold inline-flex">
            <FiPlus /> Add {category} item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categoryItems.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onDelete={() => removeItem(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
