import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from '../api/index';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export const fetchWishList = createAsyncThunk('wishList/fetchWishList', async ({ page = 0, size = 10 }, { rejectWithValue }) => {
  try {
    const response = await BASE_URL.get(`/user/wish-list?page=${page}&size=${size}`, {
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });
    return response.data; // Trả về { content, page, size, totalElements, totalPages }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy danh sách yêu thích');
  }
});

export const addToWishList = createAsyncThunk('wishList/addToWishList', async (productId, { rejectWithValue }) => {
  try {
    const response = await BASE_URL.post(`/user/wish-list/${productId}`, {}, {
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });
    return response.data; // Trả về WishListDTO
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Lỗi khi thêm vào danh sách yêu thích');
  }
});

export const removeFromWishList = createAsyncThunk('wishList/removeFromWishList', async (productId, { rejectWithValue }) => {
  try {
    await BASE_URL.delete(`/user/wish-list/${productId}`, {
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });
    return productId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa khỏi danh sách yêu thích');
  }
});

const wishListSlice = createSlice({
  name: 'wishList',
  initialState: {
    wishList: [],
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishList.fulfilled, (state, action) => {
        state.loading = false;
        state.wishList = action.payload.content;
        state.page = action.payload.page;
        state.size = action.payload.size;
        state.totalElements = action.payload.totalElements;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchWishList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(addToWishList.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWishList.fulfilled, (state, action) => {
        state.loading = false;
        state.wishList.push(action.payload);
        state.totalElements += 1;
      })
      .addCase(addToWishList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(removeFromWishList.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromWishList.fulfilled, (state, action) => {
        state.loading = false;
        state.wishList = state.wishList.filter((item) => item.productId !== action.payload);
        state.totalElements -= 1;
      })
      .addCase(removeFromWishList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearError } = wishListSlice.actions;
export default wishListSlice.reducer;