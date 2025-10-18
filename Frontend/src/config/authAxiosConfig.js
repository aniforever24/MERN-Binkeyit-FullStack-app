import axios from 'axios'
import axiosInstance from './axiosConfig';
import SummaryApi from '../Common/SummaryApi';
import { notifyError } from '../utils/foxToast';
import axiosErrorMsg from '../utils/axiosError';

const baseURL = 'http://localhost:3000';

const authAxiosInstance = axios.create({
    baseURL,
    withCredentials: true,
})

// request interceptors
authAxiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error))

// response interceptors
authAxiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
        console.log("authAxiosInstance error: ", error)
        const originalRequest = error.config;

        if ((error?.response?.status === 401) && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    const { data: responseData } = await axiosInstance({
                        ...SummaryApi.refresh_Token,
                        data: { token: refreshToken }
                    })
                    const newAccessToken = responseData?.data?.accessToken;
                    const refresh_token  = responseData?.data?.refreshToken;
                    // console.log('From authAxiosInstance: newAccessToken--> ', newAccessToken)
                    // console.log("refresh_token:", refresh_token)
                    localStorage.setItem('accessToken', newAccessToken);
                    localStorage.setItem('refreshToken', refresh_token);

                    return authAxiosInstance(originalRequest)
                } catch (error) {
                    if (error?.name === 'AxiosError' && (error?.status === 401 || error?.status === 403)) {
                        localStorage.clear('accessToken')
                        localStorage.clear('refreshToken')
                    }

                    console.log("Error from authAxiosInstance", error)
                    return axiosErrorMsg(error);
                }
            } else {
                localStorage.clear('accessToken')
                localStorage.clear('refreshToken')
            }

        }

        // notifyError(error?.response?.data?.message || error?.message || error)
        return Promise.reject(error)
    }
)


export default authAxiosInstance;