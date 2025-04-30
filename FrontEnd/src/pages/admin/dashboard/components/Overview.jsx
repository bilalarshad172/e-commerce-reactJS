import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// Import and initialize Highcharts modules properly
// No need to import highcharts-more separately as it's included in the main package

const Overview = () => {
  // Monthly data for the chart
  const [chartData] = useState({
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    income: [4500, 5200, 6100, 5800, 7200, 8100, 7900, 8500, 9200, 8700, 9500, 10200],
    expense: [3200, 3800, 4100, 3900, 4700, 5200, 4800, 5100, 5600, 5300, 5800, 6100],
    profit: [] // Will be calculated
  });

  // Calculate profit (income - expense)
  useEffect(() => {
    const profitData = chartData.income.map((inc, index) => inc - chartData.expense[index]);
    chartData.profit = profitData;
  }, [chartData]);

  // Chart configuration with advanced visual features
  const chartOptions = {
    chart: {
      type: 'areaspline', // Using areaspline which is included in the core package
      height: 350,
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Arial, sans-serif'
      },
      animation: {
        duration: 1000
      },
      borderRadius: 8,
      spacing: [20, 10, 20, 10]
    },
    title: {
      text: null // We have our own title in the component
    },
    credits: {
      enabled: false // Remove Highcharts credits
    },
    xAxis: {
      categories: chartData.months,
      labels: {
        style: {
          color: '#666',
          fontSize: '12px',
          fontWeight: '500'
        }
      },
      lineColor: '#E0E0E0',
      tickColor: '#E0E0E0',
      crosshair: {
        width: 1,
        color: 'rgba(0, 0, 0, 0.1)',
        dashStyle: 'ShortDot'
      }
    },
    yAxis: {
      title: {
        text: 'Amount ($)',
        style: {
          color: '#666',
          fontSize: '12px',
          fontWeight: 'normal'
        }
      },
      labels: {
        formatter: function() {
          return '$' + this.value.toLocaleString();
        },
        style: {
          color: '#666',
          fontSize: '12px'
        }
      },
      gridLineColor: 'rgba(224, 224, 224, 0.5)',
      gridLineDashStyle: 'Dash',
      min: 0
    },
    tooltip: {
      shared: true,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderWidth: 0,
      borderRadius: 8,
      shadow: {
        offsetX: 1,
        offsetY: 2,
        width: 2,
        opacity: 0.05
      },
      useHTML: true,
      formatter: function() {
        let tooltip = '<div style="padding: 12px; font-size: 13px;">';
        tooltip += '<div style="font-weight: 600; margin-bottom: 8px; color: #333;">' + this.x + '</div>';

        // Income
        tooltip += '<div style="display: flex; align-items: center; margin: 6px 0; justify-content: space-between;">';
        tooltip += '<div style="display: flex; align-items: center;">';
        tooltip += '<div style="width: 10px; height: 10px; border-radius: 50%; background-color: ' + '#24D2B5' + '; margin-right: 8px;"></div>';
        tooltip += '<span style="color: #555;">Income: </span>';
        tooltip += '</div>';
        tooltip += '<strong style="margin-left: 12px; color: #333;">$' + this.points[0].y.toLocaleString() + '</strong>';
        tooltip += '</div>';

        // Expense
        tooltip += '<div style="display: flex; align-items: center; margin: 6px 0; justify-content: space-between;">';
        tooltip += '<div style="display: flex; align-items: center;">';
        tooltip += '<div style="width: 10px; height: 10px; border-radius: 50%; background-color: ' + '#20AEE3' + '; margin-right: 8px;"></div>';
        tooltip += '<span style="color: #555;">Expense: </span>';
        tooltip += '</div>';
        tooltip += '<strong style="margin-left: 12px; color: #333;">$' + this.points[1].y.toLocaleString() + '</strong>';
        tooltip += '</div>';

        // Profit
        const profit = this.points[0].y - this.points[1].y;
        tooltip += '<div style="display: flex; align-items: center; margin: 6px 0; padding-top: 6px; border-top: 1px solid #eee; justify-content: space-between;">';
        tooltip += '<div style="display: flex; align-items: center;">';
        tooltip += '<div style="width: 10px; height: 10px; border-radius: 50%; background-color: ' + '#000000' + '; margin-right: 8px;"></div>';
        tooltip += '<span style="color: #555;">Profit: </span>';
        tooltip += '</div>';
        tooltip += '<strong style="margin-left: 12px; color: #333;">$' + profit.toLocaleString() + '</strong>';
        tooltip += '</div>';

        tooltip += '</div>';
        return tooltip;
      }
    },
    legend: {
      enabled: false // We have custom legend in the component
    },
    plotOptions: {
      area: {
        fillOpacity: 0.65,
        marker: {
          enabled: false,
          symbol: 'circle',
          radius: 4,
          fillColor: '#FFFFFF',
          lineWidth: 2,
          states: {
            hover: {
              enabled: true,
              lineWidthPlus: 0
            }
          }
        },
        lineWidth: 2,
        states: {
          hover: {
            lineWidth: 3
          }
        },
        threshold: null
      },
      series: {
        animation: {
          duration: 1000
        },
        // Simplified point events to avoid any potential issues
        point: {
          events: {}
        }
      }
    },
    series: [
      {
        name: 'Income',
        data: chartData.income,
        color: '#24D2B5',
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, 'rgba(36, 210, 181, 0.7)'],
            [1, 'rgba(36, 210, 181, 0.05)']
          ]
        }
      },
      {
        name: 'Expense',
        data: chartData.expense,
        color: '#20AEE3',
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, 'rgba(32, 174, 227, 0.7)'],
            [1, 'rgba(32, 174, 227, 0.05)']
          ]
        }
      }
    ]
  };

  return (
    <div className="border rounded-lg shadow-lg mt-5 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="bg-white p-5 rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-1">Income vs Expense</h3>
            <p className="text-sm text-gray-500">Financial performance over the last 12 months</p>
          </div>
          <div className="flex gap-5 items-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#24D2B5]"></span>
              <span className="text-sm text-gray-600 font-medium">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#20AEE3]"></span>
              <span className="text-sm text-gray-600 font-medium">Expense</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total Income</p>
            <h4 className="text-xl font-bold text-gray-800">
              ${chartData.income.reduce((sum, val) => sum + val, 0).toLocaleString()}
            </h4>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
            <h4 className="text-xl font-bold text-gray-800">
              ${chartData.expense.reduce((sum, val) => sum + val, 0).toLocaleString()}
            </h4>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Net Profit</p>
            <h4 className="text-xl font-bold text-gray-800">
              ${(chartData.income.reduce((sum, val) => sum + val, 0) -
                 chartData.expense.reduce((sum, val) => sum + val, 0)).toLocaleString()}
            </h4>
          </div>
        </div>

        <div className="chart-container relative">
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>

        <div className="mt-4 text-right">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Last updated: Today</span>
        </div>
      </div>
    </div>
  );
};

export default Overview;
