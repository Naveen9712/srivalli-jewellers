const STORAGE_KEY = 'srivalli:stocks:temp'

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

