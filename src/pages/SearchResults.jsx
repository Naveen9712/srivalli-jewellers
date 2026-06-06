import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import ItemSearchBar from '../components/ItemSearchBar'
import ProductCard from '../components/ProductCard'
import { useSavedProducts } from '../hooks/useSavedProducts'
import { searchInProducts } from '../utils/localProducts'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { items, removeItem } = useSavedProducts()

  const results = useMemo(
    () => searchInProducts(items, query),
    [items, query],
  )

  return (
    <div className="page-container">
      <PageHeader
        title="Search"
        subtitle={
          query
            ? `${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`
            : 'Find items by unique number, name, or category'
        }
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Search' }]}
        actions={
          <Link to="/stocks/add" className="btn-gold">
            <FiPlus /> Add Item
          </Link>
        }
      />

      <div className="card p-4 mb-6">
        <ItemSearchBar autoFocus />
      </div>

      {!query.trim() ? (
        <div className="card p-10 text-center">
          <p className="text-slate-600">
            Enter a unique number (e.g. <span className="font-mono text-gold-600">GLD-RNG-22K-0001</span>), product name, or category to search.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-slate-600 mb-2">
            No items found for <strong className="font-mono text-primary-900">{query}</strong>.
          </p>
          <p className="text-sm text-slate-500">Try searching with the full unique number or part of the item name.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {results.map((item) => (
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
