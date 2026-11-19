import { useMemo } from 'react'
import { useProducts } from './useProducts'

/** The signed-in user's deleted products, most recently deleted first. */
export function useDeletedProducts() {
  const { allItems, loading, error, refresh } = useProducts()

  const items = useMemo(
    () => allItems
      .filter((item) => item._deletedAt)
      .sort((a, b) => new Date(b._deletedAt) - new Date(a._deletedAt)),
    [allItems],
  )

  return { items, refresh, loading, error }
}
