import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Row, Col, Card, Rate, Progress, Statistic } from "antd";
import { LikeOutlined, DislikeOutlined, StarFilled } from '@ant-design/icons';

const ReviewChart = () => {
  // Mock data for product satisfaction
  const satisfactionData = {
    averageRating: 4.2,
    totalReviews: 1876,
    ratingDistribution: [
      { stars: 5, percentage: 45, count: 844 },
      { stars: 4, percentage: 38, count: 713 },
      { stars: 3, percentage: 10, count: 188 },
      { stars: 2, percentage: 5, count: 94 },
      { stars: 1, percentage: 2, count: 37 }
    ],
    positivePercentage: 83,
    negativePercentage: 7,
    neutralPercentage: 10
  };

  // Chart configuration
  const chartOptions = {
    chart: {
      type: 'pie',
      height: 200,
      backgroundColor: 'transparent'
    },
    title: {
      text: null
    },
    credits: {
      enabled: false
    },
    tooltip: {
      pointFormat: '<b>{point.percentage:.1f}%</b> ({point.y} reviews)'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false
        },
        showInLegend: false,
        innerSize: '60%',
        borderWidth: 0,
        colors: ['#24D2B5', '#20AEE3', '#F9C851', '#FF5C5C', '#FF9A9A']
      }
    },
    series: [{
      name: 'Reviews',
      colorByPoint: true,
      data: [
        { name: '5 Stars', y: satisfactionData.ratingDistribution[0].count },
        { name: '4 Stars', y: satisfactionData.ratingDistribution[1].count },
        { name: '3 Stars', y: satisfactionData.ratingDistribution[2].count },
        { name: '2 Stars', y: satisfactionData.ratingDistribution[3].count },
        { name: '1 Star', y: satisfactionData.ratingDistribution[4].count }
      ]
    }]
  };

  return (
    <div className="border rounded-lg shadow-lg mt-5 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="bg-white p-5">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-1">Satisfaction Rate</h3>
          <p className="text-sm text-gray-500">Customer feedback across all products</p>
        </div>

        <Row gutter={[16, 16]}>
          <Col span={24} md={12}>
            <div className="text-center mb-4">
              <div className="mb-2">
                <span className="text-3xl font-bold">{satisfactionData.averageRating}</span>
                <span className="text-gray-500 text-sm">/5</span>
              </div>
              <Rate disabled defaultValue={satisfactionData.averageRating} allowHalf />
              <div className="text-sm text-gray-500 mt-1">
                Based on {satisfactionData.totalReviews} reviews
              </div>
            </div>

            <div className="relative">
              <HighchartsReact highcharts={Highcharts} options={chartOptions} />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-xl font-bold">{satisfactionData.positivePercentage}%</div>
                <div className="text-xs text-gray-500">Positive</div>
              </div>
            </div>
          </Col>

          <Col span={24} md={12}>
            <div className="space-y-4">
              {satisfactionData.ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center">
                  <div className="w-12 text-right mr-3">
                    <div className="flex items-center justify-end">
                      <span className="mr-1">{item.stars}</span>
                      <StarFilled className="text-yellow-400 text-xs" />
                    </div>
                  </div>
                  <Progress
                    percent={item.percentage}
                    showInfo={false}
                    strokeColor={item.stars > 3 ? "#24D2B5" : item.stars === 3 ? "#F9C851" : "#FF5C5C"}
                    className="flex-1"
                  />
                  <div className="w-12 text-right ml-2 text-gray-500 text-sm">
                    {item.percentage}%
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              <Card size="small" className="text-center bg-gray-50">
                <Statistic
                  value={satisfactionData.positivePercentage}
                  suffix="%"
                  valueStyle={{ color: '#24D2B5' }}
                  prefix={<LikeOutlined />}
                />
                <div className="text-xs text-gray-500">Positive</div>
              </Card>
              <Card size="small" className="text-center bg-gray-50">
                <Statistic
                  value={satisfactionData.neutralPercentage}
                  suffix="%"
                  valueStyle={{ color: '#F9C851' }}
                />
                <div className="text-xs text-gray-500">Neutral</div>
              </Card>
              <Card size="small" className="text-center bg-gray-50">
                <Statistic
                  value={satisfactionData.negativePercentage}
                  suffix="%"
                  valueStyle={{ color: '#FF5C5C' }}
                  prefix={<DislikeOutlined />}
                />
                <div className="text-xs text-gray-500">Negative</div>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ReviewChart;
