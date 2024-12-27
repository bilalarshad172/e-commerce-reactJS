import React from 'react'
import UserChart from "./components/UserChart";
import SalesCard from "./components/SalesCard";
import TopSellers from "./components/TopSellers";
import ReviewChart from "./components/ReviewChart";
import Overview from "./components/Overview";

const Dashboard = () => {
  return (
      <div>
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
  )
}

export default Dashboard