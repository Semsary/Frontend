import React from "react";
import Navbar from "../../components/navbar/Navbar";
import homes from "../../testingData/home";
import HomesGrid from "./HomesGrid";

const HomePage = () => {
  return (
    <div className="">
      <Navbar />
      <HomesGrid homes={homes} />
    </div>
  );
};

export default HomePage;
