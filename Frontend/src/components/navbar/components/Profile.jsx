// import { AlignJustify } from 'lucide-react';
import { AlignJustify } from "lucide-react";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

const Profile = () => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <button className="flex items-center space-x-4  border-[1px] px-1 pr-5 py-1 rounded-full shadow-xs">
            <img
              src="../../../public/images/test/avatar.png"
              alt="الشعار"
              className=" h-10 "
            />
            <AlignJustify size={20} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="text-right w-48">
          <DropdownMenuLabel>حسابك</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-right ">
            الملف الشخصي
          </DropdownMenuItem>
          <DropdownMenuItem className="text-right">الفواتير</DropdownMenuItem>
          <DropdownMenuItem className="text-right">الفريق</DropdownMenuItem>
          <DropdownMenuItem className="text-right">الاشتراك</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Profile;
