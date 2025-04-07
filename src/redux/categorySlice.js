import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL_ADMIN } from "../api/index"; // Sử dụng BASE_URL_ADMIN thay vì axios
import Cookies from "js-cookie";

export const getCategoriesThunk = createAsyncThunk(
  "getCategories",
  async ({ page, size, keyword = "" }, { rejectWithValue }) => {
    const pageIndex = page - 1;
    try {
      const response = await BASE_URL_ADMIN.get(
        `/categories/search?page=${pageIndex}&size=${size}&keyword=${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`, // Thêm token thủ công
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const addCategoryThunk = createAsyncThunk(
  "category/addCategory",
  async (category, { rejectWithValue }) => {
    try {
      const response = await BASE_URL_ADMIN.post("/categories", category, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`, // Thêm token thủ công
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateCategoryThunk = createAsyncThunk(
  "category/updateCategory",
  async ({ id, category }, { rejectWithValue }) => {
    try {
      const response = await BASE_URL_ADMIN.put(`/categories/${id}`, category, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`, // Thêm token thủ công
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteCategoryThunk = createAsyncThunk(
  "deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await BASE_URL_ADMIN.delete(`/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`, // Thêm token thủ công
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const categorySlice = createSlice({
  name: "categorySlice",
  initialState: {
    data: [],
    total: 0,
    loading: false,
    error: null,
    keyword: "",
  },
  reducers: {
    setKeyword: (state, action) => {
      state.keyword = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Categories
      .addCase(getCategoriesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategoriesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.content;
        state.total = action.payload.totalElements;
      })
      .addCase(getCategoriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // Add Category
      .addCase(addCategoryThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCategoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(addCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update Category
      .addCase(updateCategoryThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((cat) => cat.categoryId === action.payload.categoryId);
        if (index !== -1) state.data[index] = action.payload;
      })
      .addCase(updateCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete Category
      .addCase(deleteCategoryThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((cat) => cat.categoryId !== action.payload);
      })
      .addCase(deleteCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setKeyword, clearCategories } = categorySlice.actions;
export default categorySlice.reducer;