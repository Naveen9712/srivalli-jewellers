import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Dashboard from '../pages/Dashboard'
import AddProduct from '../pages/stock/AddProduct'
import StockList from '../pages/stock/StockList'
import NewSale from '../pages/sales/NewSale'
import Customers from '../pages/customers/Customers'
import Settings from '../pages/settings/Settings'
import ReportsPage from '../pages/reports/ReportsPage'
import OrdersPage from '../pages/orders/OrdersPage'
import GenericPage from '../pages/GenericPage'

const Generic = ({ title, subtitle }) => (
  <GenericPage title={title} subtitle={subtitle} />
)

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Dashboard />} />

        {/* Purchase */}
        <Route path="purchase/new" element={<Generic title="New Purchase" />} />
        <Route path="purchase/payment" element={<Generic title="Purchase Payment" />} />
        <Route path="purchase/report" element={<ReportsPage title="Purchase Report" reportType="sales" />} />
        <Route path="purchase/dealers" element={<Generic title="Dealer Management" />} />

        {/* Stock */}
        <Route path="stock/add-gold" element={<AddProduct metalTypeDefault="Gold" title="Add Gold Item" />} />
        <Route path="stock/add-silver" element={<AddProduct metalTypeDefault="Silver" title="Add Silver Item" />} />
        <Route path="stock/gold-list" element={<StockList metalFilter="Gold" title="Gold Stock List" addPath="/stock/add-gold" />} />
        <Route path="stock/silver-list" element={<StockList metalFilter="Silver" title="Silver Stock List" addPath="/stock/add-silver" />} />
        <Route path="stock/overall" element={<StockList title="Overall Stock" addPath="/stock/add-gold" />} />
        <Route path="stock/ledger" element={<Generic title="Stock Ledger" />} />
        <Route path="stock/low-stock" element={<StockList title="Low Stock Alert" addPath="/stock/add-gold" lowStockOnly />} />

        {/* Sales */}
        <Route path="sales/new" element={<NewSale />} />
        <Route path="sales/invoice" element={<Generic title="Sales Invoice" />} />
        <Route path="sales/report" element={<ReportsPage title="Sales Report" />} />
        <Route path="sales/return" element={<Generic title="Return / Exchange" />} />

        {/* Old Gold */}
        <Route path="old-gold/entry" element={<Generic title="Old Gold Entry" />} />
        <Route path="old-gold/out" element={<Generic title="Old Gold Out" />} />
        <Route path="old-gold/report" element={<ReportsPage title="Old Gold Report" />} />

        {/* Payment */}
        <Route path="payment/gold" element={<Generic title="Gold Payment" />} />
        <Route path="payment/silver" element={<Generic title="Silver Payment" />} />
        <Route path="payment/order" element={<Generic title="Order Payment" />} />
        <Route path="payment/due" element={<Generic title="Due Payments" />} />

        {/* Reports */}
        <Route path="reports/daily-sales" element={<ReportsPage title="Daily Sales Report" />} />
        <Route path="reports/monthly-sales" element={<ReportsPage title="Monthly Sales Report" />} />
        <Route path="reports/profit" element={<ReportsPage title="Profit Report" />} />
        <Route path="reports/stock" element={<ReportsPage title="Stock Report" reportType="stock" />} />
        <Route path="reports/gst" element={<ReportsPage title="GST Report" />} />

        {/* Orders */}
        <Route path="orders/new" element={<OrdersPage title="New Order" />} />
        <Route path="orders/pre-order" element={<OrdersPage title="Pre Order" />} />
        <Route path="orders/report" element={<OrdersPage title="Order Report" />} />

        {/* Customers & Settings */}
        <Route path="customers" element={<Customers />} />
        <Route path="settings" element={<Settings />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
