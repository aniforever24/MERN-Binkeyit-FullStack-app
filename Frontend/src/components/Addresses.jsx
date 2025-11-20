import React, { useEffect, useState, memo } from "react";
import Popup from "./Popup";
import AddAddress from "./AddAddress";
import { AnimatePresence } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { setCustomDefaultAddress } from "../redux/address/addressSlice";

const Addresses = ({ data, defaultAddress, showMoreBtn, setShowMoreBtn }) => {
	const dispatch = useDispatch()
	const { addresses: allAddresses, customDefaultAddress } = useSelector(
		(state) => state.address
	);

	const [firstRender, setFirstRender] = useState(true)
	const [defaultAddressText, setDefaultAddressText] = useState("");
	const [showAddAddress, setShowAddAddress] = useState(false);

	// Event listeners
	const handleClickShowMore = () => {
		if (typeof setShowMoreBtn == "function") {
			setShowMoreBtn(false);
		}
	};
	const handleClickAddAddress = (e) => {
		setShowAddAddress(true);
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

	useEffect(() => {
		if (data.length === 0) {
			setShowMoreBtn(false);
		} else if(firstRender) {
			setShowMoreBtn(true);
			setFirstRender(false)
		}
	}, [data]);

	return (
		<>
			{defaultAddress && (
				<div className="_defaultAddress sm:text-base text-sm p-2 py-3 space-x-3 border-2 border-gray-100 rounded">
					<input
						type="radio"
						name="address"
						id={defaultAddress?._id?.toString()}
						value={defaultAddressText}
						defaultChecked
						onChange={(e) => handleChange(e, defaultAddress?._id?.toString())}
					/>
					<label htmlFor={defaultAddress?._id?.toString()}>
						{defaultAddressText}
					</label>
				</div>
			)}

			{showMoreBtn && data.length > 0 && (
				<button
					className="text-sm text-amber-600 font-medium cursor-pointer active:text-amber-500 ml-4"
					onClick={handleClickShowMore}
				>
					Show More
				</button>
			)}

			{!showMoreBtn &&
				data.length > 0 &&
				data.map((adr, i) => {
					const { addressLine, city, pincode, state, country, mobile } = adr;
					const a = `${addressLine}, ${city} - ${pincode}, ${state}, ${country}`;
					const m = mobile ? `, ${mobile}` : "";
					const id = adr?._id?.toString();
					const value = a + m;

					return (
						<div
							key={"moreAddresses-" + id}
							className="sm:text-base text-sm p-2 py-3 space-x-3 border-2 border-gray-100 rounded"
						>
							<input
								type="radio"
								name="address"
								id={id}
								value={value}
								onChange={(e) => handleChange(e, id)}
							/>
							<label htmlFor={id}>{value}</label>
						</div>
					);
				})}

			{!showMoreBtn && (
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
						<AddAddress />
					</Popup>
				)}
			</AnimatePresence>
		</>
	);
};

export default memo(Addresses);
