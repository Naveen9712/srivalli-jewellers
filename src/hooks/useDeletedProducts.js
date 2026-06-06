import { useCallback, useEffect, useState } from 'react'
import { loadDeletedProducts } from '../utils/localProducts'

export function useDeletedProducts() {
  const [items, setItems] = useState([])

  const refresh = useCallback(() => {
    setItems(loadDeletedProducts())
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { items, refresh }
}
