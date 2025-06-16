import React from "react";
import Navbar from "../../components/navbar/Navbar";
import HomesGrid from "./HomesGrid";
import Search from "./Search";
import Hero from "../../components/hero/Hero";
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
      <Hero />
      {/* <Search /> */}
      <HomesGrid />
    </div>
  );
};

export default HomePage;
