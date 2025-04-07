import { createSlice } from '@reduxjs/toolkit';

const guestCartSlice = createSlice({
  name: 'guestCart',
  initialState: {
    items: JSON.parse(localStorage.getItem('guestCart')) || [],
  },
  reducers: {
    addToGuestCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find((item) => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
      localStorage.setItem('guestCart', JSON.stringify(state.items));
    },
    updateGuestQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.product.id !== productId);
      } else {
        const item = state.items.find((item) => item.product.id === productId);
        if (item) item.quantity = quantity;
      }
      localStorage.setItem('guestCart', JSON.stringify(state.items));
    },
    removeFromGuestCart: (state, action) => {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
      localStorage.setItem('guestCart', JSON.stringify(state.items));
    },
    clearGuestCart: (state) => {
      state.items = [];
      localStorage.removeItem('guestCart');
    },
  },
});

export const { addToGuestCart, updateGuestQuantity, removeFromGuestCart, clearGuestCart } = guestCartSlice.actions;
export default guestCartSlice.reducer;