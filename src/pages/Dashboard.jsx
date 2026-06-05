import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiPlus } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'
import { CATEGORIES } from '../utils/constants'
import { getCategoryImage } from '../utils/categoryImages'
import { loadTempProducts } from '../utils/localProducts'

export default function Dashboard() {
  const [items, setItems] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    setItems(loadTempProducts())
  }, [])

  const countByCategory = useMemo(() => {
    const counts = Object.fromEntries(CATEGORIES.map((c) => [c, 0]))
    items.forEach((item) => {
      if (counts[item.category] != null) counts[item.category] += 1
    })
    return counts
  }, [items])

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return []
    return items.filter((item) => item.category === selectedCategory)
  }, [items, selectedCategory])

  const handleCategoryClick = (category) => {
    setSelectedCategory((current) => (current === category ? null : category))
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Dashboard"
        subtitle={
          selectedCategory
            ? `Showing saved items in ${selectedCategory}`
            : 'Browse categories and view your saved items'
        }
        actions={
          <Link to="/stocks/add" className="btn-gold">
            <FiPlus /> Add Item
          </Link>
        }
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
              selected={selectedCategory === category}
              onClick={handleCategoryClick}
            />
          ))}
        </div>
      </section>

      {selectedCategory && (
        <section className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <img
                src={getCategoryImage(selectedCategory)}
                alt=""
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-gold-500/30"
              />
              <div>
                <h2 className="text-lg font-semibold text-primary-900">{selectedCategory}</h2>
                <p className="text-sm text-slate-500">
                  {filteredItems.length} saved item{filteredItems.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="btn-outline text-sm"
            >
              <FiArrowLeft /> All categories
            </button>
          </div>

          {filteredItems.length === 0 ? (
            <div className="card p-10 text-center">
              <img
                src={getCategoryImage(selectedCategory)}
                alt={selectedCategory}
                className="w-32 h-32 mx-auto rounded-2xl object-cover mb-4 opacity-80"
              />
              <p className="text-slate-600 mb-4">
                No items saved in <strong>{selectedCategory}</strong> yet.
              </p>
              <Link to="/stocks/add" className="btn-gold inline-flex">
                <FiPlus /> Add {selectedCategory} item
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          )}
        </section>
      )}

      {!selectedCategory && items.length === 0 && (
        <div className="card p-10 text-center mt-8">
          <p className="text-slate-600 mb-4">You have not added any items yet.</p>
          <Link to="/stocks/add" className="btn-gold inline-flex">
            <FiPlus /> Add your first item
          </Link>
        </div>
      )}

      {!selectedCategory && items.length > 0 && (
        <p className="text-center text-slate-500 text-sm mt-8">
          Click a category above to view your saved items.
        </p>
      )}
    </div>
  )
}
