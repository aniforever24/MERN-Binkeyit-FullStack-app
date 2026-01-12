import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { fetchOrderAPI } from "../asyncApis";

export const fetchOrders = createAsyncThunk('order/fetch-orders', fetchOrderAPI);

const initialState = {
    orders: [],
    countOfOrders: 0,
    status: "idle"      // "pending" || "success" || "failure"
};

export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        setStatusIdle: (state)=> {
            state.status = "idle"
        }
    },
    extraReducers: (builder)=> {
        builder
            .addCase(fetchOrders.fulfilled, (state, action)=> {
                // console.log('action:', action)
                state.orders = action.payload.orders;
                state.countOfOrders = action.payload.countOfOrders;
                state.status = 'success';
            })
            .addCase(fetchOrders.pending, (state, action)=> {
                state.status = 'pending'
            })
            .addCase(fetchOrders.rejected, (state, action)=> {
                state.status = 'failure'

            });
        
    }
});


export const { setStatusIdle } = orderSlice.actions;

export default orderSlice.reducer