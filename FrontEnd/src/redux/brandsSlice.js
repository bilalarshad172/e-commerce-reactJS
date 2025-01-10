import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// API URL (replace with your API endpoint)
export const fetchBrands = createAsyncThunk(
  "brands/fetchBrands",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/brands");
      if (!response.ok) throw new Error("Failed to fetch brands");
      const data = await response.json();
      return data; // Pass the fetched
    } catch (error) {
      return rejectWithValue(error.message); // Pass the error to Redux
    }
  }
);

// Add a brand
export const addBrand = createAsyncThunk(
  "brands/addBrand",
  async (brandData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(brandData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add brand");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//delete a brand
export const deleteBrand = createAsyncThunk(
  "brands/deleteBrand",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/brands/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete brand");
      return id; // Return the ID of the deleted brand
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch a brand by ID
export const fetchBrandById = createAsyncThunk(
  "brands/fetchBrandById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/brands/${id}`);
      if (!response.ok) throw new Error("Failed to fetch brand");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update a brand
export const updateBrand = createAsyncThunk(
  "brands/updateBrand",
  async ({ id, title }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/brands/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) throw new Error("Failed to update brand");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  brands: [],
  loading: false,
  error: null,
};

// Brand slice

const brandsSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    clearBrands: (state) => {
      state.brands = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch all brands
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload.brands;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // add a brand
      .addCase(addBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.brands.push(action.payload.newBrand);
      })
      .addCase(addBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.brands = state.brands.filter(
          (brand) => brand._id !== action.payload
        );
      })
      .addCase(fetchBrandById.fulfilled, (state, action) => {
        state.brand = action.payload; // Store the fetched brand
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        state.brands = state.brands.map((brand) =>
          brand._id === action.payload._id ? action.payload : brand
        );
      });
  },
});

// Export actions

export const { clearBrands } = brandsSlice.actions;

// Export reducer

export default brandsSlice.reducer;
