import { FiEdit2, FiTrash2, FiEye, FiDownload } from 'react-icons/fi'
import { formatCurrency } from '../utils/productIdGenerator'

export default function TableComponent({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  onExport,
  page = 1,
  pageSize = 10,
  total,
  onPageChange,
}) {
  const totalPages = Math.ceil((total || data.length) / pageSize)
  const start = (page - 1) * pageSize
  const pageData = data.slice(start, start + pageSize)
  const hasActions = onView || onEdit || onDelete

  const renderCell = (row, col) => {
    const value = row[col.key]
    if (col.render) return col.render(value, row)
    if (col.type === 'image') {
      return (
        <img src={value} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
      )
    }
    if (col.type === 'currency') return formatCurrency(value)
    if (col.type === 'status') {
      const styles = {
        'In Stock': 'badge-success',
        'Low Stock': 'badge-warning',
        Out: 'badge-danger',
        Pending: 'badge-warning',
        Completed: 'badge-success',
        'In Progress': 'badge-info',
      }
      return <span className={styles[value] || 'badge-info'}>{value}</span>
    }
    return value
  }

  const actionButtons = (row) => (
    <div className="flex items-center gap-1 flex-wrap">
      {onView && (
        <button type="button" onClick={() => onView(row)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg" title="View">
          <FiEye />
        </button>
      )}
      {onEdit && (
        <button type="button" onClick={() => onEdit(row)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg" title="Edit">
          <FiEdit2 />
        </button>
      )}
      {onDelete && (
        <button type="button" onClick={() => onDelete(row)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
          <FiTrash2 />
        </button>
      )}
    </div>
  )

  const displayColumns = columns.filter((col) => col.type !== 'image')

  return (
    <div className="card overflow-hidden">
      {onExport && (
        <div className="px-3 sm:px-4 py-3 border-b border-slate-100 flex justify-end">
          <button type="button" onClick={onExport} className="btn-outline text-sm py-1.5 w-full sm:w-auto justify-center">
            <FiDownload /> Export
          </button>
        </div>
      )}

      {/* Mobile card layout */}
      <div className="md:hidden divide-y divide-slate-100">
        {pageData.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-400">No records found</p>
        ) : (
          pageData.map((row, idx) => {
            const imageCol = columns.find((c) => c.type === 'image')
            return (
              <div key={row.id || idx} className="mobile-data-card">
                <div className="flex gap-3 items-start">
                  {imageCol && row[imageCol.key] && (
                    <img
                      src={row[imageCol.key]}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0 space-y-2">
                    {displayColumns.map((col) => (
                      <div key={col.key}>
                        <p className="mobile-data-card-label">{col.label}</p>
                        <div className="mobile-data-card-value">{renderCell(row, col)}</div>
                      </div>
                    ))}
                    {hasActions && (
                      <div className="pt-2 border-t border-slate-100">
                        <p className="mobile-data-card-label mb-1">Actions</p>
                        {actionButtons(row)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block table-wrapper border-0 md:border md:rounded-xl">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              {hasActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {pageData.map((row, idx) => (
              <tr key={row.id || idx}>
                {columns.map((col) => (
                  <td key={col.key}>{renderCell(row, col)}</td>
                ))}
                {hasActions && <td>{actionButtons(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-3 sm:px-4 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-slate-500 text-center sm:text-left">
            Showing {start + 1}-{Math.min(start + pageSize, total || data.length)} of {total || data.length}
          </p>
          <div className="flex flex-wrap justify-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
              className="btn-outline text-sm py-1 px-3 disabled:opacity-40"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange?.(p)}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${p === page ? 'bg-primary-800 text-white' : 'hover:bg-slate-100'}`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(page + 1)}
              className="btn-outline text-sm py-1 px-3 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
