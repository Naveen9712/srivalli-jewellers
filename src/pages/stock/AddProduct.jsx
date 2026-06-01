import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FiUpload, FiSave } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import FormInput from '../../components/FormInput'
import { CATEGORIES, SUB_CATEGORIES, METAL_TYPES, CARAT_OPTIONS } from '../../utils/constants'
import { generateProductId } from '../../utils/productIdGenerator'
import { addTempProduct, getAllProducts } from '../../utils/localProducts'

export default function AddProduct({ metalTypeDefault = 'Gold', title = 'Add Gold Item' }) {
  const navigate = useNavigate()
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      metalType: metalTypeDefault,
    },
  })

  const [previewId, setPreviewId] = useState('')
  const [imagePreview, setImagePreview] = useState(null)

  const category = watch('category')
  const carat = watch('carat')
  const metalType = watch('metalType')

  const caratOptions = metalType === 'Silver' ? CARAT_OPTIONS.silver : CARAT_OPTIONS.gold
  const subCategories = category ? SUB_CATEGORIES[category] || [] : []

  useEffect(() => {
    if (category && carat) {
      const seq = getAllProducts().length + 1
      setPreviewId(generateProductId(category, carat, seq))
    }
  }, [category, carat])

  const onSubmit = (data) => {
    const tempItem = {
      id: `temp-${Date.now()}`,
      uniqueId: previewId,
      name: data.productName,
      category: data.category,
      subCategory: data.subCategory || '',
      metalType: data.metalType,
      carat: data.carat,
      quantity: 1,
      status: 'In Stock',
      image: imagePreview || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100&h=100&fit=crop',
      _temp: true,
      _createdAt: new Date().toISOString(),
    }

    addTempProduct(tempItem)
    navigate('/stocks')
  }

  const handleImage = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : null
        if (result) setImagePreview(result)
      }
      reader.readAsDataURL(file)
      setValue('image', file.name)
    }
  }

  return (
    <div className="page-container">
      <PageHeader
        title={title}
        subtitle="Add new jewellery item to inventory"
        breadcrumbs={[{ label: 'Stocks', path: '/stocks' }, { label: title }]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="card p-6">
              <h3 className="font-semibold text-primary-900 mb-4 border-b pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Product Name" name="productName" register={register} errors={errors} required rules={{ required: 'Required' }} />
                <FormInput label="Product Category" name="category" type="select" options={CATEGORIES} register={register} errors={errors} required rules={{ required: 'Required' }} />
                <FormInput label="Sub Category" name="subCategory" type="select" options={subCategories} register={register} errors={errors} disabled={!category} />
                <FormInput label="Metal Type" name="metalType" type="select" options={METAL_TYPES} register={register} errors={errors} required />
                <FormInput label="Carat Value" name="carat" type="select" options={caratOptions} register={register} errors={errors} required rules={{ required: 'Required' }} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6 bg-gradient-to-br from-primary-900 to-primary-800 text-white">
              <p className="text-sm text-primary-200">Preview Unique ID</p>
              <p className="text-xl font-mono font-bold text-gold-400 mt-2 break-all">
                {previewId || 'Select category & carat'}
              </p>
              <p className="text-xs text-primary-300 mt-3">Format: GLD-RNG-22K-0001</p>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-primary-900 mb-4">Product Image</h3>
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-gold-500 transition-colors bg-slate-50">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <>
                    <FiUpload className="text-3xl text-slate-400 mb-2" />
                    <span className="text-sm text-slate-500">Click to upload image</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
            </div>

            <button type="submit" className="btn-gold w-full justify-center py-3">
              <FiSave /> Save Product
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
