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

export function generateProductId(category, carat, sequence = 1) {
  const prefix = category ? PREFIX_MAP[category] || 'PRD' : 'PRD'
  const metal = carat?.includes('Silver') ? 'SLV' : 'GLD'
  const caratCode = carat?.replace(/\s/g, '').toUpperCase() || '22K'
  const seq = String(sequence).padStart(4, '0')
  return `${metal}-${prefix}-${caratCode}-${seq}`
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
