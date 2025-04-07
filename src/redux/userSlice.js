import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL_ADMIN } from "../api/index"; // Sử dụng BASE_URL_ADMIN thay vì axios
import Cookies from "js-cookie"; // Thêm import Cookies

export const getUsersThunk = createAsyncThunk(
  "getUsers",
  async ({ page, size, keyword = "" }, { rejectWithValue }) => {
    const pageIndex = page - 1;
    try {
      const response = await BASE_URL_ADMIN.get(
        `/users/search?page=${pageIndex}&size=${size}&keyword=${keyword}`,
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

export const toggleUserStatusThunk = createAsyncThunk(
  "users/toggleStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await BASE_URL_ADMIN.put(`/users/${id}/status`, {}, {
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

export const updateUserRolesThunk = createAsyncThunk(
  "users/updateRoles",
  async ({ id, roles }, { rejectWithValue }) => {
    try {
      const response = await BASE_URL_ADMIN.put(`/users/${id}/roles`, { roles }, {
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

const userSlice = createSlice({
  name: "userSlice",
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
      // Get Users
      .addCase(getUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.content;
        state.total = action.payload.totalElements;
      })
      .addCase(getUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // Toggle Status
      .addCase(toggleUserStatusThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleUserStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) state.data[index] = action.payload;
      })
      .addCase(toggleUserStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // Update Roles
      .addCase(updateUserRolesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserRolesThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) state.data[index] = action.payload;
      })
      .addCase(updateUserRolesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export const { setKeyword } = userSlice.actions;
export default userSlice.reducer;