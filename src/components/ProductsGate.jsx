import { FiRefreshCw } from 'react-icons/fi'
import Loader from './Loader'

/** Shows a loader while items load, a retry card if loading failed, otherwise the page content. */
export default function ProductsGate({ loading, error, onRetry, children }) {
  if (loading) {
    return <Loader text="Loading your items..." />
  }

  if (error) {
    return (
      <div className="card p-10 text-center">
        <p className="text-slate-700 font-medium mb-1">Could not load your items</p>
        <p className="text-sm text-slate-500 mb-4">{error}</p>
        <button type="button" onClick={onRetry} className="btn-outline inline-flex">
          <FiRefreshCw /> Try again
        </button>
      </div>
    )
  }

  return children
}
