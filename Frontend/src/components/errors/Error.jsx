import React from 'react'

const Error = ({error}) => {
  return (
    <div
      className="w-full bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3 shadow-sm mb-4 animate-fade-in"
      dir="rtl"
    >
      <svg
        className="w-5 h-5 text-red-500 mt-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
        />
      </svg>
      <div>
        <strong className="font-bold block mb-1">حدث خطأ:</strong>
        <span className="text-sm">{error}</span>
      </div>
    </div>
  );
}

export default Error
