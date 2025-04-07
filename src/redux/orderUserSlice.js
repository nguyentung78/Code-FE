import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from '../api/index';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

// Lấy danh sách đơn hàng
export const fetchOrderHistory = createAsyncThunk('orderUser/fetchOrderHistory', async (_, { rejectWithValue }) => {
  try {
    const response = await BASE_URL.get('/user/history', {
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Lỗi khi lấy lịch sử đơn hàng');
  }
});

// Lấy chi tiết đơn hàng
export const fetchOrderDetail = createAsyncThunk('orderUser/fetchOrderDetail', async (serialNumber, { rejectWithValue }) => {
  try {
    const response = await BASE_URL.get(`/user/history/${serialNumber}`, {
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Lỗi khi lấy chi tiết đơn hàng');
  }
});

// Hủy đơn hàng
export const cancelOrder = createAsyncThunk('orderUser/cancelOrder', async (orderId, { rejectWithValue }) => {
  try {
    const response = await BASE_URL.put(`/user/history/${orderId}/cancel`, {}, {
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });
    return { orderId, message: response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Lỗi khi hủy đơn hàng');
  }
});

const orderUserSlice = createSlice({
  name: 'orderUser',
  initialState: {
    orders: [],
    orderDetail: null,
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
      // Fetch Order History
      .addCase(fetchOrderHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Fetch Order Detail
      .addCase(fetchOrderDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetail = action.payload;
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        const { orderId } = action.payload;
        const order = state.orders.find((o) => o.id === orderId);
        if (order) {
          order.status = 'CANCELLED';
        }
        if (state.orderDetail && state.orderDetail.id === orderId) {
          state.orderDetail.status = 'CANCELLED';
        }
        toast.success('Hủy đơn hàng thành công!');
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearError } = orderUserSlice.actions;
export default orderUserSlice.reducer;