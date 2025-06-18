import React from "react";
import Logo from "./components/Logo";
import SearchBar from "./components/Search";
import Profile from "./components/Profile";

const Navbar = ({ searchBar = true }) => {
  // Set height based on searchBar prop - improved mobile heights
  const navbarHeight = searchBar ? "h-14 sm:h-16 md:h-20" : "h-12 sm:h-14 md:h-16";
  // Set margin for spacer div to match navbar height
  const spacerMargin = searchBar ? "mt-14 sm:mt-16 md:mt-20" : "mt-12 sm:mt-14 md:mt-16";

  return (
    <>
      <div className={`fixed top-0 left-0 w-full flex flex-row-reverse items-center justify-between px-2 sm:px-4 md:px-6 lg:px-32 border-b border-gray-200 bg-white z-30 ${navbarHeight}`}>
        <Logo />
        {searchBar && <SearchBar />}
        <Profile />
      </div>
      <div className={spacerMargin}></div>
    </>
  );
};

export default Navbar;
