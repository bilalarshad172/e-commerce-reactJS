import React from 'react';
import { Form, InputNumber, Tooltip } from 'antd';
import { InfoCircleOutlined, DollarOutlined, ShoppingOutlined } from '@ant-design/icons';

const PricingAndInventory = ({ price, setPrice, countInStock, setCountInStock }) => {
  // Validate price is a positive number
  const isPriceValid = price !== undefined && price !== null && !isNaN(Number(price)) && Number(price) > 0;

  // Validate inventory is a non-negative integer
  const isInventoryValid = countInStock !== undefined && countInStock !== null &&
                          !isNaN(Number(countInStock)) && Number(countInStock) >= 0 &&
                          Number.isInteger(Number(countInStock));

  return (
    <div className="pricing-inventory">
      <div className="mb-5">
        <h3 className="text-lg font-semibold mb-4">Pricing and Inventory</h3>

        <Form layout="vertical">
          <Form.Item
            label={
              <span className="font-medium">
                Price <span className="text-red-500">*</span>
                <Tooltip title="Enter the product price in dollars">
                  <InfoCircleOutlined className="ml-1 text-gray-400" />
                </Tooltip>
              </span>
            }
            required
            validateStatus={isPriceValid ? "success" : "error"}
            help={!isPriceValid && "Please enter a valid price (greater than 0)"}
          >
            <InputNumber
              addonBefore={<DollarOutlined />}
              placeholder="0.00"
              min={0.01}
              step={0.01}
              precision={2}
              style={{ width: '100%' }}
              value={price}
              onChange={(value) => setPrice(value)}
              id="pro_price"
              className="rounded-md"
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-medium">
                Inventory <span className="text-red-500">*</span>
                <Tooltip title="Enter the number of items in stock">
                  <InfoCircleOutlined className="ml-1 text-gray-400" />
                </Tooltip>
              </span>
            }
            required
            validateStatus={isInventoryValid ? "success" : "error"}
            help={!isInventoryValid && "Please enter a valid inventory count (whole number, 0 or greater)"}
          >
            <InputNumber
              addonBefore={<ShoppingOutlined />}
              placeholder="0"
              min={0}
              precision={0}
              style={{ width: '100%' }}
              value={countInStock}
              onChange={(value) => setCountInStock(value)}
              id="pro_inventory"
              className="rounded-md"
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default PricingAndInventory