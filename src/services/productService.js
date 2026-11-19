import api, { endpoints } from './api'

/** Maps the WordPress response to the product shape the UI components already use. */
export function normalizeProduct(raw) {
  return {
    id: String(raw.id),
    uniqueId: raw.uniqueId || '',
    name: raw.name || '',
    category: raw.category || '',
    subCategory: raw.subCategory || '',
    metalType: raw.metalType || '',
    carat: raw.carat || '',
    netWeight: Number(raw.netWeight) || 0,
    quantity: raw.quantity ?? 1,
    status: raw.status || 'In Stock',
    image: raw.image || '',
    _createdAt: raw.createdAt || null,
    _updatedAt: raw.updatedAt || null,
    _deletedAt: raw.deletedAt || null,
  }
}

/** All of the logged-in user's products, including deleted ones. */
export async function fetchProductsRequest() {
  const { data } = await api.get(endpoints.products)
  return Array.isArray(data) ? data.map(normalizeProduct) : []
}

export async function createProductRequest(payload) {
  const { data } = await api.post(endpoints.products, payload)
  return normalizeProduct(data)
}

export async function updateProductRequest(id, payload) {
  const { data } = await api.put(`${endpoints.products}/${encodeURIComponent(id)}`, payload)
  return normalizeProduct(data)
}

/** Moves the product to Deleted Items. */
export async function deleteProductRequest(id) {
  const { data } = await api.delete(`${endpoints.products}/${encodeURIComponent(id)}`)
  return normalizeProduct(data)
}
