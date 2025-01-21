import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Footer from "../../components/Footer";
import { fetchProductById, resetCreateStatus } from "../../redux/productSlice";
import DefaultImage from "../../assets/default.png";
import { Spin, Tag } from "antd";
import Card from "../../components/Card";

const ProductView = () => {
  const [quantity, setQuantity] = useState(0);
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productForEdit, loadingSingleProduct, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    // Fetch product by ID
    dispatch(fetchProductById(id));
    // Cleanup: Clear selected product when component unmounts
    return () => {
      dispatch(resetCreateStatus());
    };
  }, [dispatch, id]);

  // console.log('ProductView render', { loading, productForEdit })

  // console.log(productForEdit);
  const imageSrc = productForEdit?.images?.[0] || DefaultImage;

  const handleImageError = (e) => {
    e.target.src = DefaultImage;
  };

  const addQuantity = () => {
    setQuantity(quantity + 1);
  };
  const removeQuantity = () => {
    setQuantity(quantity - 1);
  };

  // console.log("ProductView loading state:", loading);
  if (loadingSingleProduct)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh", // Full viewport height for vertical centering
        }}
      >
        <Spin size="large" />
      </div>
    );
  if (error) return <p className="text-center mt-5">Error: {error}</p>;
  if (!productForEdit)
    return <p className="text-center mt-5">Product not found.</p>;
  return (
    <>
      <Header />

      <div className=" gap-20  mx-20 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-42 justify-between items-center border mt-10 rounded-md shadow-md">
          {/* Image Container */}

          <div className="w-full max-w-lg p-4 h-96   overflow-hidden">
            <img
              className="w-full h-full object-contain"
              src={imageSrc}
              onError={handleImageError}
              alt={productForEdit?.title}
            />
          </div>

          {/* Product Details */}
          <div className=" min-h-96 bg-[#e0dfdf] rounded-md  max-h-full px-20 py-10">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl    font-sans font-bold">
                {productForEdit?.title}
              </h1>
              <h2 className="text-xl font-bold">${productForEdit?.price}</h2>
            </div>
            <small className="block my-2">
              Brand: <Tag color="blue">{productForEdit?.brand?.title}</Tag>
            </small>
            <small className="block my-2">
              Categories:{" "}
              {productForEdit?.category?.map((cat) => (
                <Tag key={cat._id} color="blue">
                  {cat.title}
                </Tag>
              ))}
            </small>

            <div className="flex flex-col  justify-center mt-5 gap-2">
              <h6 className="text-xl font-semibold"> Select Quantity</h6>
              <div className="flex items-center gap-2">
                <button
                  className="w-10 h-10 bg-black pb-1 text-xl text-white text-center rounded-full border flex items-center justify-center"
                  onClick={removeQuantity}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  className="w-10 h-10 bg-black pb-1 text-xl text-white text-center rounded-full border flex items-center justify-center"
                  onClick={addQuantity}
                >
                  +
                </button>
              </div>
              <button className="border rounded-xl w-1/3 py-1 bg-black text-white hover:opacity-80">
                Add to cart
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="px-2 mt-2">
            <h4 className="text-xl font-semibold"> Product Description</h4>
            <hr className="my-2" />
            <p className="py-1">{productForEdit?.description}</p>
          </div>
        </div>
        <div className="mt-10">
          <h3 className="text-center text-2xl my-3">Related Products</h3>
          <div className=" ">
            <Card />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductView;
