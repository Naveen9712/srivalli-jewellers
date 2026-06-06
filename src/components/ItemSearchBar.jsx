import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'

export default function ItemSearchBar({
  placeholder = 'Search by unique number, name, category...',
  className = '',
  inputClassName = '',
  iconClassName = 'text-slate-400',
  compact = false,
  autoFocus = false,
}) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  useEffect(() => {
    setQuery(searchParams.get('q') || '')
  }, [searchParams])

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = query.trim()
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search')
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${iconClassName}`} />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={
          inputClassName ||
          `w-full pl-10 pr-3 ${compact ? 'py-1.5 text-sm' : 'py-2'} rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500`
        }
      />
    </form>
  )
}
