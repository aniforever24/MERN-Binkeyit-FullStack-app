import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userDetails: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserDetails: (state, action) => {
            state.userDetails = action.payload;
        }
    }
})

export const { setUserDetails } = userSlice.actions;

export default userSlice.reducer