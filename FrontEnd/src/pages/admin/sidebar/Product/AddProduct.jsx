import React from 'react'
import ProductDetails from './components/ProductDetails'
import ProductImages from './components/ProductImages'
import CategoryAndTags from './components/CategoryAndTags'
import PricingAndInventory from './components/PricingAndInventory'

const AddProduct = () => {
  return (
    <div>
      <div className='grid grid-cols-2 gap-2'>
        <div className='col-span-1 my-5'>
          <ProductDetails />
          <PricingAndInventory/>
        </div>
        <div className='col-span-1 my-5'>
          <ProductImages />
          <CategoryAndTags/>
        </div >
      </div>
    </div>
  )
}

export default AddProduct