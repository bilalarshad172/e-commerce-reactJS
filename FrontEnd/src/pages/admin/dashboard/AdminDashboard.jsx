import React from "react";
import Sidebar from "../sidebar/Sidebar";
import Overview from "./components/Overview";
import Header from "../../../components/Header";
import UserChart from "./components/UserChart";
import SalesCard from "./components/SalesCard";
import TopSellers from "./components/TopSellers";
import ReviewChart from "./components/ReviewChart";

const AdminDashboard = () => {
  return (
    <div className="">
      <Header />
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1">
          <Sidebar />
        </div>
        <div className="col-span-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <Overview />
            </div>
            <div className="col-span-1">
              <UserChart />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <SalesCard />
            </div>
            <div className="col-span-1">
              <SalesCard />
            </div>
            <div className="col-span-1">
              <SalesCard />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <TopSellers />
            </div>
            <div className="col-span-1">
              <ReviewChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
