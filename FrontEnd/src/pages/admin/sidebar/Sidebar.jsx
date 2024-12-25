import React from "react";

const Sidebar = () => {
  return (
    <>
      <div className="">
        <div className=" border-r h-screen shadow-md">
          <ul>
            <li className="p-4 border-b">Dashboard</li>
            <li className="p-4 border-b">Products</li>
            <li className="p-4 border-b">Content Management</li>
            <li className="p-4 border-b">Orders</li>
            <li className="p-4 border-b">Users</li>
            <li className="p-4 border-b">Settings</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
