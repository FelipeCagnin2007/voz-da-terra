import React from 'react'

export const Card = ({ children, className = '', hover = true }) => {
  return (
    <div className={`bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 transition-all ${hover ? 'hover:shadow-xl hover:-translate-y-1' : ''} ${className}`}>
      {children}
    </div>
  )
}
