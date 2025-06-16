import React from "react";
import Logo from "./components/Logo";
import SearchBar from "./components/Search";
import Profile from "./components/Profile";

const Navbar = () => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full flex flex-row-reverse items-center justify-between py-12 px-6 md:px-32 border-b border-gray-200 bg-white z-[60] h-16">
        <Logo />
        <SearchBar />
        <Profile />
      </div>
      <div className="mt-24"></div>
    </>
  );
};

export default Navbar;
