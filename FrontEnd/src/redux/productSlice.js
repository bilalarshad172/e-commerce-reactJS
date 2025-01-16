import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// API URL (replace with your API endpoint)
const API_URL = "https://fakestoreapi.com/products"; 

// Thunk to fetch products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      return data; // Pass the fetched data to Redux
    } catch (error) {
      return rejectWithValue(error.message); // Pass the error to Redux
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      console.log("Product ID:", id); // Debug the ID
      if (!id) throw new Error("Invalid product ID");

      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      if (!response.ok) throw new Error("Failed to fetch product");

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in fetchProductById thunk:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (product, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add Product");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Initial state
const initialState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
  createSuccess: false,
};

// Product slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetCreateStatus: (state) => {
      state.createSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //Add product cases
       .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.createSuccess = true;
        // optionally add the newly created product to products list
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.createSuccess = false;
        state.error = action.payload || "Something went wrong!";
      })
      // fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    
     // Fetch single product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const { resetCreateStatus } = productSlice.actions;
export default productSlice.reducer;
