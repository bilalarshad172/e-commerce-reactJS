import React from 'react'

const PricingAndInventory = ({ price, setPrice, countInStock, setCountInStock }) => {
  const handleChange = (e) => {
    setCountInStock((e.target.value))
    console.log(countInStock) 
  }
  return (
    <div className="border rounded-md shadow-md mt-5">
      <div className="mb-3">
        <h3 className="mx-5 mt-2 text-xl font-semibold">Pricing And Inventory</h3>
        <div className="flex flex-col mt-3">
          <label className="mx-5 font-semibold">Price</label>
          <input type="text" className="border rounded mx-5 p-1" id="pro_price" value={price}
            onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div className="flex flex-col">
          <label className="mx-5 font-semibold">Inventory</label>
          <input type="text" className="border rounded mx-5 p-1" id="pro_inventory" value={countInStock}
            onChange={handleChange} />
        </div>
      </div>
    </div>
  )
}

export default PricingAndInventory