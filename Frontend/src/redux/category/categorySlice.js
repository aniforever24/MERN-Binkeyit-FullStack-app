import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";
import authAxiosInstance from "../../config/authAxiosConfig";
import SummaryApi from "../../Common/SummaryApi";

// Async thunk to fetch subCategories
export const fetchSubCategories = createAsyncThunk('subCategories/fetch', async ({page = 1, limit = 10, sort = {createdAt: -1}, query = {}, populate = true} = {}, {signal}) => {
    const response = await axiosInstance({
        ...SummaryApi.fetchSubCategory,
        data: {page, limit, sort, query, populate},
        signal
    })
    return {data: response.data.data, countAll: response.data.totalNo};
});
// Async thunk to fetch categories
export const fetchCategories = createAsyncThunk('categories/fetch', async ({sort = {name: 1}, find = {}} = {}) => {
    const { data: responseData } = await authAxiosInstance({
        ...SummaryApi.fetchCategories,
        data: {sort, find}
    })
    return responseData.data.allCategories;
})

const initialState = {
    categories: [],
    subCategories: [],
    status: { categories: "idle", subCategories: "idle" },
    error: { categories: null, subCategories: null },
    countAll: {categories: null, subCategories: null},
}

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
        setSubCategories: (state, action) => {
            state.subCategories = action.payload;
        }
    },
    extraReducers: (builders) => {
        builders
        // Logic for handling fetching subCategories
            .addCase(fetchSubCategories.pending, (state) => {
                state.status.subCategories = "loading";
            })
            .addCase(fetchSubCategories.fulfilled, (state, action) => {
                state.status.subCategories = "succeeded";                
                state.countAll.subCategories = action.payload.countAll;
                state.subCategories = action.payload.data   // update state with db data
            })
            .addCase(fetchSubCategories.rejected, (state, action) => {
                state.status.subCategories = "failed";
                state.error.subCategories = action?.error?.message
            })
        // Logic for handling fetching Categories
            .addCase(fetchCategories.pending, (state)=> {
                state.status.categories = "loading"
            })
            .addCase(fetchCategories.fulfilled, (state, action)=> {
                state.status.categories = 'succeeded'
                state.categories = action.payload;  // update state with db data
            })
            .addCase(fetchCategories.rejected, (state, action)=> {
                state.status.categories = "failed"
                state.error.categories = action?.error?.message;
            })
    }
})

export const { setCategories, setSubCategories } = categorySlice.actions

export default categorySlice.reducer