import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLogIn, FiUserPlus } from 'react-icons/fi'
import FormInput from '../../components/FormInput'
import { clearAuthMessages, login, register } from '../../redux/slices/authSlice'
import { isApiConfigured } from '../../services/api'
import { SHOP_NAME } from '../../utils/constants'

export default function Login() {
  const dispatch = useDispatch()
  const location = useLocation()
  const { token, status, error, notice } = useSelector((state) => state.auth)
  const [mode, setMode] = useState('login') // login | register
  const isRegister = mode === 'register'
  const loading = status === 'loading'

  const { register: field, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    reset()
  }, [mode, reset])

  if (token) {
    const from = location.state?.from
    const to = from?.pathname && from.pathname !== '/login' ? `${from.pathname}${from.search || ''}` : '/'
    return <Navigate to={to} replace />
  }

  const switchMode = (next) => {
    dispatch(clearAuthMessages())
    setMode(next)
  }

  const onSubmit = (data) => {
    if (isRegister) {
      dispatch(register({
        name: data.name?.trim() || '',
        username: data.username.trim(),
        email: data.email.trim(),
        password: data.password,
      }))
    } else {
      dispatch(login({ username: data.username.trim(), password: data.password }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center font-bold text-primary-900 text-lg shadow-lg">
            SJ
          </div>
          <h1 className="mt-3 text-2xl font-bold text-white font-[family-name:var(--font-display)]">{SHOP_NAME}</h1>
          <p className="text-gold-400 text-xs mt-1">Jewellery Management</p>
        </div>

        <div className="card p-6 sm:p-8">
          <div className="flex rounded-lg bg-slate-100 p-1 mb-6">
            {[
              { id: 'login', label: 'Sign in' },
              { id: 'register', label: 'Create account' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => switchMode(tab.id)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  mode === tab.id ? 'bg-white text-primary-900 shadow-sm' : 'text-slate-500 hover:text-primary-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {!isApiConfigured && (
            <p className="mb-4 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
              Server address not set. Add <span className="font-mono">VITE_API_URL</span> to the <span className="font-mono">.env</span> file and restart the app.
            </p>
          )}
          {notice && !error && (
            <p className="mb-4 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-sm text-blue-800">{notice}</p>
          )}
          {error && (
            <p role="alert" className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {isRegister && (
              <FormInput label="Full Name" name="name" register={field} errors={errors} autoComplete="name" />
            )}
            <FormInput
              label={isRegister ? 'Username' : 'Username or Email'}
              name="username"
              register={field}
              errors={errors}
              required
              rules={{ required: 'Required' }}
              autoComplete="username"
            />
            {isRegister && (
              <FormInput
                label="Email"
                name="email"
                type="email"
                register={field}
                errors={errors}
                required
                rules={{ required: 'Required' }}
                autoComplete="email"
              />
            )}
            <FormInput
              label="Password"
              name="password"
              type="password"
              register={field}
              errors={errors}
              required
              rules={{ required: 'Required' }}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
            />

            <button type="submit" disabled={loading} className="btn-gold w-full justify-center py-3 disabled:opacity-60 disabled:cursor-not-allowed">
              {isRegister ? <FiUserPlus /> : <FiLogIn />}
              {loading ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-primary-200 mt-6">
          Each account has its own dashboard and items.
        </p>
      </motion.div>
    </div>
  )
}
