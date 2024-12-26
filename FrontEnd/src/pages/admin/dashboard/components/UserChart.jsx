import React from "react";
import { Progress, Tooltip } from "antd";

const UserChart = () => {
  return (
    <div className="border rounded-md shadow-md mt-5 py-5 text-center">
      <div className="p-5">
        <h1 className="text-lg font-semibold">User Chart</h1>
        <Tooltip title="3 done / 3 in progress / 4 to do">
          <Progress
            percent={60}
            success={{
              percent: 30,
            }}
            type="circle"
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default UserChart;
