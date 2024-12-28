import React from 'react'
import ProductDetails from './components/ProductDetails'
import ProductImages from './components/ProductImages'

const AddProduct = () => {
  return (
    <div>
      <div className='grid grid-cols-2 gap-2'>
        <div className='col-span-1 my-5'>
          <ProductDetails/>
        </div>
        <div className='col-span-1 my-5'>
          <ProductImages/>
        </div >
      </div>
    </div>
  )
}

export default AddProduct