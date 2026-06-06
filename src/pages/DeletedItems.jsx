import PageHeader from '../components/PageHeader'
import ProductCard from '../components/ProductCard'
import { useDeletedProducts } from '../hooks/useDeletedProducts'

export default function DeletedItems() {
  const { items } = useDeletedProducts()

  return (
    <div className="page-container">
      <PageHeader
        title="Deleted Items"
        subtitle="Items moved here when deleted from your inventory"
        breadcrumbs={[{ label: 'Dashboard', path: '/' }, { label: 'Deleted Items' }]}
      />

      {items.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-slate-600">No deleted items yet.</p>
          <p className="text-sm text-slate-500 mt-2">
            When you delete an item, it will appear here instead of being permanently removed.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              deletedAt={item._deletedAt}
            />
          ))}
        </div>
      )}
    </div>
  )
}
