import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loadStoredAuth, toApiError } from '../../services/api'
import { fetchCurrentUser, loginRequest, logoutRequest, registerRequest } from '../../services/authService'

const stored = loadStoredAuth()

const initialState = {
  token: stored?.token || null,
  user: stored?.user || null,
  status: 'idle', // idle | loading
  error: null,
  notice: null,
  signedOutByUser: false, // true after "Log out" → next sign-in starts on the dashboard
}

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    return await loginRequest(credentials)
  } catch (error) {
    return rejectWithValue(toApiError(error, 'Could not sign in.'))
  }
})

export const register = createAsyncThunk('auth/register', async (details, { rejectWithValue }) => {
  try {
    return await registerRequest(details)
  } catch (error) {
    return rejectWithValue(toApiError(error, 'Could not create the account.'))
  }
})

/** Re-checks the saved token on app start and refreshes the user's details. */
export const refreshUser = createAsyncThunk('auth/refreshUser', async (_, { rejectWithValue }) => {
  try {
    return await fetchCurrentUser()
  } catch (error) {
    return rejectWithValue(toApiError(error))
  }
})

/** Signs out locally right away, then tells WordPress to forget the token. */
export const logout = () => async (dispatch, getState) => {
  const { token } = getState().auth
  dispatch(loggedOut())
  try {
    await logoutRequest(token)
  } catch {
    // Signing out locally is enough even if the server can't be reached.
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionExpired: (state) => {
      state.token = null
      state.user = null
      state.status = 'idle'
      state.signedOutByUser = false
      state.notice = 'Your session has expired. Please sign in again.'
    },
    loggedOut: (state) => {
      state.token = null
      state.user = null
      state.status = 'idle'
      state.error = null
      state.notice = null
      state.signedOutByUser = true
    },
    clearAuthMessages: (state) => {
      state.error = null
      state.notice = null
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.status = 'loading'
      state.error = null
      state.notice = null
    }
    const signedIn = (state, action) => {
      state.status = 'idle'
      state.signedOutByUser = false
      state.token = action.payload.token
      state.user = action.payload.user
    }
    const failed = (state, action) => {
      state.status = 'idle'
      state.error = action.payload?.message || 'Something went wrong.'
    }

    builder
      .addCase(login.pending, pending)
      .addCase(login.fulfilled, signedIn)
      .addCase(login.rejected, failed)
      .addCase(register.pending, pending)
      .addCase(register.fulfilled, signedIn)
      .addCase(register.rejected, failed)
      .addCase(refreshUser.fulfilled, (state, action) => {
        if (state.token) state.user = action.payload
      })
  },
})

export const { sessionExpired, loggedOut, clearAuthMessages } = authSlice.actions
export default authSlice.reducer
