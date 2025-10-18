import React, { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router";
import Timer from "../components/Timer";
import axiosInstance from "../config/axiosConfig";
import SummaryApi from "../Common/SummaryApi";
import axiosErrorMsg from "../utils/axiosError";
import { notifySuccess } from "../utils/foxToast";
import { setReloadedTrue } from "../redux/reload/reloadSlice";
import { useSelector, useDispatch } from "react-redux";

const VerifyOTP = () => {
	const location = useLocation();
	const params = useParams();
	const navigate = useNavigate();
	const reloaded = useSelector((state) => state.reloadState.reloaded);
	const dispatch = useDispatch()

	if (params?.userId !== location?.state?.userId) {
		return <Navigate to="/login" replace={true} />;
	}
	const [reset, setReset] = useState();
	const [form, setForm] = useState({
		otp1: "",
		otp2: "",
		otp3: "",
		otp4: "",
		otp5: "",
		otp6: "",
	});
	const [otp, setOTP] = useState("");
	const [disabled, setDisabled] = useState(true);
	const [min, setMin] = useState();
	const inputsRef = useRef(Array.from(Array(6)).fill(null));
	const btnRef = useRef(null);
	const [key, setKey] = useState(0);

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (value.length <= 1) {
			setForm((prev) => {
				return { ...prev, [name]: value };
			});
		}
		const otpInputs = inputsRef.current;
		const index = otpInputs.findIndex((input) => {
			return input === e.target;
		});
		if (index < 5 && value.length === 1) {
			otpInputs[index + 1].focus();
		} else if (index === 5 && value.length === 1) {
			btnRef.current.focus();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axiosInstance({
				...SummaryApi.verify_otp,
				data: { otp: otp, email: location.state.email },
			});
			// console.log("response:", response);
			if (response.status === 200) {
				dispatch(setReloadedTrue())
				notifySuccess(response?.data?.message || "OTP verified successfully");
				navigate("/reset-password", {
					replace: true,
					state: { userId: location?.state?.userId },
				});
			}
		} catch (error) {
			console.log(error);
			return axiosErrorMsg(error);
		} finally {
			setForm({
				otp1: "",
				otp2: "",
				otp3: "",
				otp4: "",
				otp5: "",
				otp6: "",
			});
		}
	};

	const handleResendOTP = async (e) => {
		e.preventDefault();
		try {
			const response = await axiosInstance({
				...SummaryApi.resend_otp,
				data: { email: location.state.email },
			});
			// console.log("response from resendOTP: ", response);
			if (response.status === 201) {
				notifySuccess(response?.data?.message || "OTP resend successfully");
				setKey((prev) => prev + 1);
			}
			setDisabled(true);
			setTimeout(setDisabled, 10000, false);
		} catch (error) {
			console.log(error);
			return axiosErrorMsg(error);
		}
	};

	useEffect(() => {
		setOTP(Object.values(form).join(""));
		// console.log("form", form)
	}, [form]);

	useEffect(() => {
		const i = setTimeout(setDisabled, 10000, false);
		return () => {
			clearTimeout(i);
		};
	}, []);

	return (
		<div className="h-[68vh] flex">
			<div className="container mx-auto my-4 max-w-2xl border px-4 sm:px-8 py-6 border-neutral-200 rounded-2xl shadow-2xl bg-white select-none space-y-2">
				<div className="max-w-md space-y-6 mx-auto pt-20">
					<h2 className="sm:text-3xl text-2xl text-center text-green-600 font-semibold max-w-md mx-auto ">
						Enter OTP
					</h2>
					<p className="text-neutral-500 text-justify">
						Enter OTP sent to your email below to verify your email to reset your
						password.
						<span className="text-center">
							{" "}
							Your OTP will expire after 30 minutes.
						</span>
						<span className="text-red-600 text-xs text-right font-sans sm:pl-24">
							{" "}
							(Do not reload this page or the timer will disappear!)
						</span>
					</p>
					<form className="max-w-md mx-auto" onSubmit={handleSubmit} noValidate>
						<div className="flex gap-2">
							{Array.from(Array(6)).map((el, i) => {
								return (
									<input
										key={i}
										ref={(el) => (inputsRef.current[i] = el)}
										type="number"
										name={`otp${i + 1}`}
										className="border border-amber-200 focus:border-amber-400 focus:outline-amber-300  focus:bg-amber-100 w-full px-2 py-2 shadow-xs text-center font-semibold sm:text-2xl"
										value={form[`otp${i + 1}`]}
										onChange={handleChange}
										autoFocus={i === 0 && true}
									/>
								);
							})}
						</div>
						<div className="flex justify-end mt-1">
							{!reloaded ? <Timer min={min} key={key} /> : "-- : --"}
						</div>
						<div className="flex justify-center items-center gap-4 mt-4 mb- 2">
							<button
								className="block w-fit p-1 px-4  cursor-pointer font-semibold hover:bg-green-500 enabled:hover:shadow-green-300 bg-amber-300 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-neutral-600 shadow-lg active:bg-green-600 active:text-white focus:shadow-2xl"
								disabled={Object.values(form).some((v) => v.trim() === "")}
								ref={btnRef}
							>
								Verify OTP
							</button>
							<button
								type="button"
								className="block w-fit p-1 px-4 cursor-pointer font-semibold hover:bg-green-500 enabled:hover:shadow-green-300 bg-amber-300 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-neutral-600 shadow-lg active:bg-green-600 active:text-white focus:shadow-2xl"
								disabled={disabled}
								title={
									disabled
										? "Wait at least 1 minute for getting otp in email"
										: "Click to resend otp"
								}
								onClick={handleResendOTP}
							>
								Resend OTP
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default VerifyOTP;
