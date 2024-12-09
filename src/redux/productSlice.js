import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// API URL (replace with your API endpoint)
const API_URL = "https://fakestoreapi.com/products"; // Example endpoint

// Thunk to fetch products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      return data; // Pass the fetched data to Redux
    } catch (error) {
      return rejectWithValue(error.message); // Pass the error to Redux
    }
  }
);

// Initial state
const initialState = {
  products: [],
  loading: false,
  error: null,
};

// Product slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
