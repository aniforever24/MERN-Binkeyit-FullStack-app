import { AnimatePresence } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import AddAddress from "./AddAddress";
import { useDispatch, useSelector } from "react-redux";
import Popup, { PopupContext } from "./Popup";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { twMerge } from "tailwind-merge";
import { deleteAddress, fetchAddress } from "../redux/address/addressSlice";
import { notifyError, notifyWarning } from "../utils/foxToast";

const ShowMoreAddresses = ({
	data,
	showMoreBtn,
	setShowMoreBtn,
	showMoreInPopup,
	handleChange,
	showDeleteOption = false,
}) => {
	const dispatch = useDispatch();
	const { defaultAddress } = useSelector((state) => state.address);
	const {close} = useContext(PopupContext)
	
	const [showAddAddress, setShowAddAddress] = useState(false);
	
	const handleClickAddAddress = (e) => {
		setShowAddAddress(true);
	};
	const handleDeleteAddress = async (e, id) => {
		try {
			// Preven user from deleting default address
			if (id == defaultAddress._id) {
				return notifyError(
					"Cannot delete default address!",
					"Please Select other address as default first."
				);
			}
			// User confirmation to delete the address
			const consent = confirm(
				"Do you really want to delete this address permanently? This action cannot be undone!"
			);
			if (!consent) return;

			await dispatch(deleteAddress({ id })).unwrap();
			dispatch(fetchAddress());
		} catch (error) {
			console.log(error);
		}
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
							className={twMerge(
								"sm:text-base text-sm p-2 py-3 flex justify-between gap-4 border-2 border-gray-100 rounded"
							)}
						>
							<div
								className={twMerge(
									"flex gap-2",
									showDeleteOption && defaultAddress?._id !== id && "max-w-[92%]"
								)}
							>
								<input
									type="radio"
									name="address"
									id={`show-more-address-${id}`}
									value={value}
									onChange={(e) => {
										handleChange(e, id);
										if(showMoreInPopup) {
											close()
										}
									}}
									defaultChecked={defaultAddress?._id == id ? "true" : ""}
								/>
								<label htmlFor={`show-more-address-${id}`} className="">
									{value}
								</label>
							</div>
							{showDeleteOption && defaultAddress?._id !== id && (
								<div className="_deleteOption">
									<RiDeleteBin2Fill
										title="Delete Addrress"
										className="text-lg text-red-400 hover:text-red-500 hover:shadow cursor-pointer"
										onClick={(e) => handleDeleteAddress(e, id)}
									/>
								</div>
							)}
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

export default ShowMoreAddresses;
