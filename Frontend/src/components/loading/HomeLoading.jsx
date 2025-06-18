import React from "react";

const Loading = () => {
  const Logo = "../../../public/images/logo/white-square.png";

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <div className="w-1 h-1 bg-blue-300 rounded-full opacity-30"></div>
          </div>
        ))}
      </div>

      {/* Main Loading Container */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 animate-fade-in">

          <div className="relative">
            <div className="absolute inset-0 bg-blue-200 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-full p-6 border border-gray-200 shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg animate-pulse flex items-center justify-center shadow-md">
                {/* <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg> */}
                <img src={Logo} alt="Logo" className="w-16 h-16 object-cover rounded-lg" />
              </div>
            </div>
          </div>

          {/* Multi-Ring Loader */}
        <div className="relative">
          <div className="w-20 h-20">
            {/* Outer Ring */}
            <svg className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: '3s' }}>
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="url(#gradient1)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="60 40"
              />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
              </defs>
            </svg>

            {/* Middle Ring */}
            <svg className="absolute inset-2 w-16 h-16 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="url(#gradient2)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="40 30"
              />
              <defs>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Ring */}
            <svg className="absolute inset-4 w-12 h-12 animate-spin" style={{ animationDuration: '1.5s' }}>
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="url(#gradient3)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="30 20"
              />
              <defs>
                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Loading Text with Animation */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-800 animate-pulse">
            جاري التحميل
          </h2>
          <div className="flex space-x-1 justify-center" dir="rtl">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              ></div>
            ))}
          </div>
          <p className="text-gray-600 text-sm">
            يرجى الانتظار بينما نحضر كل شيء لك
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse shadow-sm"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Loading;
