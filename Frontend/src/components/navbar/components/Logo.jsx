import React from 'react'
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link
      to="/"
      className="flex items-center cursor-pointer group">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/luxor-uni.firebasestorage.app/o/Ar.png?alt=media&token=413c3087-7cad-4b40-809e-74c27b5f53e7"
        alt="logo"
        className="h-6 sm:h-8 md:h-10 lg:h-12 transition-all duration-300 group-hover:scale-105"
      />
    </Link>
  );
}

export default Logo
