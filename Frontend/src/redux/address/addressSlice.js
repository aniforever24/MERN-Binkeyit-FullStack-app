import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { addAddressAPI, deleteAddressAPI, fetchAddressAPI, updateAddressAPI } from '../asyncApis';
import { notifyError, notifySuccess } from '../../utils/foxToast';

export const fetchAddress = createAsyncThunk('address/fetchAddress', fetchAddressAPI);
export const addAddress = createAsyncThunk('address/addAddress', addAddressAPI);
export const deleteAddress = createAsyncThunk('address/deleteAddress', deleteAddressAPI);
export const updateAddress = createAsyncThunk('address/updateAddress', updateAddressAPI);

const initialState = {
    addresses: [],
    defaultAddress: null,
    count: 0,
    status: {
        fetchAddress: 'idle',
        addAddress: "idle",
        deleteAddress: "idle",
        updateAddress: "idle"
    }
}

export const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder

            // fetchAddress
            .addCase(fetchAddress.pending, (state) => {
                state.status.fetchAddress = 'pending'
            })
            .addCase(fetchAddress.fulfilled, (state, action) => {
                const allAddress = action.payload.addresses 

                state.addresses = allAddress
                state.count = action.payload.count

                // Set default address
                let defaultAddr = allAddress.filter((addr) => addr?.isDefault)
                if (defaultAddr?.length === 0) {
                    defaultAddr = allAddress[0]
                }

                state.defaultAddress = defaultAddr;
                state.status.fetchAddress = 'success'
            })
            .addCase(fetchAddress.rejected, (state) => {
                state.status.fetchAddress = 'failure'
                notifyError('Error in fetching user address!')
            })

            // addAddress
            .addCase(addAddress.pending, (state, action) => {
                state.status.addAddress = "pending";
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.status.addAddress = "success";
                notifySuccess("Address added successfully.")
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.status.addAddress = "failure";
                notifyError(action.payload || "There is an error in adding your address!")
            })

            // deleteAddress
            .addCase(deleteAddress.pending, (state, action) => {
                state.status.deleteAddress = "pending";
            })
            .addCase(deleteAddress.fulfilled, (state) => {
                state.status.deleteAddress = "success";
                notifySuccess("Address deleted successfully.")
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.status.deleteAddress = "failure";
                notifyError("Error in deleting address.")
            })

            // updateAddress
            .addCase(updateAddress.pending, (state) => {
                state.status.updateAddress = "pending";
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.status.updateAddress = "success";
                state.defaultAddress = action.payload?.data
                notifySuccess(action.payload?.message)

            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.status.updateAddress = "failure";
                notifyError("Error in updating your default address! Try again.")
            })
    }
});

export const { } = addressSlice.actions;

export default addressSlice.reducer