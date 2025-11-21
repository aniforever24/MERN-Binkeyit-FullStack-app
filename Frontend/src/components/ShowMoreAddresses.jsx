import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import AddAddress from "./AddAddress";
import { useDispatch, useSelector } from "react-redux";
import Popup from "./Popup";

const ShowMoreAddresses = ({
	data,
	showMoreBtn,
	handleChange,
}) => {
	const dispatch = useDispatch();
	const {defaultAddress} = useSelector((state) => state.address);
	
	const [showAddAddress, setShowAddAddress] = useState(false);

	const handleClickAddAddress = (e) => {
		setShowAddAddress(true);
	};

	return (
		<>
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
								id={`show-more-address-${id}`}
								value={value}
								onChange={(e) => handleChange(e, id)}
								defaultChecked={defaultAddress?._id == id ? "true" : ""}
							/>
							<label htmlFor={`show-more-address-${id}`}>
								{value}</label>
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

export default ShowMoreAddresses;
