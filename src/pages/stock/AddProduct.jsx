import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { FiUpload, FiSave } from 'react-icons/fi'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import FormInput from '../../components/FormInput'
import ProductsGate from '../../components/ProductsGate'
import { CATEGORIES, SUB_CATEGORIES, METAL_TYPES, CARAT_OPTIONS } from '../../utils/constants'
import { generateNextProductId } from '../../utils/productIdGenerator'
import { getProductImage } from '../../utils/categoryImages'
import { resizeImageFile } from '../../utils/imageResize'
import { useProduct, useProducts } from '../../hooks/useProducts'
import { createProduct, updateProduct } from '../../redux/slices/productsSlice'

export default function AddProduct({ metalTypeDefault = 'Gold', title = 'Add Item' }) {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { register, handleSubmit, watch, setValue, setError, reset, formState: { errors } } = useForm({
    defaultValues: {
      metalType: metalTypeDefault,
    },
  })

  const { allItems, loading: listLoading, error: listError, refresh } = useProducts()
  const { product, isDeleted, loading: productLoading } = useProduct(id)

  const [imagePreview, setImagePreview] = useState(null)
  const [imageChanged, setImageChanged] = useState(false)
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const formFilled = useRef(false)

  const category = watch('category')
  const carat = watch('carat')
  const metalType = watch('metalType')
  const subCategory = watch('subCategory')
  const uniqueNumber = watch('uniqueNumber')

  const caratOptions = metalType === 'Silver' ? CARAT_OPTIONS.silver : CARAT_OPTIONS.gold
  const subCategories = category ? SUB_CATEGORIES[category] || [] : []

  // Edit: fill the form once the product has loaded from the server.
  useEffect(() => {
    if (!isEdit || !product || formFilled.current) return
    formFilled.current = true
    setImagePreview(getProductImage(product))
    reset({
      productName: product.name,
      uniqueNumber: product.uniqueId,
      category: product.category,
      subCategory: product.subCategory || '',
      metalType: product.metalType || metalTypeDefault,
      carat: product.carat,
      weight: product.netWeight || '',
    })
  }, [isEdit, product, reset, metalTypeDefault])

  // Keep dependent selects valid when the parent value changes.
  useEffect(() => {
    if (subCategory && !subCategories.includes(subCategory)) setValue('subCategory', '')
  }, [category, subCategory, subCategories, setValue])

  useEffect(() => {
    if (carat && !caratOptions.includes(carat)) setValue('carat', '')
  }, [metalType, carat, caratOptions, setValue])

  // Add: suggest the next free unique number for this category + carat.
  useEffect(() => {
    if (isEdit) return
    if (category && carat) {
      setValue('uniqueNumber', generateNextProductId(category, carat, allItems))
    }
  }, [category, carat, allItems, setValue, isEdit])

  if (isEdit && productLoading) {
    return (
      <div className="page-container">
        <ProductsGate loading />
      </div>
    )
  }

  if (isEdit && listError && !product) {
    return (
      <div className="page-container">
        <ProductsGate error={listError} onRetry={refresh} />
      </div>
    )
  }

  if (isEdit && !listLoading && (!product || isDeleted)) {
    return <Navigate to="/stocks" replace />
  }

  const onSubmit = async (data) => {
    setSubmitError('')
    setSaving(true)

    const payload = {
      uniqueId: data.uniqueNumber.trim(),
      name: data.productName.trim(),
      category: data.category,
      subCategory: data.subCategory || '',
      metalType: data.metalType,
      carat: data.carat,
      netWeight: Number(data.weight || 0),
    }
    // Only send the photo when a new one was chosen; otherwise the saved one is kept.
    // Items without a photo show their category picture, as before.
    if (imageChanged && imagePreview) payload.image = imagePreview

    try {
      if (isEdit) {
        await dispatch(updateProduct({ id, changes: payload })).unwrap()
        navigate(`/product/${encodeURIComponent(id)}`)
      } else {
        await dispatch(createProduct(payload)).unwrap()
        navigate('/stocks')
      }
    } catch (err) {
      setSaving(false)
      // The server names the form field that was rejected (e.g. a duplicate unique number).
      const formFields = ['productName', 'uniqueNumber', 'category', 'subCategory', 'metalType', 'carat', 'weight']
      if (formFields.includes(err?.field)) {
        setError(err.field, { type: 'server', message: err.message }, { shouldFocus: true })
      } else {
        setSubmitError(err?.message || 'Could not save the item. Please try again.')
      }
    }
  }

  const handleImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      // Shrink large phone photos before upload (keeps saving fast).
      const dataUrl = await resizeImageFile(file)
      setImagePreview(dataUrl)
      setImageChanged(true)
      setSubmitError('')
      setValue('image', file.name)
    } catch {
      setSubmitError('That file could not be read as an image. Please choose a JPG or PNG photo.')
    }
  }

  const pageTitle = isEdit ? 'Edit Item' : title

  return (
    <div className="page-container">
      <PageHeader
        title={pageTitle}
        subtitle={isEdit ? 'Update product details' : 'Add new jewellery item to inventory'}
        breadcrumbs={[
          { label: 'Stocks', path: '/stocks' },
          ...(isEdit ? [{ label: 'Product', path: `/product/${id}` }] : []),
          { label: pageTitle },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="card p-6">
              <h3 className="font-semibold text-primary-900 mb-4 border-b pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Product Name" name="productName" register={register} errors={errors} required rules={{ required: 'Required' }} />
                <FormInput label="Unique Number" name="uniqueNumber" register={register} errors={errors} required rules={{ required: 'Required' }} placeholder="GLD-RNG-22K-0001" />
                <FormInput label="Product Category" name="category" type="select" options={CATEGORIES} register={register} errors={errors} required rules={{ required: 'Required' }} />
                <FormInput label="Sub Category" name="subCategory" type="select" options={subCategories} register={register} errors={errors} disabled={!category} />
                <FormInput label="Metal Type" name="metalType" type="select" options={METAL_TYPES} register={register} errors={errors} required rules={{ required: 'Required' }} />
                <FormInput label="Carat Value" name="carat" type="select" options={caratOptions} register={register} errors={errors} required rules={{ required: 'Required' }} />
                <FormInput
                  label="Weight (g)"
                  name="weight"
                  type="number"
                  step="0.001"
                  min="0.001"
                  register={register}
                  errors={errors}
                  required
                  rules={{
                    required: 'Required',
                    validate: (value) => Number(value) > 0 || 'Enter a weight greater than 0',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6 bg-gradient-to-br from-primary-900 to-primary-800 text-white">
              <p className="text-sm text-primary-200">Preview Unique ID</p>
              <p className="text-xl font-mono font-bold text-gold-400 mt-2 break-all">
                {uniqueNumber || 'Enter or select category & carat'}
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

            {submitError && (
              <p role="alert" className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="btn-gold w-full justify-center py-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FiSave /> {saving ? 'Saving…' : isEdit ? 'Update Product' : 'Save Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
