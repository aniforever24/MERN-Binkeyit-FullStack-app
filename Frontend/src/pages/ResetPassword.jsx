import React, { useEffect, useRef, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Navigate, useLocation, useNavigate } from "react-router";
import Validation from "../utils/FormValidation";
import ClipLoader from "react-spinners/ClipLoader";
import Spinner from "../components/Spinner";
import { notifyError, notifySuccess } from "../utils/foxToast";
import axiosInstance from "../config/axiosConfig";
import SummaryApi from "../Common/SummaryApi";
import axiosErrorMsg from "../utils/axiosError";

const ResetPassword = () => {
	const location = useLocation();
	if (!location?.state?.userId && !location?.state?.email) {
		return <Navigate to={"/login"} replace={true} />;
	}
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPass, setShowPass] = useState(false);
	const [showConfPass, setShowConfPass] = useState(false);
	const [form, setForm] = useState({
		password: "",
		confPassword: "",
	});
	const [id, setId] = useState("");
	const [email, setEmail] = useState("");
	const i = useRef(undefined);
	const j = useRef(undefined);

	const handleChange = (e) => {
		const { value, name } = e.target;
		setForm((prev) => {
			return { ...prev, [name]: value };
		});
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const validationErrorArray = [
			Validation.password(form.password),
			Validation.confPassword(form.confPassword, form),
		];
		if (validationErrorArray.some((er) => er !== null)) {
			validationErrorArray.forEach((er) => {
				if (er !== null) {
					notifyError(er);
				}
			});
			return;
		}
		setIsSubmitting(true);
		try {
			const response = await axiosInstance({
				...SummaryApi.reset_password,
				data: { email, id, ...form },
			});
			const { data } = response;
			if (response.status === 201) {
				notifySuccess(data.message || "Password reset successfull ✔");
			}
			navigate("/login", { replace: true });
		} catch (error) {
			axiosErrorMsg(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		setId(location?.state?.userId);
		setEmail(location?.state?.email);
	}, []);

	useEffect(() => {
		if (i.current) clearInterval(i.current);

		if (showPass) {
			i.current = setTimeout(() => {
				setShowPass(false);
			}, 15000);
		}
	}, [showPass]);

	useEffect(() => {
		if (j.current) clearInterval(j.current);

		if (showConfPass) {
			j.current = setTimeout(() => {
				setShowConfPass(false);
			}, 15000);
		}
	}, [showConfPass]);

	return (
		<div>
			<form
				noValidate
				onSubmit={handleSubmit}
				className="container mx-auto my-4 max-w-xl border px-8 py-6 border-neutral-200 rounded-2xl shadow-2xl grid gap-3.5 bg-white select-none"
			>
				<h2 className="text-2xl text-center text-green-600 font-semibold uppercase drop-shadow-xl">
					Reset Password
				</h2>
				<div className="_password my-2 grid gap-0.5 relative">
					<label className="font-semibold" htmlFor="password">
						New Password:
					</label>
					<input
						onChange={handleChange}
						type={!showPass ? "password" : "text"}
						name="password"
						id="password"
						className="border border-neutral-300 rounded-sm p-1 px-2 placeholder:text-neutral-300"
						placeholder="Enter New Password"
						value={form.password}
					/>
					{showPass ? (
						<FaEyeSlash
							className="absolute right-4 top-9 cursor-pointer"
							size={19}
							onClick={() => setShowPass(!showPass)}
						/>
					) : (
						<FaEye
							className="absolute right-4 top-9 cursor-pointer"
							size={19}
							onClick={() => setShowPass(!showPass)}
						/>
					)}
				</div>
				<div className="confPass my-2 grid gap-0.5 relative">
					<label className="font-semibold" htmlFor="confPassword">
						Confirm New Password:
					</label>
					<input
						onChange={handleChange}
						type={!showConfPass ? "password" : "text"}
						name="confPassword"
						id="confPassword"
						className="border border-neutral-300 rounded-sm p-1 px-2 placeholder:text-neutral-300"
						placeholder="Confirm New Password"
						value={form.confPassword}
					/>
					{showConfPass ? (
						<FaEyeSlash
							className="absolute right-4 top-9 cursor-pointer"
							size={19}
							onClick={() => setShowConfPass(!showConfPass)}
						/>
					) : (
						<FaEye
							className="absolute right-4 top-9 cursor-pointer"
							size={19}
							onClick={() => setShowConfPass(!showConfPass)}
						/>
					)}
				</div>
				<div className="submit text-center">
					{!isSubmitting ? (
						<button
							className="p-1 px-4 mt-4 mb- 2 cursor-pointer font-semibold hover:bg-amber-500 bg-amber-300 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-neutral-600"
							disabled={Object.values(form).some((v) => v.trim() === "")}
						>
							Change Password
						</button>
					) : (
						<div>
							{/* <ClipLoader loading speedMultiplier={1} /> */}
							<Spinner borderClr="border-amber-400" />
						</div>
					)}
				</div>
			</form>
		</div>
	);
};

export default ResetPassword;
