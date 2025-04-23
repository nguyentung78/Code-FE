import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL, BASE_URL_ADMIN } from "../api/index"; // Thêm BASE_URL cho API công khai
import Cookies from "js-cookie";

// Thunk cho danh sách sản phẩm quản trị
export const getProductsThunk = createAsyncThunk(
  "getProducts",
  async ({ page, size, keyword = "" }, { rejectWithValue }) => {
    const pageIndex = page - 1;
    try {
      const response = await BASE_URL_ADMIN.get(
        `/products/search?page=${pageIndex}&size=${size}&keyword=${keyword}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Thunk cho danh sách sản phẩm công khai
export const getPublicProductsThunk = createAsyncThunk(
  "getPublicProducts",
  async ({ page, size, categoryId = null }, { rejectWithValue }) => {
    const pageIndex = page - 1;
    try {
      const url = categoryId
        ? `/public/products/categories/${categoryId}?page=${pageIndex}&size=${size}`
        : `/public/products?page=${pageIndex}&size=${size}`;
      const response = await BASE_URL.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Thunk cho danh sách sản phẩm nổi bật
export const getFeaturedProductsThunk = createAsyncThunk(
  "getFeaturedProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await BASE_URL.get("/public/products/featured-products");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Thunk thêm sản phẩm
export const addProductThunk = createAsyncThunk(
  "product/addProduct",
  async (product, { rejectWithValue }) => {
    try {
      const response = await BASE_URL_ADMIN.post("/products", product, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Thunk cập nhật sản phẩm
export const updateProductThunk = createAsyncThunk(
  "product/updateProduct",
  async ({ id, product }, { rejectWithValue }) => {
    try {
      const response = await BASE_URL_ADMIN.put(`/products/${id}`, product, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Thunk xóa sản phẩm
export const deleteProductThunk = createAsyncThunk(
  "deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await BASE_URL_ADMIN.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
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
    data: [], // Danh sách sản phẩm (quản trị hoặc công khai)
    featured: [], // Danh sách sản phẩm nổi bật
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
      // Quản trị: Lấy sản phẩm
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
      // Công khai: Lấy sản phẩm
      .addCase(getPublicProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPublicProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.content || action.payload; // Xử lý trường hợp theo danh mục
        state.total = action.payload.totalElements || action.payload.length;
      })
      .addCase(getPublicProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // Công khai: Lấy sản phẩm nổi bật
      .addCase(getFeaturedProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeaturedProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.featured = action.payload;
      })
      .addCase(getFeaturedProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // Thêm sản phẩm
      .addCase(addProductThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload); // Thêm sản phẩm mới vào danh sách
        if (action.payload.featured) {
          state.featured.push(action.payload); // Thêm vào danh sách nổi bật nếu featured: true
        }
      })
      .addCase(addProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // Cập nhật sản phẩm
      .addCase(updateProductThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((prod) => prod.id === action.payload.id);
        if (index !== -1) state.data[index] = action.payload;
        const featuredIndex = state.featured.findIndex((prod) => prod.id === action.payload.id);
        if (action.payload.featured && featuredIndex === -1) {
          state.featured.push(action.payload);
        } else if (!action.payload.featured && featuredIndex !== -1) {
          state.featured.splice(featuredIndex, 1);
        }
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // Xóa sản phẩm
      .addCase(deleteProductThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((prod) => prod.id !== action.payload);
        state.featured = state.featured.filter((prod) => prod.id !== action.payload);
      })
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { setKeyword } = productSlice.actions;
export default productSlice.reducer;