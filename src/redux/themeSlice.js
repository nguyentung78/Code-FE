import { createSlice } from "@reduxjs/toolkit";

// Lấy theme từ localStorage (nếu có), mặc định là "light"
const initialTheme = localStorage.getItem("theme") || "light";

const themeSlice = createSlice({
  name: "themeSlice",
  initialState: {
    theme: initialTheme, // "light" hoặc "dark"
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme); // Lưu theme vào localStorage
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("theme", state.theme);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;