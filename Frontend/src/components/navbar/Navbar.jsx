import React from "react";
import Logo from "./components/Logo";
import SearchBar from "./components/Search";
import Profile from "./components/Profile";

const Navbar = ({ searchBar = true }) => {
  // Set height based on searchBar prop
  const navbarHeight = searchBar ? "md:h-20 h-16" : "h-16";
  // Set margin for spacer div to match navbar height
  const spacerMargin = searchBar ? "mt-20" : "mt-16";

  return (
    <>
      <div className={`fixed top-0 left-0 w-full flex flex-row-reverse items-center justify-between px-6 md:px-32 border-b border-gray-200 bg-white z-30 ${navbarHeight}`}>
        <Logo />
        {searchBar && <SearchBar />}
        <Profile />
      </div>
      <div className={spacerMargin}></div>
    </>
  );
};

export default Navbar;
