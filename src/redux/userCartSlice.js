import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from '../api/index';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

// Fetch giỏ hàng từ DB
export const fetchUserCart = createAsyncThunk('userCart/fetchUserCart', async (_, { rejectWithValue }) => {
  try {
    const response = await BASE_URL.get('/user/cart/list', {
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });
    const mappedData = response.data.map(item => ({
      cartItemId: item.id,
      product: {
        id: item.productId,
        productName: item.productName,
        unitPrice: item.unitPrice,
        image: item.image,
        stockQuantity: item.stockQuantity || 0,
      },
      quantity: item.quantity,
    }));
    return mappedData;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy giỏ hàng');
  }
});

// Thêm sản phẩm
export const addToUserCart = createAsyncThunk('userCart/addToUserCart', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const response = await BASE_URL.post('/user/cart/add', { productId, quantity }, {
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });
    // Nếu API trả về toàn bộ danh sách
    if (Array.isArray(response.data)) {
      const mappedData = response.data.map(item => ({
        cartItemId: item.id,
        product: {
          id: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          image: item.image,
          stockQuantity: item.stockQuantity || 0,
        },
        quantity: item.quantity,
      }));
      return mappedData;
    }
    // Nếu API chỉ trả về item vừa thêm
    else if (response.data && response.data.id) {
      return {
        cartItemId: response.data.id,
        product: {
          id: response.data.productId,
          productName: response.data.productName,
          unitPrice: response.data.unitPrice,
          image: response.data.image,
          stockQuantity: response.data.stockQuantity || 0,
        },
        quantity: response.data.quantity,
      };
    }
    // Nếu API không trả về dữ liệu, gọi lại fetchUserCart
    else {
      const fetchResponse = await BASE_URL.get('/user/cart/list', {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
      const mappedData = fetchResponse.data.map(item => ({
        cartItemId: item.id,
        product: {
          id: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          image: item.image,
          stockQuantity: item.stockQuantity || 0,
        },
        quantity: item.quantity,
      }));
      return mappedData;
    }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Lỗi khi thêm vào giỏ hàng');
  }
});

// Cập nhật số lượng
export const updateUserCartQuantity = createAsyncThunk('userCart/updateUserCartQuantity', async ({ cartItemId, quantity }, { rejectWithValue }) => {
  try {
    const response = await BASE_URL.put(`/user/cart/items/${cartItemId}`, { quantity }, {
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });
    if (Array.isArray(response.data)) {
      const mappedData = response.data.map(item => ({
        cartItemId: item.id,
        product: {
          id: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          image: item.image,
          stockQuantity: item.stockQuantity || 0,
        },
        quantity: item.quantity,
      }));
      return mappedData;
    } else if (response.data && response.data.id) {
      return {
        cartItemId: response.data.id,
        product: {
          id: response.data.productId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          image: item.image,
          stockQuantity: item.stockQuantity || 0,
        },
        quantity: response.data.quantity,
      };
    } else {
      const fetchResponse = await BASE_URL.get('/user/cart/list', {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
      const mappedData = fetchResponse.data.map(item => ({
        cartItemId: item.id,
        product: {
          id: item.productId,
          productName: item.productName,
          unitPrice: item.unitPrice,
          image: item.image,
          stockQuantity: item.stockQuantity || 0,
        },
        quantity: item.quantity,
      }));
      return mappedData;
    }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Lỗi khi cập nhật số lượng');
  }
});

// Xóa sản phẩm
export const removeFromUserCart = createAsyncThunk('userCart/removeFromUserCart', async (cartItemId, { rejectWithValue }) => {
  try {
    await BASE_URL.delete(`/user/cart/items/${cartItemId}`, {
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });
    return cartItemId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa sản phẩm');
  }
});

// Xóa toàn bộ
export const clearUserCart = createAsyncThunk('userCart/clearUserCart', async (_, { rejectWithValue }) => {
  try {
    await BASE_URL.delete('/user/cart/clear', {
      headers: { Authorization: `Bearer ${Cookies.get('token')}` },
    });
    return [];
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa giỏ hàng');
  }
});

const userCartSlice = createSlice({
  name: 'userCart',
  initialState: {
    items: [],
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
      // Fetch User Cart
      .addCase(fetchUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Add to Cart
      .addCase(addToUserCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToUserCart.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.items = action.payload; // API trả về toàn bộ danh sách
        } else {
          // API trả về item vừa thêm
          state.items.push(action.payload);
        }
        toast.success('Đã thêm vào giỏ hàng!');
      })
      .addCase(addToUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Update Quantity
      .addCase(updateUserCartQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        } else {
          const index = state.items.findIndex(item => item.cartItemId === action.payload.cartItemId);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      })
      .addCase(updateUserCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Remove from Cart
      .addCase(removeFromUserCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromUserCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.cartItemId !== action.payload);
        toast.success('Đã xóa khỏi giỏ hàng!');
      })
      .addCase(removeFromUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Clear Cart
      .addCase(clearUserCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearUserCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        toast.success('Đã xóa toàn bộ giỏ hàng!');
      })
      .addCase(clearUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearError } = userCartSlice.actions;
export default userCartSlice.reducer;