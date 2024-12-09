import React from "react";
import { SideNavBar } from "../components/SideNavBar";
import { DashBoard } from "../components/Dashboard";

const page = () => {
  return (
    <div className="flex">
      <div className="w-1/6">
        <SideNavBar />
      </div>
      <div className="w-5/6">
        <DashBoard />
      </div>
    </div>
  );
};

export default page;
