import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Empty, message } from "antd";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getWishlist, removeFromWishlist } from "../../redux/wishlistSlice";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId))
      .unwrap()
      .then(() => message.success("Removed from wishlist"))
      .catch((err) => message.error(err));
  };

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-semibold mb-2">Wishlist</h1>
            <p className="text-gray-600 mb-6">
              Please login or signup to view and save your wishlist items.
            </p>
            <Button
              type="primary"
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-semibold mb-6">My Wishlist</h1>
          {!wishlist?.items?.length ? (
            <Empty description="No items in your wishlist yet." />
          ) : (
            <div className="space-y-4">
              {wishlist.items.map((item) => (
                <div
                  key={item.product?._id}
                  className="flex items-center justify-between border rounded-md p-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product?.images?.[0]}
                      alt={item.product?.title}
                      className="w-14 h-14 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.product?.title}</p>
                      <p className="text-sm text-gray-500">PKR {item.product?.price}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => navigate(`/products/${item.product?._id}`)}>
                      View
                    </Button>
                    <Button danger onClick={() => handleRemove(item.product?._id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
