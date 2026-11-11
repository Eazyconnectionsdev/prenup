import React from 'react'

type InputFieldProps = Omit<React.ComponentProps<'input'>, 'type' | 'value' | 'onChange' | 'className'> & {
  type?: 'text' | 'password' | 'number' | 'email' | 'textarea'
  label?: string
  value: string
  setValue: (value: string) => void
  error?: string
  setError?: (error: string) => void
  className?: string
  inputClassName?: string
  errorClassName?: string
}

const InputField = ({
  type = 'text',
  label,
  value,
  setValue,
  error,
  setError,
  className = '',
  inputClassName = '',
  errorClassName = '',
  ...rest
}: InputFieldProps) => {
    
  const common = {
    ...rest,
    value,
    'aria-invalid': !!error,
    className: `w-full rounded border px-3 py-2 ${error ? 'border-red-500' : 'border-gray-300'} ${inputClassName}`,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValue(e.target.value)
      if (error) setError?.('')
    },
  }

  return (
    <div className={className}>
      {label && <label className="mb-1 block">{label}</label>}
      {type === 'textarea' ? (
        <textarea {...(common as React.ComponentProps<'textarea'>)} />
      ) : (
        <input type={type} {...common} />
      )}
      {error && <p className={`mt-1 text-sm text-red-500 ${errorClassName}`}>{error}</p>}
    </div>
  )
}

export default InputField