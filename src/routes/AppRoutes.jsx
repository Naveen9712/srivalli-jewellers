import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Dashboard from '../pages/Dashboard'
import AddProduct from '../pages/stock/AddProduct'
import StockList from '../pages/stock/StockList'
import Settings from '../pages/settings/Settings'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Dashboard />} />

        {/* Stocks */}
        <Route path="stocks" element={<StockList title="Stocks" addPath="/stocks/add" />} />
        <Route path="stocks/add" element={<AddProduct title="Add Item" />} />

        {/* Settings */}
        <Route path="settings" element={<Settings />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
