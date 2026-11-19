import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toApiError } from '../../services/api'
import {
  createProductRequest,
  deleteProductRequest,
  fetchProductsRequest,
  updateProductRequest,
} from '../../services/productService'
import { loggedOut, login, register, sessionExpired } from './authSlice'

/**
 * Holds the logged-in user's products (active + deleted) loaded from WordPress.
 * The list is cleared whenever the user signs in, signs out or the session expires,
 * so one user's items are never shown to another user on the same browser.
 */
const initialState = {
  items: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
}

export const fetchProducts = createAsyncThunk(
  'products/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProductsRequest()
    } catch (error) {
      return rejectWithValue(toApiError(error, 'Could not load your items.'))
    }
  },
  {
    condition: (_, { getState }) => getState().products.status !== 'loading' && Boolean(getState().auth.token),
  },
)

export const createProduct = createAsyncThunk('products/create', async (payload, { rejectWithValue }) => {
  try {
    return await createProductRequest(payload)
  } catch (error) {
    return rejectWithValue(toApiError(error, 'Could not save the item.'))
  }
})

export const updateProduct = createAsyncThunk('products/update', async ({ id, changes }, { rejectWithValue }) => {
  try {
    return await updateProductRequest(id, changes)
  } catch (error) {
    return rejectWithValue(toApiError(error, 'Could not update the item.'))
  }
})

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    return await deleteProductRequest(id)
  } catch (error) {
    return rejectWithValue(toApiError(error, 'Could not delete the item.'))
  }
})

function upsert(items, product) {
  const index = items.findIndex((item) => item.id === product.id)
  if (index === -1) items.push(product)
  else items[index] = product
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload?.message || 'Could not load your items.'
      })
      .addCase(createProduct.fulfilled, (state, action) => upsert(state.items, action.payload))
      .addCase(updateProduct.fulfilled, (state, action) => upsert(state.items, action.payload))
      .addCase(deleteProduct.fulfilled, (state, action) => upsert(state.items, action.payload))
      // Never keep one account's data around after the account changes.
      .addCase(login.fulfilled, () => initialState)
      .addCase(register.fulfilled, () => initialState)
      .addCase(loggedOut, () => initialState)
      .addCase(sessionExpired, () => initialState)
  },
})

export default productsSlice.reducer
