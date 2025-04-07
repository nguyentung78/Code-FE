import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL_ADMIN } from "../api/index"; // Sử dụng BASE_URL_ADMIN thay vì axios
import Cookies from "js-cookie"; // Thêm import Cookies

export const getProductsThunk = createAsyncThunk(
  "getProducts",
  async ({ page, size, keyword = "" }, { rejectWithValue }) => {
    const pageIndex = page - 1;
    try {
      const response = await BASE_URL_ADMIN.get(
        `/products/search?page=${pageIndex}&size=${size}&keyword=${keyword}`,
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

export const addProductThunk = createAsyncThunk(
  "product/addProduct",
  async (product, { rejectWithValue }) => {
    try {
      const response = await BASE_URL_ADMIN.post("/products", product, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${Cookies.get("token")}`, // Thêm token thủ công
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateProductThunk = createAsyncThunk(
  "product/updateProduct",
  async ({ id, product }, { rejectWithValue }) => {
    try {
      const response = await BASE_URL_ADMIN.put(`/products/${id}`, product, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${Cookies.get("token")}`, // Thêm token thủ công
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteProductThunk = createAsyncThunk(
  "deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await BASE_URL_ADMIN.delete(`/products/${id}`, {
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

const productSlice = createSlice({
  name: "productSlice",
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
      .addCase(getProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.content;
        state.total = action.payload.totalElements;
      })
      .addCase(getProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(addProductThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(addProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(updateProductThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((prod) => prod.id === action.payload.id);
        if (index !== -1) state.data[index] = action.payload;
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      .addCase(deleteProductThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((prod) => prod.id !== action.payload);
      })
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { setKeyword, clearProducts } = productSlice.actions;
export default productSlice.reducer;