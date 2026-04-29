import React from "react";
import { Card, Statistic } from "antd";

const SalesCard = ({ title = "Total Sales", value = "5000", icon, color = "black" }) => {
  // Map color names to tailwind classes
  const colorMap = {
    black: "bg-black text-white",
    blue: "bg-blue-500 text-white",
    green: "bg-green-500 text-white",
    red: "bg-red-500 text-white",
    yellow: "bg-yellow-500 text-white",
    purple: "bg-purple-500 text-white",
    orange: "bg-orange-500 text-white",
    teal: "bg-teal-500 text-white",
    pink: "bg-pink-500 text-white",
  };

  const bgColorClass = colorMap[color] || colorMap.black;

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <div className="grid grid-cols-2 gap-4">
        <div className={`col-span-1 text-center ${bgColorClass} p-4 rounded-lg flex items-center justify-center`}>
          {icon ? React.cloneElement(icon, { style: { fontSize: "48px" } }) : null}
        </div>
        <div className="col-span-1 flex flex-col justify-center">
          <Statistic
            title={<span className="text-gray-600 font-medium">{title}</span>}
            value={value}
            prefix="PKR "
            valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
          />
        </div>
      </div>
    </Card>
  );
};

export default SalesCard;
