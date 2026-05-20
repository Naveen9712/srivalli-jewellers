import PageHeader from '../../components/PageHeader'
import TableComponent from '../../components/TableComponent'
import { orders } from '../../data/orders'
import { formatCurrency } from '../../utils/productIdGenerator'

export default function OrdersPage({ title = 'Orders' }) {
  const columns = [
    { key: 'id', label: 'Order ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'item', label: 'Item' },
    { key: 'amount', label: 'Amount', type: 'currency' },
    { key: 'advance', label: 'Advance', type: 'currency' },
    { key: 'due', label: 'Due', type: 'currency' },
    { key: 'deliveryDate', label: 'Delivery' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'type', label: 'Type' },
  ]

  return (
    <div className="page-container">
      <PageHeader title={title} subtitle="Track customer orders and pre-orders" />
      <TableComponent
        columns={columns}
        data={orders}
        onView={(row) => alert(`Order ${row.id}: ${row.item}\nDue: ${formatCurrency(row.due)}`)}
        onEdit={() => alert('Edit order (API pending)')}
        onExport={() => alert('Export orders')}
      />
    </div>
  )
}
