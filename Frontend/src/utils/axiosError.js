import { notifyError } from "./foxToast";

const axiosErrorMsg = (error) => {
    // console.log('Error: ', error)
   
    let errorMessage, errorMessage2;
    if (error.name === "AxiosError") {
        errorMessage = error?.response?.data?.message;
        errorMessage2 = error?.response?.data?.error;
        
    }
    return notifyError(errorMessage || error?.message || error, (errorMessage !== errorMessage2) && errorMessage2);
}

export default axiosErrorMsg