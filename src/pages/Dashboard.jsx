import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import CategoryCard from '../components/CategoryCard'
import { CATEGORIES } from '../utils/constants'
import { useSavedProducts } from '../hooks/useSavedProducts'
import ProductsGate from '../components/ProductsGate'

export default function Dashboard() {
  const { items, loading, error, refresh } = useSavedProducts()

  const countByCategory = useMemo(() => {
    const counts = Object.fromEntries(CATEGORIES.map((c) => [c, 0]))
    items.forEach((item) => {
      if (counts[item.category] != null) counts[item.category] += 1
    })
    return counts
  }, [items])

  return (
    <div className="page-container">
      <PageHeader
        title="Dashboard"
        subtitle="Browse categories and view your saved items"
      />

      <section>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category}
              category={category}
              itemCount={countByCategory[category]}
              to={`/category/${encodeURIComponent(category)}`}
            />
          ))}
        </div>
      </section>

      <div className="mt-8">
      <ProductsGate loading={loading} error={error} onRetry={refresh}>
      {items.length === 0 && (
        <div className="card p-10 text-center">
          <p className="text-slate-600 mb-4">You have not added any items yet.</p>
          <Link to="/stocks/add" className="btn-gold inline-flex">
            <FiPlus /> Add your first item
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <p className="text-center text-slate-500 text-sm">
          Click a category to view your saved items.
        </p>
      )}
      </ProductsGate>
      </div>
    </div>
  )
}
