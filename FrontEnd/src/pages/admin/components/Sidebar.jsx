import React from "react";
import Header from "../../../components/Header";

const Sidebar = () => {
  return (
    <>
      <Header />
      <div className="grid grid-cols-4">
        <div className="col-span-1 border-r h-screen shadow-md">Sidebar</div>
      </div>
    </>
  );
};

export default Sidebar;
