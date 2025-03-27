import { Search } from 'lucide-react';
import React from 'react'

const SearchBar = () => {
  return (
    <div>
      <div className="flex items-center space-x-4 bg-r ed-100 border-[1px] h-16 w-96 rounded-full shadow-lg">
        <button className="p-2 m-3 bg-[#2c3d82] text-white border-[1px] rounded-full cursor-pointer">
          <Search />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
