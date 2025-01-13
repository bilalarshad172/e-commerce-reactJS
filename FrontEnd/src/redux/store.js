import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice";
import productReducer from "../redux/productSlice";
import brandsReducer from "../redux/brandsSlice";
import categoryReducer from "../redux/categorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    brands: brandsReducer,
    categories: categoryReducer,
  },
});
