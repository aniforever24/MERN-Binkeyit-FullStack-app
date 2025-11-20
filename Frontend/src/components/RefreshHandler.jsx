import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import SummaryApi from "../Common/SummaryApi";
import authAxiosInstance from "../config/authAxiosConfig";
import { setUserDetails } from "../redux/user/userSlice";
import {
	// setCategories,
	fetchCategories,
	// fetchSubCategories,
} from "../redux/category/categorySlice";
import { fetchCartItems } from "../redux/cart/cartSlice";
import { useLocation, useNavigate } from "react-router";
import { GlobalContext } from "../context/context";
import axiosErrorMsg from "../utils/axiosError";
import { notifyError } from "../utils/foxToast";
import { fetchAddress } from "../redux/address/addressSlice";

const RefreshHandler = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();
	const { error, setError } = useContext(GlobalContext);

	const stopRef = useRef(false);

	const fetchUserDetails = async () => {
		const { data: responseData } = await authAxiosInstance({
			...SummaryApi.user_details,
			data: {
				shoppingCartPopulate: true
			}
		});
		return responseData.data;
	};

	useEffect(() => {
		if (
			localStorage.getItem("accessToken") ||
			localStorage.getItem("refreshToken")
		) {
			fetchUserDetails()
				.then((data) => {
					// console.log("user details", data);
					const accessToken = data?.accessToken;
					if (accessToken) localStorage.setItem("accessToken", accessToken);

					let db_avatar = data?.user?.avatar;
					let avatar;
					// console.log("db avatar:", db_avatar);
					if (!db_avatar) {
						avatar =
							"https://res.cloudinary.com/dxnmg6rrs/image/upload/v1739870853/Binkeyit/avatar/default_avatar.png";
					}
					dispatch(setUserDetails({ ...data.user, ...(!db_avatar && { avatar }) }));
					dispatch(fetchCartItems()).unwrap();
				})
				.catch((error) => {
					console.log(error);
					const msg = error?.message || error?.request.message;
					if (msg === "Network Error") {
						setError({ message: msg });
						navigate("/error", {replace: true});
					}
				});
			dispatch(fetchAddress())
			// if (!stopRef.current) {
			// 	dispatch(fetchCartItems()).unwrap();
			// }
		}
	}, []);
	useEffect(() => {
		dispatch(fetchCategories());
	}, [dispatch]);
	useEffect(() => {
		if (!Object.keys(error)[0] && location.pathname === "/error") {
			console.log("from refresh handler should navigate to homepage");
			navigate("/home");
		}
	}, [error]);

	return null;
};

export default RefreshHandler;
