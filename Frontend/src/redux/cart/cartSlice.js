import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addToCartItemsAPI, deleteCartItemAPI, getCartItemsAPI, updateCartItemAPI } from "../asyncApis";
import { notifyError, notifySuccess, notifyWarning } from "../../utils/foxToast";
import { isPlainObject } from "../../utils/UtilityFunctions";
import { calculateDiscountedPrice } from "../../utils/UtilityFunctions";

export const addToCartItems = createAsyncThunk('cart/addItems', addToCartItemsAPI)
export const fetchCartItems = createAsyncThunk('cart/getItems', getCartItemsAPI)
export const updateCartItem = createAsyncThunk('cart/update', updateCartItemAPI)
export const deleteCartItem = createAsyncThunk('cart/delete', deleteCartItemAPI)

const initialState = {
    cartItems: [],   // array of products added to cart
    totalItems: 0,
    totalValue: 0,  //  after discount
    totalActualValue: 0,    // before discount
    totalDiscount: 0,
    otherCharges: {         // Fixed values
        delivery: 25,
        handling: 10,
        plateform: 5,
    },
    status: {
        update: "idle",
        delete: "idle",
        fetch: "idle",
        add: "idle"
    },
    error: null
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setStatus: (state, action) => {
            if (!isPlainObject(action.payload)) {
                throw Error("payload must be an object")
            }
            const d = action.payload
            const v = ['idle', 'pending', 'success', 'failure']
            const k = ['update', 'delete', 'fetch', 'add']
            // Check for only permitted values and keys in payload
            const invalidKeys = Object.keys(d).some((key) => !k.includes(key))
            const invalidValues = Object.values(d).some((value) => !v.includes(value))
            if (invalidKeys || invalidValues) {
                throw Error(`payload can have only ${k.join(",")} as keys and ${v.join(",")} as values.`)
            }

            const prev = { ...state.status }
            state.status = { ...prev, ...d }
        },
        resetCart: (state) => {
            state.cartItems = [];
            state.totalItems = 0;
            state.totalValue = 0;
            state.totalActualValue = 0
            state.totalDiscount = 0
            state.otherStatus = {
                update: "idle",
                delete: "idle",
                fetch: "idle",
                add: "idle"
            }
        }
    },
    // Extra Reducers
    extraReducers: (builder) => {
        // Add to cart
        builder.addCase(addToCartItems.fulfilled, (state) => {
            notifySuccess('Item added successfully to cart ✔')
            state.status.add = "success"
        }).addCase(addToCartItems.pending, (state) => {
            state.status.add = "pending"
        }).addCase(addToCartItems.rejected, (state, action) => {
            notifyError(action.payload || 'Failed to add item to cart!')
            state.status.add = 'failure'
        });

        // Fetch cart items
        builder.addCase(fetchCartItems.fulfilled, (state, action) => {
            const items = action.payload.cartItems
            if (items[0]) {
                state.cartItems = [...items]
                state.totalItems = items.reduce((acc, item) => {
                    const q = item?.quantity;
                    return acc + q;
                }, 0)
                state.totalValue = items.reduce((acc, item) => {
                    const q = item?.quantity;
                    // total price after discount
                    const totalPrice = q * calculateDiscountedPrice(item?.product?.price, item?.product?.discount);

                    return acc + totalPrice
                }, 0)
                state.totalActualValue = items.reduce((acc, item) => {
                    const q = item?.quantity
                    // undiscounted actual price
                    const totalPrice = q * item?.product?.price

                    return acc + totalPrice
                }, 0)
                state.totalDiscount = items.reduce((acc, item) => {
                    const q = item?.quantity
                    const dis = (item?.product?.discount / 100) * item?.product?.price;
                    const totalDis = q * dis;
                    return acc + totalDis;
                }, 0)
            } else {
                state.cartItems = []
                state.totalItems = 0
                state.totalValue = 0
                state.totalActualValue = 0
            }
            state.status.fetch = 'success'
        }).addCase(fetchCartItems.pending, (state) => {
            state.status.fetch = 'pending'
        }).addCase(fetchCartItems.rejected, (state) => {
            notifyError('Error in fetching cart items')
            state.status.fetch = 'failure'
        });

        // Update cart
        builder.addCase(updateCartItem.fulfilled, (state, action) => {
            notifySuccess("Quantity updated ✔")
            state.status.update = 'success'
        }).addCase(updateCartItem.pending, (state) => {
            state.status.update = 'pending'
        }).addCase(updateCartItem.rejected, (state, action) => {
            notifyError(action.payload || "Error in updating item!")
            state.status.update = 'failure'
        });

        // Delete cart item
        builder.addCase(deleteCartItem.fulfilled, (state, action) => {
            notifyWarning("Item removed from cart!")
            state.status.delete = 'success'
        }).addCase(deleteCartItem.pending, (state) => {
            state.status.delete = 'pending'
        }).addCase(deleteCartItem.rejected, (state, action) => {
            notifyError(action.payload || "Error in deleting item!")
            state.status.delete = 'failure'
        })
    }
})

export const { setStatus, resetCart } = cartSlice.actions

export default cartSlice.reducer