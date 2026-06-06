import { useCallback, useEffect, useState } from 'react'
import { deleteProduct, loadTempProducts } from '../utils/localProducts'

export function useSavedProducts() {
  const [items, setItems] = useState([])

  const refresh = useCallback(() => {
    setItems(loadTempProducts())
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const removeItem = useCallback(
    (id) => {
      deleteProduct(id)
      refresh()
    },
    [refresh],
  )

  return { items, refresh, removeItem }
}
