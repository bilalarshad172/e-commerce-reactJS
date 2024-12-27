import React from "react";
import { Outlet } from "react-router-dom"; // Import Outlet
import Sidebar from "../sidebar/Sidebar";
import Header from "../../../components/Header";

const AdminLayout = () => {
  return (
    <div className="">
      <Header />
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1">
          <Sidebar />
        </div>
        <div className="col-span-3">
          {/* Render the active route's component here */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
