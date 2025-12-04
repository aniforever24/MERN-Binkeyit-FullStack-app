import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { notifyError } from "../utils/foxToast";
import { capitalizeFirstLetter, debounce } from "../utils/UtilityFunctions";
import { useSelector, useDispatch } from "react-redux";
import authAxiosInstance from "../config/authAxiosConfig";
import SummaryApi from "../Common/SummaryApi";
import {
	addAddress,
	fetchAddress,
	setCustomDefaultAddress,
} from "../redux/address/addressSlice";
import Spinner from "./Spinner";
import { PopupContext } from "./Popup";

const AddAddress = ({ setShowMoreBtn, showMoreInPopup }) => {
	const { close } = useContext(PopupContext);
	const dispatch = useDispatch();
	const { status, customDefaultAddress } = useSelector((state) => state.address);

	const debouncedClose = debounce(close, 250);
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitted, isValid },
	} = useForm();

	const onSubmit = async (data) => {
		await dispatch(addAddress(data)).unwrap();
		dispatch(fetchAddress()).then((_)=> {
			if (customDefaultAddress && customDefaultAddress?.index !== -1) {
			dispatch(
				setCustomDefaultAddress({
					...customDefaultAddress,
					index: customDefaultAddress.index + 1,
				})
			);
		}
		});
		
		debouncedClose();
		if (!showMoreInPopup) setShowMoreBtn(false);
	};
	const onError = (error) => {
		const err = Object.entries(error);
		if (err.length > 0) {
			notifyError(
				err[0][1]?.message ||
					`Error in field '${capitalizeFirstLetter(err[0][0])}' !`
			);
		}
	};

	return (
		<div className="sm:p-6 p-4 max-sm:px-6">
			<div className="space-y-3">
				<div className="flex flex-col gap-1">
					<label
						htmlFor="addressLine"
						className="font-medium text-amber-600 sm:text-lg"
					>
						Address Line: <span title="This field is necessary">*</span>
					</label>
					<input
						type="text"
						id="addressLine"
						name="addressLine"
						{...register("addressLine", {
							required: "Address Line is required",
							minLength: 4,
						})}
						className="border border-gray-400 sm:p-2 p-1 rounded outline-none focus:bg-blue-50"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label htmlFor="city" className="font-medium text-amber-600 sm:text-lg">
						City: <span title="This field is necessary">*</span>
					</label>
					<input
						type="text"
						id="city"
						name="city"
						{...register("city", { required: "City field is required" })}
						className="border border-gray-400 sm:p-2 p-1 rounded outline-none focus:bg-blue-50"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label htmlFor="state" className="font-medium text-amber-600 sm:text-lg">
						State: <span title="This field is necessary">*</span>
					</label>
					<input
						type="text"
						id="state"
						name="state"
						{...register("state", { required: "State field is required" })}
						className="border border-gray-400 sm:p-2 p-1 rounded outline-none focus:bg-blue-50"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label htmlFor="pincode" className="font-medium text-amber-600 sm:text-lg">
						Pincode: <span title="This field is necessary">*</span>
					</label>
					<input
						type="text"
						id="pincode"
						name="pincode"
						{...register("pincode", {
							required: "Pincode is required",
							pattern: { value: /^\d+$/, message: "Pincode must be a number" },
						})}
						className="border border-gray-400 sm:p-2 p-1 rounded outline-none focus:bg-blue-50"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label htmlFor="country" className="font-medium text-amber-600 sm:text-lg">
						Country: <span title="This field is necessary">*</span>
					</label>
					<input
						type="text"
						id="country"
						name="country"
						{...register("country", { required: "Country field is required" })}
						className="border border-gray-400 sm:p-2 p-1 rounded outline-none focus:bg-blue-50"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<label htmlFor="mobile" className="font-medium text-amber-600 sm:text-lg">
						Mobile:
					</label>
					<input
						type="text"
						id="mobile"
						name="mobile"
						{...register("mobile", {
							required: false,
							validate: (value) => {
								const condition = !/^\d+$/.test(value) || String(value).length != 10;
								if (value && condition) {
									return "Mobile number is incorrect.";
								}
							},
						})}
						className="border border-gray-400 sm:p-2 p-1 rounded outline-none focus:bg-blue-50"
					/>
				</div>

				{status.addAddress === "pending" ? (
					<button className="block w-full font-medium text-center  text-white bg-green-500 hover:bg-green-400 cursor-pointer sm:p-2 p-1 rounded-md mt-6">
						<Spinner
							borderClr={"text-green-500"}
							customClass="min-w-6 min-h-6"
							customClassTrack="min-w-6 min-h-6"
						/>
					</button>
				) : (
					<button
						className="block w-full font-medium text-center  text-white bg-green-500 hover:bg-green-400 not-disabled:active:bg-green-600
						cursor-pointer sm:p-2 p-1 rounded-md mt-6"
						onClick={handleSubmit(onSubmit, onError)}
					>
						Save Address
					</button>
				)}
			</div>
		</div>
	);
};

export default AddAddress;
