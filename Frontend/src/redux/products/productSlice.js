import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosConfig';
import SummaryApi from '../../Common/SummaryApi';

// Create async thunk with axios to fetch products asynchronously
export const fetchProducts = createAsyncThunk('products/fetch', async ({ page = 1, limit = 10, sort = { createdAt: -1 }, query = {}, populate = [] } = {}, thunkAPI) => {
    try {
        const data = await getProducts({ page, limit, sort, query, populate }, thunkAPI)
        return data
    } catch (error) {
        console.log(error)
        const errorMsg = error?.message || "Error in fetching products!"
        return thunkAPI.rejectWithValue(errorMsg);
    }
});

const initialState = {
    products: [],
    productsSearched: [],
    productsSearchedStatus: 'idle',
    countAll: 0,
    countProductsSearched: 0,
    status: 'idle', // or 'loading' | 'success' | 'failed',
    error: null,
};

export const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload
        },
        setStatusIdle: (state) => {
            state.status = 'idle'
        },
        setProductsSearched: (state, action) => {
            state.productsSearched = action.payload
        },
        setProductsSearchedCount: (state, action) => {
            state.countProductsSearched = action.payload
        },
        setProductsSearchedStatus: (state, action) => {
            if (!action.payload) {
                state.productsSearchedStatus = 'idle';
                return
            } else if (typeof action.payload != 'string') {
                throw Error("Payload must be a 'string'")
            }
            const ar = ['pending', 'success', 'failure']
            const condition = ar.some((el) => el === action.payload)
            if (!condition) {
                throw Error(`Payload can only be ${ar.join(',')} `)
            }
            state.productsSearchedStatus = action.payload
        },
        setProductsSearchedStatusIdle: state => {
            state.productsSearchedStatus = "idle"
        }
    },
    // ExtraReducers
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = "success";
                // update state with db data
                state.products = action.payload.products;
                state.countAll = action.payload.count
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
})

export const { setProducts, setStatusIdle, setProductsSearched, setProductsSearchedCount, setProductsSearchedStatus, setProductsSearchedStatusIdle } = productSlice.actions;

export default productSlice.reducer;

// Async thunk functions
async function getProducts({ page, limit, sort, query, populate }, thunkAPI) {
    const { data: responseData } = await axiosInstance({
        ...SummaryApi.fetchProducts,
        data: { page, limit, sort, query, populate }
    });
    return responseData.data;
}