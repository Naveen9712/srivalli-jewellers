import { CATEGORIES } from './constants'

const CATEGORY_IMAGES = {
  Ring: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=480&h=320&fit=crop',
  Necklace: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=480&h=320&fit=crop',
  Bangle: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=480&h=320&fit=crop',
  Chain: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=480&h=320&fit=crop',
  Earring: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60909?w=480&h=320&fit=crop',
  Pendant: 'https://images.unsplash.com/photo-1617038220319-276d3aaab638?w=480&h=320&fit=crop',
  Bracelet: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=480&h=320&fit=crop',
  Anklet: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=480&h=320&fit=crop',
  Coin: 'https://images.unsplash.com/photo-1610379862527-447a662f1e65?w=480&h=320&fit=crop',
  Other: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=480&h=320&fit=crop&q=80',
}

const DEFAULT_IMAGE = CATEGORY_IMAGES.Ring

export function getCategoryImage(category) {
  return CATEGORY_IMAGES[category] || DEFAULT_IMAGE
}

export function getProductImage(product) {
  if (product?.image && !product.image.includes('photo-1605100804763-247f67b3557e?w=100')) {
    return product.image
  }
  return getCategoryImage(product?.category)
}

export { CATEGORY_IMAGES, CATEGORIES }
