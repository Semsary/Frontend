import React from 'react'
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link
      to="/"
      className="flex items-center cursor-pointer group">
      <img
        src="../../../public/images/logo/logo.png"
        alt="logo"
        className="h-8 sm:h-10 lg:h-12 transition-all duration-300 group-hover:scale-105"
      />
    </Link>
  );
}

export default Logo
