export const APP_NAME = 'Srivalli jewellers Management System'
export const SHOP_NAME = 'Srivalli jewellers'

export const CARAT_OPTIONS = {
  gold: ['18K', '22K', '24K'],
  silver: ['Silver 925'],
  all: ['18K', '22K', '24K', 'Silver 925'],
}

export const CATEGORIES = [
  'Ring', 'Necklace', 'Bangle', 'Chain', 'Earring', 'Pendant', 'Bracelet', 'Anklet', 'Coin', 'Other',
]

export const SUB_CATEGORIES = {
  Ring: ['Wedding Ring', 'Engagement Ring', 'Casual Ring'],
  Necklace: ['Short Necklace', 'Long Necklace', 'Choker'],
  Bangle: ['Plain Bangle', 'Stone Bangle', 'Kada'],
  Chain: ['Gold Chain', 'Mangalsutra Chain'],
  Earring: ['Stud', 'Jhumka', 'Drop'],
  Pendant: ['Religious', 'Designer'],
  Bracelet: ['Kids', 'Adult'],
  Anklet: ['Plain', 'Designer'],
  Coin: ['Gold Coin', 'Silver Coin'],
  Other: ['Miscellaneous'],
}

export const METAL_TYPES = ['Gold', 'Silver']

export const NAV_MENUS = [
  { label: 'Dashboard', path: '/', icon: 'MdDashboard' },
  {
    label: 'Purchase',
    icon: 'MdShoppingCart',
    children: [
      { label: 'New Purchase', path: '/purchase/new' },
      { label: 'Purchase Payment', path: '/purchase/payment' },
      { label: 'Purchase Report', path: '/purchase/report' },
      { label: 'Dealer Management', path: '/purchase/dealers' },
    ],
  },
  {
    label: 'Stock',
    icon: 'MdInventory',
    children: [
      { label: 'Add Gold Item', path: '/stock/add-gold' },
      { label: 'Add Silver Item', path: '/stock/add-silver' },
      { label: 'Gold Stock List', path: '/stock/gold-list' },
      { label: 'Silver Stock List', path: '/stock/silver-list' },
      { label: 'Overall Stock', path: '/stock/overall' },
      { label: 'Stock Ledger', path: '/stock/ledger' },
      { label: 'Low Stock Alert', path: '/stock/low-stock' },
    ],
  },
  {
    label: 'Sales',
    icon: 'MdPointOfSale',
    children: [
      { label: 'New Sale', path: '/sales/new' },
      { label: 'Sales Invoice', path: '/sales/invoice' },
      { label: 'Sales Report', path: '/sales/report' },
      { label: 'Return/Exchange', path: '/sales/return' },
    ],
  },
  {
    label: 'Old Gold',
    icon: 'MdRecycling',
    children: [
      { label: 'Old Gold Entry', path: '/old-gold/entry' },
      { label: 'Old Gold Out', path: '/old-gold/out' },
      { label: 'Old Gold Report', path: '/old-gold/report' },
    ],
  },
  {
    label: 'Payment',
    icon: 'MdPayments',
    children: [
      { label: 'Gold Payment', path: '/payment/gold' },
      { label: 'Silver Payment', path: '/payment/silver' },
      { label: 'Order Payment', path: '/payment/order' },
      { label: 'Due Payments', path: '/payment/due' },
    ],
  },
  {
    label: 'Reports',
    icon: 'MdAssessment',
    children: [
      { label: 'Daily Sales', path: '/reports/daily-sales' },
      { label: 'Monthly Sales', path: '/reports/monthly-sales' },
      { label: 'Profit Report', path: '/reports/profit' },
      { label: 'Stock Report', path: '/reports/stock' },
      { label: 'GST Report', path: '/reports/gst' },
    ],
  },
  {
    label: 'Orders',
    icon: 'MdReceiptLong',
    children: [
      { label: 'New Order', path: '/orders/new' },
      { label: 'Pre Order', path: '/orders/pre-order' },
      { label: 'Order Report', path: '/orders/report' },
    ],
  },
  { label: 'Customers', path: '/customers', icon: 'MdPeople' },
  { label: 'Settings', path: '/settings', icon: 'MdSettings' },
]

export const SIDEBAR_LINKS = [
  { label: 'Dashboard', path: '/', icon: 'MdDashboard' },
  { label: 'New Sale', path: '/sales/new', icon: 'MdPointOfSale' },
  { label: 'Add Product', path: '/stock/add-gold', icon: 'MdAddBox' },
  { label: 'Stock List', path: '/stock/gold-list', icon: 'MdInventory' },
  { label: 'Customers', path: '/customers', icon: 'MdPeople' },
  { label: 'Reports', path: '/reports/daily-sales', icon: 'MdAssessment' },
  { label: 'Settings', path: '/settings', icon: 'MdSettings' },
]
