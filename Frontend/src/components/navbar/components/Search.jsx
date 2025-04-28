import { Search } from "lucide-react";
import React, { use, useEffect, useState } from "react";

const SearchBar = () => {
  const [size, setSize] = useState(0);

  return (
    <div>
      <div
        className={`flex items-center space-x-4 border-[1px] rounded-full shadow-lg${
          size == 0 ? "h-12 w-72" : "h-16 w-96"
        } `}
      >
        <div className="flex items-center space-x-4 w-full h-full px-2 flex-row-reverse justify-between">
          <div className="text-gray-600 text-sm font-medium cursor-pointer">
            ابحث عن مكان للإقامة
          </div>

          <button
            className={`bg-[#2c3d82] text-white border-[1px] rounded-full cursor-pointer ${
              size == 0 ? "p-1 my-1" : "p-1 my-1 "
            } `}
          >
            <Search size={size == 0 ? 20 : 25} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
