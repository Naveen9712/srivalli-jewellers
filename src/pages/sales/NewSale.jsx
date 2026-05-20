import { useState, useMemo } from 'react'
import { FiTrash2, FiPrinter } from 'react-icons/fi'
import PageHeader from '../../components/PageHeader'
import SearchBar from '../../components/SearchBar'
import ProductCard from '../../components/ProductCard'
import { products } from '../../data/products'
import { formatCurrency } from '../../utils/productIdGenerator'
import { useDebounce } from '../../hooks/useDebounce'

export default function NewSale() {
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])
  const [discount, setDiscount] = useState(0)
  const [customer, setCustomer] = useState('')
  const debouncedSearch = useDebounce(search)

  const filteredProducts = useMemo(() => {
    if (!debouncedSearch) return products.slice(0, 6)
    const q = debouncedSearch.toLowerCase()
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.uniqueId.toLowerCase().includes(q),
    )
  }, [debouncedSearch])

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const updateQty = (id, qty) => {
    if (qty < 1) return setCart((prev) => prev.filter((i) => i.id !== id))
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
  }

  const subtotal = cart.reduce((s, i) => s + i.sellingPrice * i.qty, 0)
  const discountAmt = (subtotal * discount) / 100
  const afterDiscount = subtotal - discountAmt
  const gst = afterDiscount * 0.03
  const total = afterDiscount + gst

  return (
    <div className="page-container">
      <PageHeader title="New Sale" subtitle="POS Billing Interface" breadcrumbs={[{ label: 'Sales' }, { label: 'New Sale' }]} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <div className="card p-4">
            <SearchBar value={search} onChange={setSearch} placeholder="Search product by name or ID..." className="w-full" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={addToCart} />
              ))}
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="px-4 py-3 bg-primary-900 text-white font-semibold">Bill Items</div>
            <div className="table-wrapper border-0">
              <table className="data-table">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th>Product</th>
                    <th>Carat</th>
                    <th>Weight</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-8 text-slate-400">No items in cart</td></tr>
                  ) : (
                    cart.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-gold-600 font-mono">{item.uniqueId}</p>
                        </td>
                        <td>{item.carat}</td>
                        <td>{item.netWeight}g</td>
                        <td>{formatCurrency(item.sellingPrice)}</td>
                        <td>
                          <input
                            type="number"
                            min={1}
                            value={item.qty}
                            onChange={(e) => updateQty(item.id, +e.target.value)}
                            className="input-field w-16 py-1 text-center"
                          />
                        </td>
                        <td className="font-semibold">{formatCurrency(item.sellingPrice * item.qty)}</td>
                        <td>
                          <button type="button" onClick={() => updateQty(item.id, 0)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card p-4 sm:p-5 h-fit xl:sticky xl:top-20">
          <h3 className="font-bold text-primary-900 text-lg border-b pb-3 mb-4">Billing Summary</h3>
          <input
            type="text"
            placeholder="Customer name / phone"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="input-field mb-4"
          />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Discount %</span>
              <input type="number" min={0} max={100} value={discount} onChange={(e) => setDiscount(+e.target.value)} className="input-field w-20 py-1 text-right" />
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>-{formatCurrency(discountAmt)}</span>
              </div>
            )}
            <div className="flex justify-between"><span className="text-slate-500">GST (3%)</span><span>{formatCurrency(gst)}</span></div>
            <div className="flex justify-between text-lg font-bold text-primary-900 pt-3 border-t">
              <span>Total</span>
              <span className="text-gold-600">{formatCurrency(total)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-6">
            <button type="button" className="btn-outline justify-center" onClick={() => setCart([])}>Clear</button>
            <button type="button" className="btn-gold justify-center" onClick={() => alert(`Bill generated! Total: ${formatCurrency(total)}`)}>
              <FiPrinter /> Print Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
