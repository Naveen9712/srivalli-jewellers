import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FiPlus, FiPhone, FiMapPin } from 'react-icons/fi'
import PageHeader from '../../components/PageHeader'
import SearchBar from '../../components/SearchBar'
import TableComponent from '../../components/TableComponent'
import Modal from '../../components/Modal'
import FormInput from '../../components/FormInput'
import { customers as initialCustomers } from '../../data/customers'
import { formatCurrency } from '../../utils/productIdGenerator'
import { useDebounce } from '../../hooks/useDebounce'

export default function Customers() {
  const [customers, setCustomers] = useState(initialCustomers)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [viewCustomer, setViewCustomer] = useState(null)
  const debouncedSearch = useDebounce(search)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const filtered = customers.filter(
    (c) =>
      !debouncedSearch ||
      c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      c.phone.includes(debouncedSearch),
  )

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'address', label: 'Address', render: (v) => <span className="max-w-[200px] truncate block">{v}</span> },
    { key: 'dueAmount', label: 'Due Amount', type: 'currency' },
    { key: 'totalPurchases', label: 'Total Purchases', type: 'currency' },
  ]

  const onSubmit = (data) => {
    setCustomers((prev) => [
      ...prev,
      { id: prev.length + 1, ...data, dueAmount: 0, totalPurchases: 0, lastVisit: new Date().toISOString().slice(0, 10), purchaseHistory: [] },
    ])
    reset()
    setModalOpen(false)
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Customers"
        subtitle="Manage customer records and due amounts"
        actions={
          <button type="button" onClick={() => setModalOpen(true)} className="btn-gold">
            <FiPlus /> Add Customer
          </button>
        }
      />

      <div className="card p-4 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or phone..." />
      </div>

      <TableComponent
        columns={columns}
        data={filtered}
        onView={setViewCustomer}
        onEdit={() => setModalOpen(true)}
        onDelete={(row) => setCustomers((prev) => prev.filter((c) => c.id !== row.id))}
        onExport={() => alert('Export customers (API pending)')}
      />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Customer"
        footer={
          <>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline">Cancel</button>
            <button type="submit" form="customer-form" className="btn-primary">Save Customer</button>
          </>
        }
      >
        <form id="customer-form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Name" name="name" register={register} errors={errors} required rules={{ required: 'Required' }} />
          <FormInput label="Phone" name="phone" register={register} errors={errors} required rules={{ required: 'Required' }} />
          <FormInput label="Email" name="email" type="email" register={register} errors={errors} className="md:col-span-2" />
          <FormInput label="Address" name="address" type="textarea" register={register} errors={errors} className="md:col-span-2" required rules={{ required: 'Required' }} />
        </form>
      </Modal>

      <Modal isOpen={!!viewCustomer} onClose={() => setViewCustomer(null)} title="Customer Details" size="lg">
        {viewCustomer && (
          <div>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary-900 text-gold-400 flex items-center justify-center text-2xl font-bold">
                {viewCustomer.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-900">{viewCustomer.name}</h3>
                <p className="flex items-center gap-1 text-sm text-slate-500 mt-1"><FiPhone /> {viewCustomer.phone}</p>
                <p className="flex items-center gap-1 text-sm text-slate-500"><FiMapPin /> {viewCustomer.address}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-amber-50 rounded-lg"><p className="text-xs text-slate-500">Due Amount</p><p className="text-lg font-bold text-amber-700">{formatCurrency(viewCustomer.dueAmount)}</p></div>
              <div className="p-4 bg-emerald-50 rounded-lg"><p className="text-xs text-slate-500">Total Purchases</p><p className="text-lg font-bold text-emerald-700">{formatCurrency(viewCustomer.totalPurchases)}</p></div>
            </div>
            <h4 className="font-semibold mb-2">Purchase History</h4>
            <table className="data-table">
              <thead><tr><th>Date</th><th>Item</th><th>Amount</th></tr></thead>
              <tbody>
                {viewCustomer.purchaseHistory.map((h, i) => (
                  <tr key={i}><td>{h.date}</td><td>{h.item}</td><td>{formatCurrency(h.amount)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  )
}
