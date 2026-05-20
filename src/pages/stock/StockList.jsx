import { useState, useMemo } from 'react'
import { FiPlus, FiFilter } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import SearchBar from '../../components/SearchBar'
import TableComponent from '../../components/TableComponent'
import Modal from '../../components/Modal'
import { products } from '../../data/products'
import { formatCurrency, formatWeight } from '../../utils/productIdGenerator'
import { useDebounce } from '../../hooks/useDebounce'

const columns = [
  { key: 'image', label: 'Image', type: 'image' },
  { key: 'uniqueId', label: 'Unique ID' },
  { key: 'name', label: 'Product Name' },
  { key: 'category', label: 'Category' },
  { key: 'carat', label: 'Carat' },
  { key: 'netWeight', label: 'Weight', render: (v) => formatWeight(v) },
  { key: 'quantity', label: 'Qty' },
  { key: 'sellingPrice', label: 'Price', type: 'currency' },
  { key: 'status', label: 'Status', type: 'status' },
]

export default function StockList({ metalFilter, title, addPath, lowStockOnly }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [viewItem, setViewItem] = useState(null)
  const debouncedSearch = useDebounce(search)

  const filtered = useMemo(() => {
    let list = metalFilter ? products.filter((p) => p.metalType === metalFilter) : products
    if (lowStockOnly || filter === 'low') list = list.filter((p) => p.status === 'Low Stock' || p.quantity <= 2)
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.uniqueId.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
    }
    return list
  }, [metalFilter, filter, debouncedSearch, lowStockOnly])

  return (
    <div className="page-container">
      <PageHeader
        title={title}
        subtitle="Manage inventory with search, filter and export"
        breadcrumbs={[{ label: 'Stock', path: '/stock/gold-list' }, { label: title }]}
        actions={
          <Link to={addPath} className="btn-gold">
            <FiPlus /> Add Item
          </Link>
        }
      />

      <div className="card p-4 mb-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, ID, category..." className="w-full" />
        <div className="flex items-center gap-2 w-full md:w-auto">
          <FiFilter className="text-slate-400" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field w-full md:w-auto">
            <option value="all">All Status</option>
            <option value="low">Low Stock Only</option>
          </select>
        </div>
      </div>

      <TableComponent
        columns={columns}
        data={filtered}
        page={page}
        onPageChange={setPage}
        onView={setViewItem}
        onEdit={(row) => alert(`Edit: ${row.name}`)}
        onDelete={(row) => confirm(`Delete ${row.name}?`) && alert('Deleted (demo)')}
        onExport={() => alert('Export to Excel (API pending)')}
      />

      <Modal isOpen={!!viewItem} onClose={() => setViewItem(null)} title="Product Details" size="lg">
        {viewItem && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <img src={viewItem.image} alt={viewItem.name} className="w-full rounded-xl object-cover max-h-64" />
            <div className="space-y-3 text-sm">
              <p><span className="text-slate-500">ID:</span> <span className="font-mono text-gold-600">{viewItem.uniqueId}</span></p>
              <p><span className="text-slate-500">Name:</span> <strong>{viewItem.name}</strong></p>
              <p><span className="text-slate-500">Category:</span> {viewItem.category} / {viewItem.subCategory}</p>
              <p><span className="text-slate-500">Carat:</span> {viewItem.carat}</p>
              <p><span className="text-slate-500">Gross Weight:</span> {formatWeight(viewItem.grossWeight)}</p>
              <p><span className="text-slate-500">Net Weight:</span> {formatWeight(viewItem.netWeight)}</p>
              <p><span className="text-slate-500">Selling Price:</span> <strong className="text-primary-800">{formatCurrency(viewItem.sellingPrice)}</strong></p>
              <p><span className="text-slate-500">HUID:</span> {viewItem.huid}</p>
              <p><span className="text-slate-500">Vendor:</span> {viewItem.vendor}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
