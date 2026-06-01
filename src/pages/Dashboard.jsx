import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import ProductCard from '../components/ProductCard'
import { loadTempProducts } from '../utils/localProducts'

export default function Dashboard() {
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(loadTempProducts())
  }, [])

  return (
    <div className="page-container">
      <PageHeader
        title="Dashboard"
        subtitle="Items you have added"
        actions={
          <Link to="/stocks/add" className="btn-gold">
            <FiPlus /> Add Item
          </Link>
        }
      />

      {items.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-slate-600 mb-4">No items added yet.</p>
          <Link to="/stocks/add" className="btn-gold inline-flex">
            <FiPlus /> Add your first item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  )
}
