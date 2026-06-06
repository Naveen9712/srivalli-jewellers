import { CATEGORIES } from './constants'

const CATEGORY_IMAGES = {
  Ring: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=480&h=320&fit=crop',
  Necklace: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=480&h=320&fit=crop',
  Bangle: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=480&h=320&fit=crop',
  Chain: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=480&h=320&fit=crop',
  Earring: 'https://images.unsplash.com/photo-1708220040828-9ab1673681d3?w=480&h=320&fit=crop',
  Pendant: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=480&h=320&fit=crop',
  Bracelet: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=480&h=320&fit=crop',
  Anklet: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=480&h=320&fit=crop',
  Coin: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=480&h=320&fit=crop',
  Other: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=480&h=320&fit=crop&q=80',
}

/** Previously used Unsplash IDs that now return 404 */
const DEPRECATED_IMAGE_IDS = [
  'photo-1535632066927-ab7c9ab60909',
  'photo-1617038220319-276d3aaab638',
  'photo-1610379862527-447a662f1e65',
]

const DEFAULT_IMAGE = CATEGORY_IMAGES.Ring

export function getCategoryImage(category) {
  return CATEGORY_IMAGES[category] || DEFAULT_IMAGE
}

export function getProductImage(product) {
  const image = product?.image
  const isDeprecated = DEPRECATED_IMAGE_IDS.some((id) => image?.includes(id))
  const isDefaultRingThumb = image?.includes('photo-1605100804763-247f67b3557e?w=100')

  if (image && !isDefaultRingThumb && !isDeprecated) {
    return image
  }
  return getCategoryImage(product?.category)
}

export { CATEGORY_IMAGES, CATEGORIES }
