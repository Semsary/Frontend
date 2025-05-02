import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-50">
          <div className="flex  flex-col
      items-center justify-center space-x-2">
        <svg
          className="animate-spin h-10 w-10 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" className="opacity-25" />
          <path d="M4 12a8 8 0 1 1 16 0" className="opacity-75" />
        </svg>
        <span className="text-gray-600">... جاري التحميل</span>
      </div>
    </div>
  );
};

export default Loading;
