
const reqConfig = (url, method)=> {
    const obj = { url: url, method: method };
    return obj
}

const SummaryApi = {
    signup: reqConfig("/api/user/signup", 'post'),
    login: reqConfig("/api/user/login", 'post'),
    refresh_Token: reqConfig('/auth/refresh-token', 'post'),
    user_details: reqConfig('/auth/user/user-details', "post"),
    logout: reqConfig('/auth/user/logout', 'put'),
    upload_avatar: reqConfig('/auth/user/upload-avatar', 'put'),
    update_userDetails: reqConfig('/auth/user/update-user-details', 'put'),
    forgotPassword: reqConfig("/api/user/forgot-password", "post"),
    verify_otp: reqConfig('/api/user/verify-otp', 'post'),
    resend_otp: reqConfig('/api/user/resend-otp', 'put'),
    reset_password: reqConfig('/api/user/reset-password', 'put'),
    verify_email: reqConfig('/auth/user/send-verification-email', 'get'),
    addCategory: reqConfig('/auth/category/upload/', 'post'),
    fetchCategories: reqConfig('/api/category/get-categories/', 'post'),
    updateCategory: reqConfig("/auth/category/update/", 'put'),
    deleteCategory: reqConfig("/auth/category/delete/", "delete"),
    uploadSubCategory: reqConfig("/auth/sub-category/upload/", "post"),
    fetchSubCategory: reqConfig("/api/sub-category/get", "post"),
    updateSubCategory: reqConfig("/auth/sub-category/update", "put"),
    deleteSubCategory: reqConfig("/auth/sub-category/delete", "delete"),
    uploadProducts: reqConfig("/auth/products/upload", "post"),
    fetchProducts: reqConfig("/api/products/get", 'post'),
    updateProduct: reqConfig("/auth/products/update", 'put'),
    addToCart: reqConfig("/auth/cart/create", "post"),
    getCartItems: reqConfig("/auth/cart/get", "get"),
    updateCartItem: reqConfig("/auth/cart/update", "put"),
    deleteCartItem: reqConfig("/auth/cart/delete", "delete"),
    emptyCart: reqConfig("/auth/cart/empty-cart", "delete"),
    fetchAddress: reqConfig("/auth/user/address/get", "get"),
    addAddress: reqConfig("/auth/user/address/add", "post"),
    deleteAddress: reqConfig("/auth/user/address/delete", "delete"),
    updateAddress: reqConfig("/auth/user/address/update", "put"),
    orderPayment: reqConfig("/auth/user/order/new-order/payment", "post"),
    paymentConfirmation: reqConfig("/auth/user/order/new-order/payment/confirmation", "post")
}

export default SummaryApi