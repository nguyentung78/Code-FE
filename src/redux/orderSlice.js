import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL_ADMIN } from '../api/index'; // Sử dụng BASE_URL_ADMIN thay vì axios
import { toast } from 'react-toastify';
import Cookies from "js-cookie"; // Thêm import Cookies

export const getOrdersThunk = createAsyncThunk(
  "orders/getOrders",
  async ({ page, size, direction, sortBy }, { rejectWithValue }) => {
    try {
      const response = await BASE_URL_ADMIN.get("/orders", {
        params: { page, size, direction, sortBy },
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`, // Thêm token thủ công
        },
      });
      return {
        content: response.data.content,
        totalElements: response.data.totalElements,
      };
    } catch (error) {
      const message = error.response?.data?.message || "Lỗi khi lấy danh sách đơn hàng";
      return rejectWithValue(message);
    }
  }
);

export const getOrdersByStatusThunk = createAsyncThunk(
  "orders/getOrdersByStatus",
  async ({ orderStatus, page, size }, { rejectWithValue }) => {
    try {
      const response = await BASE_URL_ADMIN.get(`/orders/status/${orderStatus}`, {
        params: { page, size },
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`, // Thêm token thủ công
        },
      });
      return {
        content: response.data.content,
        totalElements: response.data.totalElements,
      };
    } catch (error) {
      const message = error.response?.data?.message || "Lỗi khi lấy danh sách đơn hàng theo trạng thái";
      return rejectWithValue(message);
    }
  }
);

export const getOrderDetailThunk = createAsyncThunk(
  "orders/getOrderDetail",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await BASE_URL_ADMIN.get(`/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`, // Thêm token thủ công
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Lỗi khi lấy chi tiết đơn hàng";
      return rejectWithValue(message);
    }
  }
);

export const updateOrderStatusThunk = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await BASE_URL_ADMIN.put(
        `/orders/${orderId}/status`,
        { orderStatus: status },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`, // Thêm token thủ công
          },
        }
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Lỗi khi cập nhật trạng thái đơn hàng";
      return rejectWithValue(message);
    }
  }
);

// Khởi tạo state ban đầu
const initialState = {
  orders: [],
  orderDetail: null,
  loading: false,
  error: null,
  totalElements: 0,
};

// Tạo slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderDetail: (state) => {
      state.orderDetail = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.content;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(getOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(getOrdersByStatusThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersByStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.content;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(getOrdersByStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(getOrderDetailThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetailThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetail = action.payload;
      })
      .addCase(getOrderDetailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      .addCase(updateOrderStatusThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;
        const index = state.orders.findIndex((order) => order.id === updatedOrder.id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
        toast.success('Cập nhật trạng thái đơn hàng thành công!');
      })
      .addCase(updateOrderStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { resetOrderDetail, clearError } = orderSlice.actions;
export default orderSlice.reducer;