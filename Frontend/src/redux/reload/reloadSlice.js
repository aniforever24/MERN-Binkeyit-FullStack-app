import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    reloaded: true,
}

export const reloadSlice = createSlice({
    name: 'reloaded',
    initialState,
    reducers: {
        setReloadedFalse: (state) => {
            state.reloaded = false;
        },
        setReloadedTrue: (state) => {
            state.reloaded = true;
        },
    }
})

export const { setReloadedFalse, setReloadedTrue } = reloadSlice.actions;

export default reloadSlice.reducer;