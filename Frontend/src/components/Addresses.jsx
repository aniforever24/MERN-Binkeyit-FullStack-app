import React, { useEffect, useState, memo } from "react";
import Popup from "./Popup";
import AddAddress from "./AddAddress";
import { AnimatePresence } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { setCustomDefaultAddress } from "../redux/address/addressSlice";
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
}) => {
	const dispatch = useDispatch();
	const { addresses: allAddresses, customDefaultAddress } = useSelector(
		(state) => state.address
	);
	const { customStyleDefaultAddress } = customStyles;

	const [firstRender, setFirstRender] = useState(true);
	const [defaultAddressText, setDefaultAddressText] = useState("");

	// Event listeners
	const handleClickShowMore = () => {
		if (typeof setShowMoreBtn == "function") {
			setShowMoreBtn(false);
		}
	};
	const handleChange = (e, id) => {
		const newAdr = allAddresses.filter((adr) => adr._id.toString() === id);
		dispatch(setCustomDefaultAddress(newAdr[0]));
	};

	useEffect(() => {
		if (defaultAddress) {
			const { addressLine, city, pincode, state, country, mobile } =
				defaultAddress;
			setDefaultAddressText((prev) => {
				const adr = `${addressLine}, ${city} - ${pincode}, ${state}, ${country}`;
				const m = mobile ? `, ${mobile}` : "";

				return adr + m;
			});
		}
	}, [defaultAddress]);

	useEffect(()=> {
		// console.log("customeDefaultAddress:", customDefaultAddress)
	}, [customDefaultAddress])

	useEffect(() => {
		if (data.length === 0) {
			setShowMoreBtn(false);
		} else if (firstRender) {
			setShowMoreBtn(true);
			setFirstRender(false);
		}
	}, [data]);

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
			{showMoreBtn && data.length > 0 && (
				<button
					className="text-sm text-amber-600 font-medium cursor-pointer active:text-amber-500 ml-4"
					onClick={handleClickShowMore}
				>
					Show More
				</button>
			)}

			{/* Show Addresses in inline mode */}
			{!showMoreInPopup && (
				<ShowMoreAddresses
					data={data}
					showMoreBtn={showMoreBtn}
					handleChange={handleChange}
				/>
			)}

			{/* Show Addresses in popup mode */}
			{!showMoreBtn && data.length > 0 && showMoreInPopup && (
				<Popup
					close={() => {
						// setShowMoreInPopup(false);
						setShowMoreBtn(true);
					}}
				>
					<div className="p-4 sm:px-6 px-4 overflow-y-auto max-h-[80vh]">
						<h3 className="text-amber-600 text-center font-semibold py-2 mb-4 text-lg border border-amber-200 rounded bg-amber-50">Choose Default Address</h3>
						<ShowMoreAddresses
							data={data}
							showMoreBtn={showMoreBtn}
							handleChange={handleChange}
						/>
					</div>
				</Popup>
			)}
		</>
	);
};

export default memo(Addresses);
