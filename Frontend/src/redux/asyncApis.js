import SummaryApi from "../Common/SummaryApi"
import authAxiosInstance from "../config/authAxiosConfig"
import axiosErrorMsg from "../utils/axiosError"

export const addToCartItemsAPI = async ({ productId }, thunkApi) => {

    try {
        const response = await authAxiosInstance({
            ...SummaryApi.addToCart,
            data: { productId }
        })
        const data = response.data.data
        // console.log('From addToCartItemsAPI: ',response.data)
        return data

    } catch (error) {
        // axiosErrorMsg(error)
        const message = error?.response?.data?.message || error?.message || "Failed to add to cart"
        return thunkApi.rejectWithValue(message)
    }
}

export const getCartItemsAPI = async (_, thunkApi)=> {
    try {
        const response = await authAxiosInstance({
            ...SummaryApi.getCartItems,
        })
        const {data: responseData} = response
        const data = responseData.data
        if(responseData.success) {
            // console.log('feched cart data: ', data)
            return data
        }

    } catch (error) {
        const msg = error?.response?.data?.message || error?.message || "Failed to fetch cart items"
        return thunkApi.rejectWithValue(msg)
    }
}

// id is cart item id
export const updateCartItemAPI = async ({id, quantity} = {}, thunkApi) => {
    try {
        const response = await authAxiosInstance({
            ...SummaryApi.updateCartItem,
            data: {id, quantity}
        })
        const {data: responseData} = response
        // console.log('response data from cart update: ', responseData)
        
    } catch (error) {
        const msg = error?.response?.data?.message || error?.message || "Failed to update cart item!"
        return thunkApi.rejectWithValue(msg)
    }
}
// id is cart item id
export const deleteCartItemAPI = async ({id} = {}, thunkApi)=> {
 try {
    const response = await authAxiosInstance({
        ...SummaryApi.deleteCartItem,
        data: {id}
    });
    const {data: responseData} = response;
    // console.log('response from delete cart:', responseData)

 } catch (error) {
    const msg = error?.response?.data?.message || error?.message || "Failed to delete cart item"
    return thunkApi.rejectWithValue(msg)
 }   
}