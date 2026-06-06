const STORAGE_KEY = 'srivalli:stocks:temp'
const DELETED_STORAGE_KEY = 'srivalli:stocks:deleted'

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export function loadTempProducts() {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(STORAGE_KEY)
  const parsed = raw ? safeJsonParse(raw, []) : []
  return Array.isArray(parsed) ? parsed : []
}

export function saveTempProducts(list) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function getAllProducts() {
  return loadTempProducts()
}

export function addTempProduct(product) {
  const current = loadTempProducts()
  const next = [...current, product]
  saveTempProducts(next)
  return next
}

export function updateProduct(id, updates) {
  const active = loadTempProducts()
  const index = active.findIndex((product) => product.id === id)
  if (index === -1) return null

  const updated = {
    ...active[index],
    ...updates,
    id,
    _updatedAt: new Date().toISOString(),
  }
  const next = [...active]
  next[index] = updated
  saveTempProducts(next)
  return updated
}

export function loadDeletedProducts() {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(DELETED_STORAGE_KEY)
  const parsed = raw ? safeJsonParse(raw, []) : []
  return Array.isArray(parsed) ? parsed : []
}

export function saveDeletedProducts(list) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(list))
}

export function deleteProduct(id) {
  const active = loadTempProducts()
  const item = active.find((product) => product.id === id)
  if (!item) return active

  saveTempProducts(active.filter((product) => product.id !== id))

  const deleted = loadDeletedProducts()
  saveDeletedProducts([
    { ...item, _deletedAt: new Date().toISOString() },
    ...deleted,
  ])

  return loadTempProducts()
}

export function getProductById(id) {
  if (!id) return null

  const active = loadTempProducts().find((product) => product.id === id)
  if (active) return { product: active, isDeleted: false }

  const deleted = loadDeletedProducts().find((product) => product.id === id)
  if (deleted) return { product: deleted, isDeleted: true }

  return null
}

export function searchProducts(query) {
  return searchInProducts(loadTempProducts(), query)
}

export function searchInProducts(items, query) {
  const q = query.trim().toLowerCase()
  if (!q) return []

  return items
    .filter((item) => {
      const uniqueId = (item.uniqueId || '').toLowerCase()
      const name = (item.name || '').toLowerCase()
      const category = (item.category || '').toLowerCase()
      const subCategory = (item.subCategory || '').toLowerCase()
      const metalType = (item.metalType || '').toLowerCase()

      return (
        uniqueId.includes(q) ||
        name.includes(q) ||
        category.includes(q) ||
        subCategory.includes(q) ||
        metalType.includes(q)
      )
    })
    .sort((a, b) => {
      const aId = (a.uniqueId || '').toLowerCase()
      const bId = (b.uniqueId || '').toLowerCase()

      if (aId === q && bId !== q) return -1
      if (bId === q && aId !== q) return 1
      if (aId.startsWith(q) && !bId.startsWith(q)) return -1
      if (bId.startsWith(q) && !aId.startsWith(q)) return 1
      return 0
    })
}

