import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi'
import { formatCurrency, formatWeight } from '../utils/productIdGenerator'
import { getCategoryImage, getProductImage } from '../utils/categoryImages'
import { deleteProduct, getProductById } from '../utils/localProducts'

function DetailRow({ label, value, mono }) {
  if (value == null || value === '') return null

  return (
    <tr className="border-b border-slate-100 last:border-0">
      <th className="py-3 px-4 text-left text-sm font-medium text-slate-500 bg-slate-50/80 w-2/5 align-top">
        {label}
      </th>
      <td className={`py-3 px-4 text-sm text-slate-800 ${mono ? 'font-mono' : ''}`}>
        {value}
      </td>
    </tr>
  )
}

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('additional')

  const result = useMemo(() => getProductById(id), [id])

  if (!result) {
    return <Navigate to="/stocks" replace />
  }

  const { product, isDeleted } = result
  const imageSrc = getProductImage(product)

  const handleDelete = () => {
    if (confirm(`Move "${product.name}" to Deleted Items?`)) {
      deleteProduct(product.id)
      navigate('/deleted-items')
    }
  }

  const statusClass =
    product.status === 'Low Stock'
      ? 'badge-warning'
      : isDeleted
        ? 'badge-danger'
        : 'badge-success'

  const statusLabel = isDeleted ? 'Deleted' : product.status || 'In Stock'

  return (
    <div className="page-container max-w-6xl mx-auto">
      <nav className="text-sm text-slate-500 mb-6 flex flex-wrap items-center gap-2">
        <Link to="/" className="hover:text-primary-800 transition-colors">Dashboard</Link>
        <span>/</span>
        <Link
          to={`/category/${encodeURIComponent(product.category)}`}
          className="hover:text-primary-800 transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-medium truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-10">
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="aspect-square bg-slate-50">
              <img
                src={imageSrc}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <Link
            to={`/category/${encodeURIComponent(product.category)}`}
            className="text-sm text-gold-600 hover:text-gold-500 font-medium uppercase tracking-wide mb-2 w-fit"
          >
            {product.category}
          </Link>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 font-[family-name:var(--font-display)] leading-tight">
            {product.name}
          </h1>

          <p className="mt-3 font-mono text-sm text-slate-500">
            SKU: <span className="text-gold-600 font-semibold">{product.uniqueId}</span>
          </p>

          {product.sellingPrice > 0 && (
            <p className="mt-4 text-2xl font-bold text-primary-900">
              {formatCurrency(product.sellingPrice)}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className={statusClass}>{statusLabel}</span>
            {product.carat && <span className="badge-info">{product.carat}</span>}
            {product.metalType && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                {product.metalType}
              </span>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 space-y-3 text-sm text-slate-600">
            {product.subCategory && (
              <p>
                <span className="font-medium text-slate-800">Type:</span> {product.subCategory}
              </p>
            )}
            {product.netWeight > 0 && (
              <p>
                <span className="font-medium text-slate-800">Weight:</span>{' '}
                {formatWeight(product.netWeight)}
              </p>
            )}
            {product.quantity != null && !isDeleted && (
              <p>
                <span className="font-medium text-slate-800">Quantity:</span> {product.quantity}
              </p>
            )}
            {product._createdAt && (
              <p>
                <span className="font-medium text-slate-800">Added:</span>{' '}
                {new Date(product._createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
            {isDeleted && product._deletedAt && (
              <p className="text-red-600">
                <span className="font-medium">Deleted:</span>{' '}
                {new Date(product._deletedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-outline"
            >
              <FiArrowLeft /> Back
            </button>
            {!isDeleted && (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-medium transition-colors"
              >
                <FiTrash2 /> Move to Deleted Items
              </button>
            )}
            {isDeleted && (
              <Link to="/deleted-items" className="btn-outline">
                View all deleted items
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {[
            { id: 'additional', label: 'Additional information' },
            { id: 'overview', label: 'Overview' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-gold-500 text-primary-900 bg-gold-50/50'
                  : 'border-transparent text-slate-500 hover:text-primary-800 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === 'additional' && (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[320px]">
                <tbody>
                  <DetailRow label="Unique Number" value={product.uniqueId} mono />
                  <DetailRow label="Product Name" value={product.name} />
                  <DetailRow label="Category" value={product.category} />
                  <DetailRow label="Sub Category" value={product.subCategory} />
                  <DetailRow label="Metal Type" value={product.metalType} />
                  <DetailRow label="Carat" value={product.carat} />
                  <DetailRow
                    label="Weight"
                    value={product.netWeight > 0 ? formatWeight(product.netWeight) : null}
                  />
                  <DetailRow label="Status" value={statusLabel} />
                  {!isDeleted && (
                    <DetailRow label="Quantity" value={String(product.quantity ?? 1)} />
                  )}
                  {product.sellingPrice > 0 && (
                    <DetailRow label="Price" value={formatCurrency(product.sellingPrice)} />
                  )}
                  {product._createdAt && (
                    <DetailRow
                      label="Date Added"
                      value={new Date(product._createdAt).toLocaleString('en-IN')}
                    />
                  )}
                  {isDeleted && product._deletedAt && (
                    <DetailRow
                      label="Date Deleted"
                      value={new Date(product._deletedAt).toLocaleString('en-IN')}
                    />
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-primary-900 mb-3">Product summary</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {product.name} is a {product.carat} {product.metalType?.toLowerCase() || 'jewellery'}{' '}
                  {product.category.toLowerCase()}
                  {product.subCategory ? ` (${product.subCategory})` : ''}.
                  {product.netWeight > 0 && ` Net weight: ${formatWeight(product.netWeight)}.`}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-primary-900 mb-3">Category</h3>
                <Link
                  to={`/category/${encodeURIComponent(product.category)}`}
                  className="block group overflow-hidden rounded-xl border border-slate-200"
                >
                  <img
                    src={getCategoryImage(product.category)}
                    alt={product.category}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-3 bg-slate-50">
                    <p className="text-sm font-medium text-primary-900">{product.category}</p>
                    <p className="text-xs text-slate-500 mt-0.5">View all {product.category} items</p>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
