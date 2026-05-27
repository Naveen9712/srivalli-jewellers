import { motion } from 'framer-motion'
import {
  MdInventory, MdPointOfSale, MdShoppingCart, MdReceiptLong, MdPeople, MdWarning,
} from 'react-icons/md'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import DashboardCard from '../components/DashboardCard'
import RateCard from '../components/RateCard'
import PageHeader from '../components/PageHeader'
import { formatCurrency } from '../utils/productIdGenerator'
import { getAllProducts } from '../utils/localProducts'
import { salesData, recentTransactions } from '../data/sales'
import { orders } from '../data/orders'
import { customers } from '../data/customers'
import { currentRates } from '../data/rates'

export default function Dashboard() {
  const products = getAllProducts()
  const goldStock = products.filter((p) => p.metalType === 'Gold').reduce((s, p) => s + p.netWeight * p.quantity, 0)
  const silverStock = products.filter((p) => p.metalType === 'Silver').reduce((s, p) => s + p.netWeight * p.quantity, 0)
  const todaySales = salesData[salesData.length - 1]?.sales || 0
  const todayPurchase = salesData[salesData.length - 1]?.purchases || 0
  const lowStock = products.filter((p) => p.status === 'Low Stock' || p.quantity <= 2)

  return (
    <div className="page-container">
      <PageHeader
        title="Dashboard"
        subtitle={
          <>
            <span className="hidden sm:inline">Welcome to Srivalli jewellers Management — </span>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <DashboardCard title="Total Gold Stock" value={`${goldStock.toFixed(1)} g`} icon={MdInventory} color="gold" trend={5.2} />
        <DashboardCard title="Total Silver Stock" value={`${silverStock.toFixed(1)} g`} icon={MdInventory} color="blue" trend={2.1} />
        <DashboardCard title="Today's Sales" value={formatCurrency(todaySales)} icon={MdPointOfSale} color="green" trend={12.5} />
        <DashboardCard title="Today's Purchase" value={formatCurrency(todayPurchase)} icon={MdShoppingCart} color="purple" trend={-3.2} />
        <DashboardCard title="Pending Orders" value={orders.filter((o) => o.status !== 'Ready').length} icon={MdReceiptLong} color="orange" />
        <DashboardCard title="Total Customers" value={customers.length} icon={MdPeople} color="blue" trend={8} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <RateCard label="18K Gold" rate={currentRates.gold18k} trend={15} />
        <RateCard label="22K Gold" rate={currentRates.gold22k} trend={20} />
        <RateCard label="24K Gold" rate={currentRates.gold24k} trend={18} />
        <RateCard label="Silver 925" rate={currentRates.silver925} trend={0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-4 sm:p-5 min-w-0">
          <h3 className="font-semibold text-primary-900 mb-4 text-sm sm:text-base">Sales Overview (Last 7 Days)</h3>
          <div className="w-full h-[220px] sm:h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4af37" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tickFormatter={(d) => d.slice(8)} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Area type="monotone" dataKey="sales" stroke="#d4af37" fill="url(#salesGrad)" strokeWidth={2} name="Sales" />
              <Area type="monotone" dataKey="purchases" stroke="#2563eb" fill="transparent" strokeWidth={2} strokeDasharray="5 5" name="Purchases" />
            </AreaChart>
          </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <MdWarning className="text-amber-500 text-xl" />
            <h3 className="font-semibold text-primary-900">Low Stock Alerts</h3>
          </div>
          <div className="space-y-3">
            {lowStock.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.uniqueId} · Qty: {item.quantity}</p>
                </div>
                <span className="badge-warning">Low</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mt-6 overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-primary-900">Recent Transactions</h3>
        </div>

        <div className="md:hidden divide-y divide-slate-100">
          {recentTransactions.map((txn) => (
            <div key={txn.id} className="mobile-data-card">
              <div className="flex justify-between items-start gap-2 mb-2">
                <span className="font-mono text-xs text-gold-600">{txn.id}</span>
                <span className={txn.status === 'Pending' ? 'badge-warning' : 'badge-success'}>{txn.status}</span>
              </div>
              <p className="font-medium text-sm">{txn.customer}</p>
              <p className="text-xs text-slate-500 mt-0.5">{txn.item}</p>
              <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-100">
                <span className="badge-info">{txn.type}</span>
                <span className="font-semibold text-primary-900">{formatCurrency(txn.amount)}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{txn.time}</p>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto table-wrapper border-0">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Customer</th>
                <th>Item</th>
                <th>Amount</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((txn) => (
                <tr key={txn.id}>
                  <td className="font-mono text-xs text-gold-600">{txn.id}</td>
                  <td><span className="badge-info">{txn.type}</span></td>
                  <td>{txn.customer}</td>
                  <td>{txn.item}</td>
                  <td className="font-semibold">{formatCurrency(txn.amount)}</td>
                  <td className="text-slate-500">{txn.time}</td>
                  <td><span className={txn.status === 'Pending' ? 'badge-warning' : 'badge-success'}>{txn.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
