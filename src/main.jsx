import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App'
import { store } from './redux/store'
import './index.css'

const muiTheme = createTheme({
  palette: {
    primary: { main: '#1e3a5f', light: '#2563eb', dark: '#0f2744' },
    secondary: { main: '#d4af37' },
  },
  typography: { fontFamily: '"Inter", sans-serif' },
  shape: { borderRadius: 10 },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={muiTheme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
