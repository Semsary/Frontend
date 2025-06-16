import React from 'react'

const Logo = () => {
  return (
    <div className="flex items-center cursor-pointer group">
      <img
        src="../../../public/images/logo/logo.png"
        alt="logo"
        className="h-8 sm:h-10 lg:h-12 transition-all duration-300 group-hover:scale-105"
      />
    </div>
  );
}

export default Logo
