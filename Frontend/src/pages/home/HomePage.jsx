import React from "react";
import Navbar from "../../components/navbar/Navbar";
import HomesGrid from "./HomesGrid";
import Search from "./Search";
import { useEffect } from "react";
import useHomesStore from "../../store/house.store";

const HomePage = () => {
  const { getAdvertisements } = useHomesStore();

  useEffect(() => {
    getAdvertisements(); // عرض كل العقارات عند الدخول لأول مرة
  }, []);

  return (
    <div className=" ">
      <Navbar />
      {/* <Search /> */}
      <HomesGrid  />
    </div>
  );
};

export default HomePage;
