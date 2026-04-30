import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchAdminDashboardSummary = createAsyncThunk(
  "adminDashboard/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/admin/dashboard/summary", {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401 || response.status === 403) {
        return rejectWithValue("Unauthorized");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch dashboard summary");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  summary: null,
  loading: false,
  error: null,
};

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboardSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.summary;
      })
      .addCase(fetchAdminDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load dashboard";
      });
  },
});

export default adminDashboardSlice.reducer;
