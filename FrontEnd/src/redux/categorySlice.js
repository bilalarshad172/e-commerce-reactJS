import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// API URL (replace with your API endpoint)

export const fetchCategories = createAsyncThunk(
    "categories/fetchCategories",
    async (_, { rejectWithValue }) => {
        try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
            return data; // Pass the fetched
        } catch (error) {
            return rejectWithValue(error.message); // Pass the error to Redux
        }
    }
);

export const addCategory = createAsyncThunk(
    "categories/addCategory",
    async (categoryData, { rejectWithValue }) => {
        try {
        const response = await fetch("/api/categories", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(categoryData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to add category");
        }
        return await response.json();
        } catch (error) {
        return rejectWithValue(error.message);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    "categories/deleteCategory",
    async (id, { rejectWithValue }) => {
        try {
        const response = await fetch(`/api/categories/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete category");
        return id; // Return the ID of the deleted category
        } catch (error) {
        return rejectWithValue(error.message);
        }
    }
);

export const fetchCategoryById = createAsyncThunk(
    "categories/fetchCategoryById",
    async (id, { rejectWithValue }) => {
        try {
        const response = await fetch(`/api/categories/${id}`);
        if (!response.ok) throw new Error("Failed to fetch category");
        const data = await response.json();
        return data;
        } catch (error) {
        return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    categories: [],
    selectedCategory: null,
    loading: false,
    error: null,
};

const categorySlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        clearSelectedCategory: (state) => {
            state.selectedCategory = null; // Clear selected category when needed
        },
    },
    extraReducers: (builder) => {
        builder
        // fetch all categories
        .addCase(fetchCategories.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchCategories.fulfilled, (state, action) => {
            state.categories = action.payload;
            state.loading = false;
        })
        .addCase(fetchCategories.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        // Add a new category
        .addCase(addCategory.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addCategory.fulfilled, (state, action) => {
            state.categories.push(action.payload);
            state.loading = false;
        })
        .addCase(addCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        // Delete a category
        .addCase(deleteCategory.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteCategory.fulfilled, (state, action) => {
            state.categories = state.categories.filter(
            (category) => category._id !== action.payload
            );
            state.loading = false;
        })
        .addCase(deleteCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        // Fetch a category by ID
        .addCase(fetchCategoryById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchCategoryById.fulfilled, (state, action) => {
            state.selectedCategory = action.payload;
            state.loading = false;
        })
        .addCase(fetchCategoryById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});
 
export const { clearSelectedCategory } = categorySlice.actions;

export default categorySlice.reducer;
