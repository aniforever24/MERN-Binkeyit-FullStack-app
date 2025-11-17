import {configureStore} from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import reloadReducer from './reload/reloadSlice';
import categoryReducer from './category/categorySlice';
import productReducer from './products/productSlice';
import cartReducer from './cart/cartSlice';
import addressReducer from './address/addressSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        reloadState: reloadReducer,
        category: categoryReducer,
        product: productReducer,
        cart: cartReducer,
        address: addressReducer,
    },
})