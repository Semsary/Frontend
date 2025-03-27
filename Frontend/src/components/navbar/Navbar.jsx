import React from "react";
import { AlignJustify, Search } from "lucide-react";
import Logo from "./components/Logo";
import SearchBar from "./components/Search";
import Profile from "./components/Profile";

const Navbar = () => {
  return (
    <div className="flex flex-row-reverse items-center justify-between py-4 px-20 border-b-[1px] border-gray-200">
      <Logo />
      <SearchBar />
      <Profile />
    </div>
  );
};

export default Navbar;
