import React from "react";
import Navbar from "../../components/navbar/Navbar";
import homes from "../../testingData/home";
import HomesGrid from "./HomesGrid";

const HomePage = () => {


  return (
    <div className="">
      <Navbar />

      <div className="">
        <h1 className="text-3xl">Home Page</h1>
      </div>

     <HomesGrid homes={homes} />
    </div>
  );
};

export default HomePage;
