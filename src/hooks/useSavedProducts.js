import { useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { deleteProduct } from '../redux/slices/productsSlice'
import { useProducts } from './useProducts'

/** The signed-in user's active (not deleted) products. */
export function useSavedProducts() {
  const dispatch = useDispatch()
  const { allItems, loading, error, refresh } = useProducts()

  const items = useMemo(() => allItems.filter((item) => !item._deletedAt), [allItems])

  const removeItem = useCallback(
    async (id) => {
      try {
        await dispatch(deleteProduct(id)).unwrap()
        return true
      } catch (err) {
        alert(err?.message || 'Could not delete the item. Please try again.')
        return false
      }
    },
    [dispatch],
  )

  return { items, refresh, removeItem, loading, error }
}
