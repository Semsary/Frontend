// import { AlignJustify } from 'lucide-react';
import { AlignJustify } from "lucide-react";
import React from "react";

const Profile = () => {
  return (
    <div>
      <button className="flex items-center space-x-4 bg-r ed-100 border-[1px] px-1 pr-5 py-1 rounded-full shadow-xs">
        <img
          src="../../../public/images/test/avatar.png"
          alt="logo" className=" h-10 "
        />
        <AlignJustify size={20} />
      </button>
    </div>
  );
};

export default Profile;
