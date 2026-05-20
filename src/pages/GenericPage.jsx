import { Link } from 'react-router-dom'
import { FiArrowLeft, FiTool } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'

export default function GenericPage({ title, subtitle, description }) {
  return (
    <div className="page-container">
      <PageHeader title={title} subtitle={subtitle || 'Module page'} />
      <div className="card p-12 text-center max-w-lg mx-auto">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary-100 flex items-center justify-center">
          <FiTool className="text-4xl text-primary-700" />
        </div>
        <h2 className="text-xl font-bold text-primary-900 mb-2">{title}</h2>
        <p className="text-slate-500 mb-6">
          {description || 'This module is ready for API integration. UI structure is in place with dummy data support.'}
        </p>
        <Link to="/" className="btn-primary inline-flex">
          <FiArrowLeft /> Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
