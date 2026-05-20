import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { FiSave } from 'react-icons/fi'
import PageHeader from '../../components/PageHeader'
import FormInput from '../../components/FormInput'
import { updateShopSettings, updateRates } from '../../redux/slices/appSlice'
import { currentRates } from '../../data/rates'

export default function Settings() {
  const dispatch = useDispatch()
  const { shopSettings, rates } = useSelector((state) => state.app)

  const shopForm = useForm({ defaultValues: shopSettings })
  const rateForm = useForm({ defaultValues: rates })
  const invoiceForm = useForm({
    defaultValues: {
      prefix: 'SJ',
      footer: 'Thank you for shopping with Srivalli jewellers',
      showHuid: true,
      showGst: true,
    },
  })

  const onShopSave = (data) => {
    dispatch(updateShopSettings(data))
    alert('Shop settings saved!')
  }

  const onRateSave = (data) => {
    dispatch(updateRates(data))
    alert('Rates updated!')
  }

  return (
    <div className="page-container">
      <PageHeader title="Settings" subtitle="Configure shop, rates and invoice preferences" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={shopForm.handleSubmit(onShopSave)} className="card p-6">
          <h3 className="font-semibold text-primary-900 mb-4 pb-2 border-b">Shop Information</h3>
          <div className="space-y-4">
            <FormInput label="Shop Name" name="shopName" register={shopForm.register} />
            <FormInput label="GST Number" name="gstNumber" register={shopForm.register} />
            <FormInput label="Address" name="address" type="textarea" register={shopForm.register} />
            <FormInput label="Phone" name="phone" register={shopForm.register} />
          </div>
          <button type="submit" className="btn-primary mt-6"><FiSave /> Save Shop Info</button>
        </form>

        <form onSubmit={rateForm.handleSubmit(onRateSave)} className="card p-6">
          <h3 className="font-semibold text-primary-900 mb-4 pb-2 border-b">Rate Settings (₹/gram)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput label="18K Gold" name="gold18k" type="number" register={rateForm.register} />
            <FormInput label="22K Gold" name="gold22k" type="number" register={rateForm.register} />
            <FormInput label="24K Gold" name="gold24k" type="number" register={rateForm.register} />
            <FormInput label="Silver 925" name="silver925" type="number" register={rateForm.register} />
          </div>
          <p className="text-xs text-slate-400 mt-2">Last updated: {new Date(currentRates.lastUpdated).toLocaleString('en-IN')}</p>
          <button type="submit" className="btn-gold mt-6"><FiSave /> Update Rates</button>
        </form>

        <form onSubmit={invoiceForm.handleSubmit(() => alert('Invoice settings saved!'))} className="card p-6">
          <h3 className="font-semibold text-primary-900 mb-4 pb-2 border-b">Invoice Settings</h3>
          <div className="space-y-4">
            <FormInput label="Invoice Prefix" name="prefix" register={invoiceForm.register} />
            <FormInput label="Invoice Footer Text" name="footer" type="textarea" register={invoiceForm.register} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...invoiceForm.register('showHuid')} className="rounded" /> Show HUID on Invoice
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...invoiceForm.register('showGst')} className="rounded" /> Show GST Breakdown
            </label>
          </div>
          <button type="submit" className="btn-primary mt-6"><FiSave /> Save Invoice Settings</button>
        </form>

        <div className="card p-6">
          <h3 className="font-semibold text-primary-900 mb-4 pb-2 border-b">Theme Settings</h3>
          <p className="text-sm text-slate-500 mb-4">Current theme: Elegant Blue + Gold (Default)</p>
          <div className="flex gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary-900 ring-2 ring-gold-500 cursor-pointer" title="Default" />
            <div className="w-12 h-12 rounded-lg bg-slate-800 cursor-pointer opacity-50" title="Dark (Coming soon)" />
            <div className="w-12 h-12 rounded-lg bg-amber-900 cursor-pointer opacity-50" title="Royal Gold (Coming soon)" />
          </div>
        </div>
      </div>
    </div>
  )
}
