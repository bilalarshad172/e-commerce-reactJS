import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

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

const ReviewChart = () => {
  return (
    <div className="border rounded-md shadow-md mt-5">
      <div>
        <h3 className="text-2xl font-semibold p-2">Satisfaction Rate</h3>
        <p className="px-2">For all Products</p>
      </div>
      <div>
        <HighchartsReact highcharts={Highcharts} options={linechart} />
      </div>
    </div>
  );
};

export default ReviewChart;
