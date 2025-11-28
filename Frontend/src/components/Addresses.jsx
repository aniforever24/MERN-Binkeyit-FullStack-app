import React, { useEffect, useState, memo } from "react";
import Popup from "./Popup";
import AddAddress from "./AddAddress";
import { AnimatePresence, motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchAddress,
	setCustomDefaultAddress,
	updateAddress,
} from "../redux/address/addressSlice";
import { twMerge } from "tailwind-merge";
import ShowMoreAddresses from "./ShowMoreAddresses";

const Addresses = ({
	data,
	defaultAddress,
	showMoreBtn,
	setShowMoreBtn,
	setShowMoreInPopup,
	showMoreInPopup,
	showMoreInPopupHeading = "",
	customStyles = {},
	showDeleteOption,
}) => {
	const dispatch = useDispatch();
	const { addresses: allAddresses, customDefaultAddress } = useSelector(
		(state) => state.address
	);
	const { customStyleDefaultAddress } = customStyles;

	const [defaultAddressText, setDefaultAddressText] = useState("");
	const [preventShowMoreBtnRender, setPreventShowMoreBtnRender] =
		useState(false);
	const [showAddAddress, setShowAddAddress] = useState(false);

	// Event listeners
	const handleClickShowMore = () => {
		if (typeof setShowMoreBtn == "function") {
			setShowMoreBtn(false);
		}
	};
	const handleChange = async (e, id) => {
		const newAdr = allAddresses.filter((adr) => adr._id.toString() === id);
		dispatch(setCustomDefaultAddress(newAdr[0]));
		if (showDeleteOption) {
			try {
				await dispatch(updateAddress({ isDefault: true, id })).unwrap();
				dispatch(fetchAddress());
			} catch (error) {
				console.log("error in updating address:", error);
			}
		}
	};
	const handleClickAddAddress = (e) => {
		setShowAddAddress(true);
	};

	useEffect(() => {
		if (defaultAddress) {
			const { addressLine, city, pincode, state, country, mobile } =
				defaultAddress;
			setDefaultAddressText((prev) => {
				const adr = `${addressLine}, ${city} - ${pincode}, ${state}, ${country}`;
				const m = mobile ? `, Ph-${mobile}` : "";

				return adr + m;
			});
		}
	}, [defaultAddress]);

	useEffect(() => {
		// console.log("customeDefaultAddress:", customDefaultAddress)
	}, [customDefaultAddress]);

	return (
		<>
			{defaultAddress && (
				<div
					className={twMerge(
						"_defaultAddress sm:text-base text-sm p-2 py-3 space-x-3 border-2 border-gray-100 rounded",
						customStyleDefaultAddress
					)}
				>
					<input
						type="radio"
						name="address"
						id={`default-address-${defaultAddress?._id?.toString()}`}
						value={defaultAddressText}
						defaultChecked
						onChange={(e) => handleChange(e, defaultAddress?._id?.toString())}
					/>
					<label htmlFor={`default-address-${defaultAddress?._id?.toString()}`}>
						{defaultAddressText}
					</label>
				</div>
			)}

			{/* Show more button display setup */}
			{showMoreBtn &&
				((showMoreInPopup && data.length > 1) ||
					(!showMoreInPopup && data.length > 0)) && (
					<button
						className="text-sm text-amber-600 font-medium cursor-pointer active:text-amber-500 ml-4"
						onClick={handleClickShowMore}
					>
						Show More
					</button>
				)}

			{/* Show Addresses in inline mode */}
			{!showMoreInPopup && !showMoreBtn && !(data.length === 0) && (
				<ShowMoreAddresses
					data={data}
					showMoreBtn={showMoreBtn}
					setShowMoreBtn={setShowMoreBtn}
					showMoreInPopup={showMoreInPopup}
					handleChange={handleChange}
				/>
			)}

			{/* Show Addresses in popup mode */}
			<AnimatePresence>
				{showMoreInPopup && !showMoreBtn && data.length > 1 && (
					<Popup
						close={() => {
							// setShowMoreInPopup(false);
							setShowMoreBtn(true);
						}}
					>
						<motion.div className="p-4 sm:px-6 px-4 overflow-y-auto max-h-[80vh]">
							<h3 className="text-amber-600 text-center font-semibold py-2 mb-4 text-lg border border-amber-200 rounded bg-amber-50">
								Choose Default Address
							</h3>
							<ShowMoreAddresses
								data={data}
								showMoreBtn={showMoreBtn}
								showMoreInPopup={showMoreInPopup}
								handleChange={handleChange}
								showMoreInPopupHeading={showMoreInPopupHeading}
								showDeleteOption={showDeleteOption}
								setPreventShowMoreBtnRender={setPreventShowMoreBtnRender}
							/>
						</motion.div>
					</Popup>
				)}
			</AnimatePresence>

			{showMoreInPopup && (!showMoreBtn || data.length <= 1) && (
				<button
					type="button"
					className={twMerge(
						"block border-amber-600 bg-amber-500 text-white px-2 rounded-md text-sm mt-1 cursor-pointer"
					)}
					onClick={handleClickAddAddress}
				>
					Add Address
				</button>
			)}

			{!showMoreInPopup && data.length === 0 && (
				<button
					className="block border border-gray-200 border-dashed sm:text-base text-sm sm:p-3 p-2 mt-2 text-center bg-blue-50 hover:bg-blue-100 text-gray-600 font-medium cursor-pointer active:bg-blue-100 w-full"
					onClick={handleClickAddAddress}
				>
					Add Address
				</button>
			)}

			<AnimatePresence>
				{showAddAddress && (
					<Popup close={() => setShowAddAddress(false)}>
						<AddAddress
							setShowMoreBtn={setShowMoreBtn}
							showMoreInPopup={showMoreInPopup}
						/>
					</Popup>
				)}
			</AnimatePresence>
		</>
	);
};

export default memo(Addresses);
