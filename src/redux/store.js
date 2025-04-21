import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from './categorySlice';
import productReducer from './productSlice';
import orderReducer from './orderSlice';
import userReducer from './userSlice';
import reportReducer from './reportSlice';
import themeReducer from './themeSlice';
import userCartReducer from './userCartSlice';
import accountReducer from './accountSlice';
import orderUserReducer from './orderUserSlice';
import wishListReducer from './wishListSlice'; 

export default configureStore({
  reducer: {
    categories: categoryReducer,
    products: productReducer,
    orders: orderReducer,
    users: userReducer,
    reports: reportReducer,
    theme: themeReducer,
    userCart: userCartReducer,
    account: accountReducer,
    orderUser: orderUserReducer,
    wishList: wishListReducer, 
  },
});