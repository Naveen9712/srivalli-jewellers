export default function FormInput({
  label,
  name,
  type = 'text',
  register,
  errors,
  options,
  placeholder,
  required,
  disabled,
  className = '',
  ...rest
}) {
  const error = errors?.[name]

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="label-field">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {type === 'select' ? (
        <select
          id={name}
          disabled={disabled}
          className={`input-field ${error ? 'border-red-400' : ''}`}
          {...register(name)}
          {...rest}
        >
          <option value="">Select {label}</option>
          {options?.map((opt) => (
            <option key={typeof opt === 'object' ? opt.value : opt} value={typeof opt === 'object' ? opt.value : opt}>
              {typeof opt === 'object' ? opt.label : opt}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={name}
          rows={3}
          placeholder={placeholder}
          disabled={disabled}
          className={`input-field resize-none ${error ? 'border-red-400' : ''}`}
          {...register(name)}
          {...rest}
        />
      ) : (
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`input-field ${error ? 'border-red-400' : ''}`}
          {...register(name)}
          {...rest}
        />
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
  )
}
