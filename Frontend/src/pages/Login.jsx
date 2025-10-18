import React, { useContext, useEffect, useState } from "react";
import Form from "../components/Form";
import { notifyError, notifySuccess } from "../utils/foxToast";
import axiosInstance from "../config/axiosConfig";
import SummaryApi from "../Common/SummaryApi";
import Validation from "../utils/FormValidation";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../redux/user/userSlice";
import { Navigate, useNavigate } from "react-router";
import axiosErrorMsg from "../utils/axiosError";
import { fetchCartItems } from "../redux/cart/cartSlice";
import { GlobalContext } from "../context/context";

const Login = () => {
	if (
		localStorage.getItem("accessToken") ||
		localStorage.getItem("refreshToken")
	) {
		return <Navigate to="/home" replace={true} />;
	}
	
	const {setIsUserLoggedIn} = useContext(GlobalContext)
	const [title, setTitle] = useState("Login");
	const [isLoginForm, setIsLoginForm] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.userDetails);
	const navigate = useNavigate();

	const handleSubmit = async (e, form) => {
		e.preventDefault();
		try {
			// form validation
			const formErrors = {
				email: Validation.email(form.email),
				password: Validation.password(form.password),
			};
			const hasError = Object.values(formErrors).some((error) => error != null);

			if (hasError) {
				for (const key in formErrors) {
					if (formErrors[key]) notifyError(formErrors[key]);
				}
				return;
			}

			setIsSubmitting(true);
			const response = await axiosInstance({
				...SummaryApi.login,
				data: form,
			});
			const { data: responseData } = response;
			if (responseData.success) {
				notifySuccess(responseData.message);
			}
			// console.log("response:> ", response)

			localStorage.setItem("refreshToken", responseData.data.refreshToken);
			localStorage.setItem("accessToken", responseData.data.accessToken);

			let db_avatar = responseData?.data?.user?.avatar,
				avatar;
			if (!db_avatar) {
				avatar =
					"https://res.cloudinary.com/dxnmg6rrs/image/upload/v1739870853/Binkeyit/avatar/default_avatar.png";
			}
			dispatch(setUserDetails({ ...responseData.data.user, ...(!db_avatar && { avatar }) }));
			dispatch(fetchCartItems())
			setIsUserLoggedIn(true)
			// dispatch(setUserDetails(responseData.data.user));
		} catch (error) {
			setIsSubmitting(false);
			return axiosErrorMsg(error);
		}
		e.target.reset();
		navigate("/home");
	};

	return (
		<div>
			<Form
				title={title}
				isLoginForm={isLoginForm}
				handleSubmit={handleSubmit}
				btnTxt={"Login"}
				submittingState={[isSubmitting, setIsSubmitting]}
			/>
		</div>
	);
};

export default Login;
