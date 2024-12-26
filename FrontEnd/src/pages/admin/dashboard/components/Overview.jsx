import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";

// // Initialize highcharts-more
// HighchartsMore(Highcharts);

const linechart = {
  title: {
    text: "My chart",
  },
  chart: {
    type: "line",
    height: 200, // Set custom height in pixels
  },
  series: [
    {
      data: [1, 2, 3],
    },
  ],
};

const Overview = () => {
  return (
    <div className="border rounded-md shadow-md mt-5">
      <div className="bg-white  p-3 rounded-lg">
        <div className="bg-white flex justify-between mt-5 p-2">
          <h3>Income vs Expense</h3>
          <div className="flex gap-4 justify-between">
            <span className="bg-[#24D2B5] rounded-full px-2 py-1 text-white text-sm">
              Income
            </span>
            <span className="bg-[#20AEE3] rounded-full px-2 py-1 text-white text-sm">
              Expense
            </span>
          </div>
        </div>
        <div>
          <HighchartsReact highcharts={Highcharts} options={linechart} />
        </div>
      </div>
    </div>
  );
};

export default Overview;
