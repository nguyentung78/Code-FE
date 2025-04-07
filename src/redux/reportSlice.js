import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL_ADMIN } from "../api/index"; // Sử dụng BASE_URL_ADMIN thay vì axios
import Cookies from "js-cookie"; // Thêm import Cookies

export const fetchAllReportsThunk = createAsyncThunk(
  "reports/fetchAllReports",
  async ({ fromDate, toDate }, { rejectWithValue }) => {
    try {
      const [
        revenueRes,
        invoicesRes,
        categoryRes,
        bestSellerRes,
        topCustomerRes,
        newAccountsRes,
      ] = await Promise.all([
        BASE_URL_ADMIN.get(
          `/reports/sales-revenue-over-time?fromDate=${fromDate}&toDate=${toDate}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`, // Thêm token thủ công
            },
          }
        ),
        BASE_URL_ADMIN.get(
          `/reports/invoices-over-time?fromDate=${fromDate}&toDate=${toDate}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`, // Thêm token thủ công
            },
          }
        ),
        BASE_URL_ADMIN.get("/reports/revenue-by-category", {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`, // Thêm token thủ công
          },
        }),
        BASE_URL_ADMIN.get("/reports/best-seller-products", {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`, // Thêm token thủ công
          },
        }),
        BASE_URL_ADMIN.get("/reports/top-spending-customer", {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`, // Thêm token thủ công
          },
        }),
        BASE_URL_ADMIN.get("/reports/top-new-accounts-this-month", {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`, // Thêm token thủ công
          },
        }),
      ]);

      return {
        revenueOverTime: (revenueRes.data.timeSeriesData || []).map((item) => ({
          date: item.date || "Unknown",
          value: item.value || 0,
        })),
        invoicesOverTime: (invoicesRes.data.timeSeriesData || []).map((item) => ({
          date: item.date || "Unknown",
          value: item.value || 0,
        })),
        revenueByCategory: (categoryRes.data.topItems || []).map((item) => ({
          name: item.name || "Unknown",
          value: item.value || 0,
        })),
        bestSellerProducts: (bestSellerRes.data.topItems || []).map((item) => ({
          name: item.name || "Unknown",
          value: item.value || 0,
        })),
        topSpendingCustomers: (topCustomerRes.data.topItems || []).map((item) => ({
          name: item.name || "Unknown",
          value: item.value || 0,
        })),
        newAccounts: newAccountsRes.data.newAccounts || [],
        totalRevenue: revenueRes.data.totalRevenue || 0,
        totalOrders: invoicesRes.data.totalOrders || 0,
        totalNewAccounts: newAccountsRes.data.totalNewAccounts || 0,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const reportSlice = createSlice({
  name: "reportSlice",
  initialState: {
    revenueOverTime: [],
    invoicesOverTime: [],
    revenueByCategory: [],
    bestSellerProducts: [],
    topSpendingCustomers: [],
    newAccounts: [],
    totalRevenue: 0,
    totalOrders: 0,
    totalNewAccounts: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllReportsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReportsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.revenueOverTime = action.payload.revenueOverTime;
        state.invoicesOverTime = action.payload.invoicesOverTime;
        state.revenueByCategory = action.payload.revenueByCategory;
        state.bestSellerProducts = action.payload.bestSellerProducts;
        state.topSpendingCustomers = action.payload.topSpendingCustomers;
        state.newAccounts = action.payload.newAccounts;
        state.totalRevenue = action.payload.totalRevenue;
        state.totalOrders = action.payload.totalOrders;
        state.totalNewAccounts = action.payload.totalNewAccounts;
      })
      .addCase(fetchAllReportsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Có lỗi xảy ra khi lấy dữ liệu báo cáo";
      });
  },
});

export default reportSlice.reducer;