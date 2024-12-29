import React from 'react'

const PricingAndInventory = () => {
  return (
    <div className="border rounded-md shadow-md mt-5">
      <div className="mb-3">
        <h3 className="mx-5 mt-2 text-xl font-semibold">Pricing And Inventory</h3>
        <div className="flex flex-col mt-3">
          <label className="mx-5 font-semibold">Price</label>
          <input type="number" className="border rounded mx-5 p-1" id="pro_price" />
        </div>
        <div className="flex flex-col">
          <label className="mx-5 font-semibold">Inventory</label>
          <input type="number" className="border rounded mx-5 p-1" id="pro_inventory" />
        </div>
      </div>
    </div>
  )
}

export default PricingAndInventory