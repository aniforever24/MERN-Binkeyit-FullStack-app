import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import Spinner from "./Spinner";

const Form = ({
	title,
	isLoginForm,
	handleSubmit,
	btnTxt,
	submittingState,
}) => {
	const [isSubmitting, setIsSubmitting] = submittingState;
	const [showPass, setShowPass] = useState(false);
	const [showConfPass, setShowConfPass] = useState(false);
	const i = useRef(undefined);
	const j = useRef(undefined);

	const [form, setForm] = useState(() => {
		if (isLoginForm)
			return {
				email: "",
				password: "",
			};
		if (!isLoginForm)
			return {
				name: "",
				email: "",
				password: "",
				confPassword: "",
			};
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => {
			const newForm = {
				...prev,
				[name]: value,
			};
			return newForm;
		});
	};

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
		<form
			noValidate
			onSubmit={(e) => handleSubmit(e, form)}
			className="container mx-auto my-4 max-w-xl border px-8 py-6 border-neutral-200 rounded-2xl shadow-2xl grid gap-3.5 bg-white select-none"
		>
			<h2 className="text-2xl text-green-600 font-bold uppercase">{title}</h2>
			{!isLoginForm && (
				<>
					<div className="_name my-2 grid gap-0.5">
						<label className="font-semibold" htmlFor="name">
							Name:
						</label>
						<input
							autoComplete
							onChange={handleChange}
							type="text"
							name="name"
							id="name"
							className="border border-neutral-300 rounded-sm p-1 px-2 placeholder:text-neutral-300"
							placeholder="Enter Your Name"
						/>
					</div>
				</>
			)}
			<div className="_email my-2 grid gap-0.5">
				<label className="font-semibold" htmlFor="email">
					Email:
				</label>
				<input
					autoComplete
					onChange={handleChange}
					type="email"
					name="email"
					id="email"
					className="border border-neutral-300 rounded-sm p-1 px-2 placeholder:text-neutral-300"
					placeholder="Enter Your Email"
				/>
			</div>

			<div className="_password my-2 grid gap-0.5 relative">
				<label className="font-semibold" htmlFor="password">
					Password:
				</label>
				<input
					onChange={handleChange}
					type={!showPass ? "password" : "text"}
					name="password"
					id="password"
					className="border border-neutral-300 rounded-sm p-1 px-2 placeholder:text-neutral-300"
					placeholder="Enter Your Password"
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
				{isLoginForm && (
					<Link
						to="/forgot-password"
						className="justify-self-end text-yellow-500 cursor-pointer hover:text-green-500"
					>
						Forgot Password?
					</Link>
				)}
			</div>
			{!isLoginForm && (
				<div className="confPass my-2 grid gap-0.5 relative">
					<label className="font-semibold" htmlFor="confPassword">
						Confirm Password:
					</label>
					<input
						onChange={handleChange}
						type={!showConfPass ? "password" : "text"}
						name="confPassword"
						id="confPassword"
						className="border border-neutral-300 rounded-sm p-1 px-2 placeholder:text-neutral-300"
						placeholder="Confirm Your Password"
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
			)}
			<div className="submit text-center">
				{!isSubmitting ? (
					<button
						className="p-1 px-4 mt-4 mb- 2 cursor-pointer font-semibold hover:bg-amber-500 bg-amber-300 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-neutral-600"
						disabled={Object.values(form).some((v) => v.trim() === "")}
					>
						{btnTxt}
					</button>
				) : (
					<div>
						<ClipLoader loading speedMultiplier={1} />
					</div>
				)}
			</div>
			{isLoginForm ? (
				<div className="flex sm:flex-row flex-col gap-1 sm:gap-3 justify-center mb-6">
					<p>Don't have an account!</p>
					<Link
						to="/signup"
						className="text-green-600 hover:text-green-800 cursor-pointer"
					>
						Sign up
					</Link>
				</div>
			) : (
				<div className="flex sm:flex-row flex-col gap-1 sm:gap-3 justify-center mb-6">
					<p>Already have an accoun!t</p>
					<Link
						to="/login"
						className="text-green-600 hover:text-green-800 cursor-pointer"
					>
						Login
					</Link>
				</div>
			)}
		</form>
	);
};

export default Form;
