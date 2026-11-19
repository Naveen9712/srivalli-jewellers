/** Search a list of products by unique number, name, category, sub category or metal. */
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
