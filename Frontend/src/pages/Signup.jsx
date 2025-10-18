import React, { useState } from "react";
import Form from "../components/Form";
import axiosInstance from "../config/axiosConfig";
import SummaryApi from "../Common/SummaryApi";
import { notifyError } from "../utils/foxToast";
import Validation from "../utils/FormValidation";
import axiosErrorMsg from "../utils/axiosError";
import { Navigate, useNavigate } from "react-router";

const signup = () => {
	if (localStorage.getItem("accessToken") || localStorage.getItem('refreshToken')) {
		return <Navigate to="/home" replace={true} />;
	}

	const [title, setTitle] = useState("signup");
	const [isLoginForm, setIsLoginForm] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e, form) => {
		e.preventDefault();
		// console.log('formData = ', form)
		try {
			// Form Validation
			const formErrors = {
				name: Validation.name(form.name),
				email: Validation.email(form.email),
				password: Validation.password(form.password),
				confPassword: Validation.confPassword(form.confPassword, form),
			};
			const hasError = Object.values(formErrors).some((error) => error != null);
			if (hasError) {
				for (const key in formErrors) {
					const error = formErrors[key];
					if (error) notifyError(error);
				}
				return;
			}
			setIsSubmitting(true);
			const response = await axiosInstance({
				...SummaryApi.signup,
				data: form,
			});
			// console.log("response: ", response);
		} catch (error) {
			setIsSubmitting(false);
			axiosErrorMsg(error);
		}
		e.target.reset();
		setTimeout(navigate, 3000, "/login");
	};

	return (
		<div>
			<Form
				title={title}
				isLoginForm={isLoginForm}
				handleSubmit={handleSubmit}
				btnTxt={"Signup"}
				submittingState={[isSubmitting, setIsSubmitting]}
			/>
		</div>
	);
};

export default signup;
