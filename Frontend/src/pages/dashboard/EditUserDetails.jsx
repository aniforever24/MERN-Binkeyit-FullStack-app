import React, { useEffect, useRef, useState } from "react";
import { FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector } from "react-redux";
import Divider from "../../components/Divider";
import { Link, useLocation } from "react-router-dom";
import authAxiosInstance from "../../config/authAxiosConfig";
import axiosErrorMsg from "../../utils/axiosError";
import SummaryApi from "../../Common/SummaryApi";
import { notifySuccess } from "../../utils/foxToast";

const EditUserDetails = ({ disabled, btnText, link, heading }) => {
	// Address is not included in actual updation yet

	const location = useLocation();
	const user = useSelector((state) => state.user.userDetails);
	const [showPwd, setShowPwd] = useState(false);
	const [addr, setAddr] = useState({
		addressLine1: "",
		addressLine2: "",
	});
	const [form, setForm] = useState({
		name: "",
		email: "",
		mobile: "",
		password: "",
		address: "",
	});
	const [title, setTitle] = useState(heading);
	const [emailVerified, setEmailVerified] = useState(false);
	const timeoutRef = useRef()

	if (!btnText) btnText = "Save";

	const getLocaleDate = (d) => {
		let localeDt;
		if (user?.last_login_date) {
			const lastLoginDate = user.last_login_date;
			const dt = new Date(lastLoginDate);
			localeDt = dt.toLocaleString("en-IN", { timeZoneName: "short" });
		}
		return localeDt;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => {
			return { ...prev, [name]: value };
		});
	};

	const handleChangeAddress = (e) => {
		const { name, value } = e.target;
		setAddr((prev) => {
			return { ...prev, [name]: value };
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		let formData = {};
		for (const key in form) {
			if (Object.prototype.hasOwnProperty.call(form, key)) {
				const value = form[key];
				Object.assign(formData, value.trim() ? { [key]: value } : {});
			}
		}
		// return console.log("formData: ", formData);

		try {
			const response = await authAxiosInstance({
				...SummaryApi.update_userDetails,
				data: formData,
			});
			// console.log("response: ", response);
			if (response.status === 201) {
				notifySuccess(
					response?.data?.message || "User details updated successfully."
				);
			}
		} catch (error) {
			return axiosErrorMsg(error);
		}
		e.target.reset();
		setForm({
			name: "",
			email: "",
			mobile: "",
			password: "",
			address: "",
		});
		timeoutRef.current = setTimeout(()=> window.location.reload(), 3000)
	};

	const handleVerifyEmail = async (e) => {
		try {
			const response = await authAxiosInstance({
				...SummaryApi.verify_email
			});
			console.log('response: ', response)
			const {data} = response
			if(response.status === 200) {
				notifySuccess(data?.message || "Verification email sent successfully to your new email!")
			}

		} catch (error) {
			return axiosErrorMsg(error)
		}
	};

	useEffect(() => {
		if (location.pathname === "/user/dashboard/edit-details")
			setTitle("Edit Personal Details");

		()=> {
			if(timeoutRef.current) clearTimeout(timeoutRef.current)
		}
	}, []);

	useEffect(()=> {
		setEmailVerified(()=> user?.emailVerified || false)
	}, [user?.emailVerified])

	useEffect(() => {
		const adr = Object.values(addr).join(" ");

		// Address is exluded from actual updation yet
		if (form.address)
			setForm((prev) => {
				return { ...prev, address: adr };
			});
	}, [addr]);

	useEffect(() => {
		let i;
		if (showPwd) {
			i = setTimeout(setShowPwd, 15000, false);
		}
		return () => {
			if (i) clearTimeout(i);
		};
	}, [showPwd]);

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className="mx-auto lg:ml-10 bg-slate-50 sm:mb-6 mb-0  py-4 px-4 max-sm:pb-0 space-y-4 max-sm:text-sm"
			>
				{title && (
					<>
						<h1 className="text-2xl font-bold text-center text-green-600">
							Edit Personal Details
						</h1>
						<div className="mb-2 relative -top-1">
							<Divider />
						</div>
					</>
				)}
				<div className="_name flex sm:gap-4 gap-1 items-center">
					<label
						className="font-semibold min-w-[80px] md:min-w-[130px] select-none"
						htmlFor="name"
					>
						Name:
					</label>
					<input
						className="border border-amber-200 px-2 py-1.5 grow-[1] rounded-md focus:outline-none focus:border-amber-400 focus:bg-blue-200 w-full disabled:text-gray-500 disabled:cursor-not-allowed placeholder:text-neutral-500 focus:placeholder:text-neutral-500/20"
						onChange={handleChange}
						type="text"
						name="name"
						id="name"
						placeholder={user?.name ? user.name : "name"}
						value={form?.name && form.name}
						disabled={disabled ? true : false}
					/>
				</div>

				<div className="_email flex sm:gap-4 gap-1 items-center mb-7 relative">
					<label
						className="font-semibold min-w-[80px] md:min-w-[130px] select-none"
						htmlFor="email"
					>
						Email:
					</label>
					<input
						className="border border-amber-200 px-2 py-1.5 grow-[1] rounded-md focus:outline-none focus:border-amber-400 focus:bg-blue-200 w-full disabled:text-gray-500 disabled:cursor-not-allowed placeholder:text-neutral-500 focus:placeholder:text-neutral-500/20"
						onChange={handleChange}
						type="email"
						name="email"
						id="email"
						placeholder={user?.email ? user.email : "email"}
						value={form?.email && form.email}
						disabled={disabled ? true : false}
					/>
					{/* <MdClose size={25} className="text-red-600" title="not verified" /> */}
					<div className="absolute -bottom-4 left-[86px] sm:left-25 md:left-[150px]   text-xs select-none">
						{!emailVerified ? (
							<div
								className="cursor-pointer text-green-600 font-semibold"
								onClick={handleVerifyEmail}
							>
								Verify Email
							</div>
						) : (
							<div className="flex items-center gap-2 text-green-600 font-semibold">
								Verified <FaCheck />
							</div>
						)}
					</div>
				</div>

				<div className="_mobile flex sm:gap-4 gap-1 items-center mb-7 relative">
					<label
						className="font-semibold min-w-[80px] md:min-w-[130px] select-none"
						htmlFor="mobile"
					>
						Mobile:
					</label>
					<input
						className="border border-amber-200 px-2 py-1.5 grow-[1] rounded-md focus:outline-none focus:border-amber-400 focus:bg-blue-200 w-full disabled:text-gray-500 disabled:cursor-not-allowed placeholder:text-neutral-500 focus:placeholder:text-neutral-500/20"
						onChange={handleChange}
						type="number"
						name="mobile"
						id="mobile"
						placeholder={user?.mobile ? user.mobile : "mobile"}
						value={form?.mobile && form.mobile }
						disabled={disabled ? true : false}
					/>
					{/* <MdClose size={25} className="text-red-600" title="not verified" /> */}
					<div className="absolute -bottom-4 left-[86px] sm:left-25 md:left-[150px] font-semibold text-green-600 text-xs select-none">
						{!user?.mobileVerified ? (
							<div className="cursor-pointer">Verify Mobile</div>
						) : (
							<div className="flex items-center gap-2">
								Verified <FaCheck />
							</div>
						)}
					</div>
				</div>

				<div className="_password relative flex sm:gap-4 gap-1 items-center select-none">
					<label
						className="font-semibold min-w-[80px] md:min-w-[130px] select-none"
						htmlFor="password"
					>
						Password:
					</label>
					<input
						className="border border-amber-200 px-2 py-1.5 grow-[1] rounded-md focus:outline-none focus:border-amber-400 focus:bg-blue-200 w-full disabled:text-gray-500 disabled:cursor-not-allowed placeholder:text-neutral-500 focus:placeholder:text-neutral-500/20 flex"
						onChange={handleChange}
						type={!showPwd ? "password" : "text"}
						name="password"
						id="password"
						value={form?.password}
						placeholder="***********"
						disabled={disabled ? true : false}
					/>
					{!showPwd ? (
						<FaEyeSlash
							onClick={() => setShowPwd((prev) => !prev)}
							className="absolute right-2 cursor-pointer"
							size={22}
						/>
					) : (
						<FaEye
							onClick={() => setShowPwd((prev) => !prev)}
							className="absolute right-2 cursor-pointer"
							size={22}
						/>
					)}
				</div>

				<div className="address flex sm:gap-4 gap-1 ">
					<label
						className="font-semibold min-w-[80px] md:min-w-[130px] select-none"
						htmlFor="address_line1"
					>
						Address:
					</label>
					<div className="grid w-full gap-2">
						<input
							className="border border-amber-200 px-2 py-1.5 grow-[1] rounded-md focus:outline-none focus:border-amber-400 focus:bg-blue-200 w-full disabled:text-gray-500 disabled:cursor-not-allowed placeholder:text-neutral-500 focus:placeholder:text-neutral-500/20"
							onChange={handleChangeAddress}
							type="text"
							name="addressLine1"
							id="address_line1"
							placeholder="address line 1"
							value={addr.addressLine1}
							disabled={disabled ? true : false}
						/>
						<input
							className="border border-amber-200 px-2 py-1.5 grow-[1] rounded-md focus:outline-none focus:border-amber-400 focus:bg-blue-200 w-full disabled:text-gray-500 disabled:cursor-not-allowed placeholder:text-neutral-500 focus:placeholder:text-neutral-500/20"
							onChange={handleChangeAddress}
							type="text"
							name="addressLine2"
							id="address_line2"
							placeholder="address line 2"
							value={addr?.addressLine2}
							disabled={disabled ? true : false}
						/>
					</div>
				</div>

				<div className="_status flex sm:gap-4 gap-1 items-center">
					<span className="font-semibold min-w-[80px] md:min-w-[130px] select-none">
						Status:
					</span>
					<span>{user?.status && user.status}</span>
				</div>

				<div className="_role flex sm:gap-4 gap-1 items-center">
					<span className="font-semibold min-w-[80px] md:min-w-[130px] select-none">
						Role:
					</span>
					<span>{user?.role && user.role}</span>
				</div>

				<div className="_lastLoginDate flex sm:gap-4 gap-1 items-center">
					<span className="font-semibold min-w-[80px] md:min-w-[130px] select-none">
						Last login date:
					</span>
					<span>{user?.last_login_date && getLocaleDate(user.last_login_date)}</span>
				</div>
				{!link ? (
					<button
						className="block mx-auto bg-green-100 font-semibold cursor-pointer rounded-xl p-1 px-2 hover:bg-green-500 text-green-600 hover:text-white border-green-600 border mb-4 min-w-20 w-full disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-400"
						disabled={!Object.values(form).some((v) => v.trim() !== "")}
					>
						{btnText}
					</button>
				) : (
					<Link
						to="/user/dashboard/edit-details"
						className="block mx-auto text-center bg-green-100 font-semibold cursor-pointer rounded-xl p-1 px-2 hover:bg-green-500 text-green-600 hover:text-white border-green-600 border mb-4 min-w-20 w-full"
					>
						{btnText}
					</Link>
				)}
			</form>
		</>
	);
};

export default EditUserDetails;
