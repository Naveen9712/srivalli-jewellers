import { useState } from 'react'
import { FiDownload, FiCalendar } from 'react-icons/fi'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import PageHeader from '../../components/PageHeader'
import TableComponent from '../../components/TableComponent'
import { salesData, monthlySalesReport } from '../../data/sales'
import { products } from '../../data/products'
import { formatCurrency } from '../../utils/productIdGenerator'

export default function ReportsPage({ title, reportType = 'sales' }) {
  const [dateFrom, setDateFrom] = useState('2026-05-01')
  const [dateTo, setDateTo] = useState('2026-05-20')

  const stockReportData = products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    metal: p.metalType,
    qty: p.quantity,
    value: p.sellingPrice * p.quantity,
    status: p.status,
  }))

  const columns = reportType === 'stock'
    ? [
        { key: 'name', label: 'Product' },
        { key: 'category', label: 'Category' },
        { key: 'metal', label: 'Metal' },
        { key: 'qty', label: 'Qty' },
        { key: 'value', label: 'Value', type: 'currency' },
        { key: 'status', label: 'Status', type: 'status' },
      ]
    : [
        { key: 'date', label: 'Date' },
        { key: 'sales', label: 'Sales', type: 'currency' },
        { key: 'purchases', label: 'Purchases', type: 'currency' },
      ]

  const tableData = reportType === 'stock' ? stockReportData : salesData

  return (
    <div className="page-container">
      <PageHeader
        title={title}
        subtitle="Analytics, charts and exportable reports"
        actions={
          <button type="button" className="btn-outline" onClick={() => alert('Export report (API pending)')}>
            <FiDownload /> Export
          </button>
        }
      />

      <div className="card p-4 mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="label-field flex items-center gap-1"><FiCalendar /> From</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="label-field">To</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="input-field" />
        </div>
        <button type="button" className="btn-primary">Apply Filter</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card p-5">
          <h3 className="font-semibold text-primary-900 mb-4">
            {reportType === 'stock' ? 'Stock Value by Category' : 'Sales Trend'}
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            {reportType === 'stock' ? (
              <BarChart data={stockReportData.slice(0, 6)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Bar dataKey="value" fill="#d4af37" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={monthlySalesReport}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={2} name="Sales" />
                <Line type="monotone" dataKey="profit" stroke="#d4af37" strokeWidth={2} name="Profit" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold text-primary-900 mb-4">Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-primary-50 rounded-xl">
              <p className="text-xs text-slate-500">Total Sales</p>
              <p className="text-xl font-bold text-primary-900">{formatCurrency(1850000)}</p>
            </div>
            <div className="p-4 bg-gold-50 rounded-xl">
              <p className="text-xs text-slate-500">Total Profit</p>
              <p className="text-xl font-bold text-gold-600">{formatCurrency(185000)}</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl">
              <p className="text-xs text-slate-500">GST Collected</p>
              <p className="text-xl font-bold text-emerald-700">{formatCurrency(55500)}</p>
            </div>
            <div className="p-4 bg-violet-50 rounded-xl">
              <p className="text-xs text-slate-500">Transactions</p>
              <p className="text-xl font-bold text-violet-700">248</p>
            </div>
          </div>
        </div>
      </div>

      <TableComponent columns={columns} data={tableData} onExport={() => alert('Exported!')} />
    </div>
  )
}
