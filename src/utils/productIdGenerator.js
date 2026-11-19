const PREFIX_MAP = {
  Ring: 'RNG',
  Necklace: 'NCK',
  Bangle: 'BNG',
  Chain: 'CHN',
  Earring: 'ERG',
  Pendant: 'PND',
  Bracelet: 'BRC',
  Anklet: 'ANK',
  Coin: 'CON',
  Other: 'OTH',
}

/** e.g. Ring + 22K → "GLD-RNG-22K" */
export function getProductIdPrefix(category, carat) {
  const prefix = category ? PREFIX_MAP[category] || 'PRD' : 'PRD'
  const metal = carat?.includes('Silver') ? 'SLV' : 'GLD'
  const caratCode = carat?.replace(/\s/g, '').toUpperCase() || '22K'
  return `${metal}-${prefix}-${caratCode}`
}

export function generateProductId(category, carat, sequence = 1) {
  const seq = String(sequence).padStart(4, '0')
  return `${getProductIdPrefix(category, carat)}-${seq}`
}

/**
 * Next free ID for this category + carat, based on the user's existing items
 * (including deleted ones), e.g. GLD-RNG-22K-0003 if 0001 and 0002 exist.
 */
export function generateNextProductId(category, carat, items = []) {
  const prefix = `${getProductIdPrefix(category, carat)}-`
  const highest = items.reduce((max, item) => {
    const id = (item.uniqueId || '').toUpperCase()
    if (!id.startsWith(prefix)) return max
    const seq = Number(id.slice(prefix.length))
    return Number.isInteger(seq) && seq > max ? seq : max
  }, 0)
  return generateProductId(category, carat, highest + 1)
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

export function formatWeight(weight) {
  return `${Number(weight || 0).toFixed(3)} g`
}
