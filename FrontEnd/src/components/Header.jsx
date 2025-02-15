import React from "react";
import { NavLink } from "react-router-dom";
import { FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import Profile from "./Profile";

const Header = () => {
  

  return (
    <div className="flex justify-between border-b py-3 mx-5">
      <h1 className="text-3xl font-bold font-mono">Tanzayb</h1>
      <input
        className="border rounded px-1 w-1/3"
        type="text"
        name=""
        id=""
        placeholder="Search By name"
      />
      <div className="flex items-center gap-5">
        
        <NavLink to="/products/cart" className="flex items-center gap-2">
          <FaShoppingCart className="text-2xl text-gray-700 cursor-pointer hover:text-blue-500 transition duration-300">
            <span className="text-lg font-medium">Cart</span>
          </FaShoppingCart>
        </NavLink>
        <div>
        <Profile/>
        </div>
        {/* <div
          className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-blue-500 transition duration-300"
          onClick={handleSignout}
        >
          <FaSignOutAlt className="text-2xl" />
          <span className="text-lg font-medium">Signout</span>
        </div> */}
      </div>
    </div>
  );
};

export default Header;
