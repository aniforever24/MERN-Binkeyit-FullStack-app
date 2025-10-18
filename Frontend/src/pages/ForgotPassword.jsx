import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from "../utils/FormValidation";
import { notifyError, notifySuccess } from "../utils/foxToast";
import axiosErrorMsg from "../utils/axiosError";
import authAxiosInstance from "../config/authAxiosConfig";
import SummaryApi from "../Common/SummaryApi";
import { setReloadedFalse } from "../redux/reload/reloadSlice";
import { useDispatch, useSelector } from "react-redux";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [disabled, setDisabled] = useState(true);
	const navigate = useNavigate();
	const dispatch = useDispatch()

	const handleChange = (e) => {
		const { value } = e.target;
		setEmail(value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setDisabled(true);
		// use Validation object to validate email
		const errorMsg = Validation.email(email);
		if (errorMsg) {
			setDisabled(false);
			return notifyError(errorMsg);
		}
		e.target.reset();
		const formData = { email };

		try {
			const response = await authAxiosInstance({
				...SummaryApi.forgotPassword,
				data: formData,
			});
			const { data } = response;
			if (response.status === 200) {
				dispatch(setReloadedFalse())
				notifySuccess(data?.message || "otp sent successfully to your email");
				navigate(`/verify-otp/${data.id}`, {
					state: { email: data.email, userId: data.id },
					replace: true
				});
			}
		} catch (error) {
			return axiosErrorMsg(error);
		} finally {
			setDisabled(false);
		}
	};

	useEffect(() => {
		if (email) setDisabled(false);
		else setDisabled(true);
	}, [email]);

	return (
		<div className="h-[68vh] flex">
			<div className="container mx-auto my-4 max-w-2xl border px-8 py-6 border-neutral-200 rounded-2xl shadow-2xl bg-white select-none space-y-2">
				<div className="max-w-md space-y-6 mx-auto pt-20">
					<h2 className="sm:text-3xl text-2xl text-center text-green-600 font-semibold max-w-md mx-auto ">
						Forgot Password?
					</h2>
					<p className="text-neutral-500 text-center">
						Enter your email below to get otp in your email to reset your password
					</p>
					<form className="max-w-md mx-auto" onSubmit={handleSubmit} noValidate>
						<input
							type="email"
							name="email"
							className="border border-amber-200 focus:border-amber-400 focus:outline-amber-300  focus:bg-amber-100 w-full px-2 py-2 placeholder:text-center placeholder:font-semibold placeholder:text-neutral-300 shadow-xs"
							placeholder="Your email address"
							value={email}
							autofill
							onChange={handleChange}
						/>
						<button
							className="block w-fit p-1 px-4 mt-4 mb- 2 cursor-pointer font-semibold hover:bg-green-500 enabled:hover:shadow-green-300 bg-amber-300 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-neutral-600 mx-auto shadow-lg active:bg-green-600 active:text-white "
							disabled={disabled}
						>
							Get OTP
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
