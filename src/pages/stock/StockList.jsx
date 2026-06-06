import { FiPlus } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import ProductCard from '../../components/ProductCard'
import { useSavedProducts } from '../../hooks/useSavedProducts'

export default function StockList({ title = 'Stocks', addPath = '/stocks/add' }) {
  const { items, removeItem } = useSavedProducts()

  return (
    <div className="page-container">
      <PageHeader
        title={title}
        subtitle="Your saved items"
        breadcrumbs={[{ label: 'Stocks', path: '/stocks' }, { label: title }]}
        actions={
          <Link to={addPath} className="btn-gold">
            <FiPlus /> Add Item
          </Link>
        }
      />

      {items.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-slate-600 mb-4">No items saved yet.</p>
          <Link to={addPath} className="btn-gold inline-flex">
            <FiPlus /> Add your first item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
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
