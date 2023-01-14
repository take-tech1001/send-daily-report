import clsx from 'clsx'
import { useState } from 'react'

export const useToast = () => {
  const [showToast, setShowToast] = useState(false)

  const handleToast = () => {
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 1000)
  }

  const Toast = ({ message }: { message: string }) => {
    return (
      <div
        className={clsx(
          'flex-col justify-center items-center fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-4 rounded-md opacity-70',
          showToast ? 'flex' : 'hidden'
        )}>
        <p className="mb-2">{message}</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>
    )
  }

  return { Toast, handleToast }
}
