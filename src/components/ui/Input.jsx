import React from 'react'

export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && <label className="text-sm font-bold text-primary-dark ml-1">{label}</label>}
      <input 
        className={`px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-primary outline-none transition-all placeholder:text-gray-300 ${error ? 'border-error' : ''}`}
        {...props}
      />
      {error && <span className="text-xs text-error font-medium ml-1">{error}</span>}
    </div>
  )
}
