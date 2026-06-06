import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Dashboard from '../pages/Dashboard'
import CategoryItems from '../pages/CategoryItems'
import SearchResults from '../pages/SearchResults'
import AddProduct from '../pages/stock/AddProduct'
import StockList from '../pages/stock/StockList'
import ProductDetails from '../pages/ProductDetails'
import DeletedItems from '../pages/DeletedItems'
import Settings from '../pages/settings/Settings'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="category/:category" element={<CategoryItems />} />
        <Route path="search" element={<SearchResults />} />

        {/* Stocks */}
        <Route path="stocks" element={<StockList title="Stocks" addPath="/stocks/add" />} />
        <Route path="stocks/add" element={<AddProduct title="Add Item" />} />
        <Route path="stocks/edit/:id" element={<AddProduct />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="deleted-items" element={<DeletedItems />} />

        {/* Settings */}
        <Route path="settings" element={<Settings />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
