import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../services/userService';

// Thunk để lấy thông tin tài khoản
export const fetchUserProfile = createAsyncThunk('account/fetchUserProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await userService.getUserProfile();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

// Thunk để cập nhật thông tin tài khoản
export const updateUserProfile = createAsyncThunk('account/updateUserProfile', async (data, { rejectWithValue }) => {
  try {
    const response = await userService.updateUserProfile(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

// Thunk để đổi mật khẩu
export const changePassword = createAsyncThunk('account/changePassword', async (data, { rejectWithValue }) => {
  try {
    const response = await userService.changePassword(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

// Thunk để quản lý địa chỉ
export const fetchAddresses = createAsyncThunk('account/fetchAddresses', async (_, { rejectWithValue }) => {
  try {
    const response = await userService.getUserAddresses();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const addAddress = createAsyncThunk('account/addAddress', async (data, { rejectWithValue }) => {
  try {
    const response = await userService.addAddress(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const deleteAddress = createAsyncThunk('account/deleteAddress', async (addressId, { rejectWithValue }) => {
  try {
    const response = await userService.deleteAddress(addressId);
    return { addressId, message: response.data };
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

const accountSlice = createSlice({
  name: 'account',
  initialState: {
    profile: null,
    addresses: [],
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
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = { ...state.profile, ...action.payload };
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.addresses = action.payload;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter((addr) => addr.id !== action.payload.addressId);
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = accountSlice.actions;
export default accountSlice.reducer;