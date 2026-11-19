import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../redux/slices/productsSlice'

/**
 * The signed-in user's products from WordPress (active + deleted).
 * Loads them once; every page shares the same list from Redux.
 */
export function useProducts() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state) => state.products)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts())
  }, [status, dispatch])

  const refresh = useCallback(() => dispatch(fetchProducts()), [dispatch])

  return {
    allItems: items,
    loading: status === 'idle' || status === 'loading',
    error: status === 'failed' ? error : null,
    refresh,
  }
}

/** A single product by id. */
export function useProduct(id) {
  const { allItems, loading, error, refresh } = useProducts()

  const product = useMemo(
    () => allItems.find((item) => item.id === String(id)) || null,
    [allItems, id],
  )

  return {
    product,
    isDeleted: Boolean(product?._deletedAt),
    loading: loading && !product,
    error,
    refresh,
  }
}
