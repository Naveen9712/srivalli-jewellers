import { createSlice } from '@reduxjs/toolkit'
import { currentRates } from '../../data/rates'

const initialState = {
  sidebarOpen: false,
  rates: currentRates,
  shopSettings: {
    shopName: 'Srivalli jewellers',
    gstNumber: '37AABCS1234F1Z5',
    address: 'Main Road, Vijayawada, Andhra Pradesh',
    phone: '+91 98765 43210',
  },
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    updateRates: (state, action) => {
      state.rates = { ...state.rates, ...action.payload }
    },
    updateShopSettings: (state, action) => {
      state.shopSettings = { ...state.shopSettings, ...action.payload }
    },
  },
})

export const { toggleSidebar, setSidebarOpen, updateRates, updateShopSettings } = appSlice.actions
export default appSlice.reducer
