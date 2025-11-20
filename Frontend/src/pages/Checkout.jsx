import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addAddress, fetchAddress } from "../redux/address/addressSlice";
import Addresses from "../components/Addresses";

const Checkout = () => {
	const dispatch = useDispatch();
	const {
		addresses: allAddresses,
		defaultAddress,
		count,
		status,
	} = useSelector((state) => state.address);

	const [data, setData] = useState([]);
	const [showMoreBtn, setShowMoreBtn] = useState(true);

	useEffect(() => {
		dispatch(fetchAddress())
	}, [dispatch]);

	useEffect(() => {
		if (allAddresses[0]) {
			const nonDefaultAddresses = allAddresses.filter(
				(addr) => addr?._id != defaultAddress?._id
			);
			setData(nonDefaultAddresses);
		}
	}, [allAddresses]);

	return (
		<section className="text-gray-800">
			<div className="container mx-auto grid md:grid-cols-[1.5fr_1fr] grid-cols-1 gap-x-0.5">
				<div className="_addressBlock bg-blue-100 min-h-110 p-4 border border-gray-200 space-y-3">
					<h3 className="font-semibold text-xl">Choose Your Address</h3>

					<div className="_addresses shadow border border-neutral-200 bg-white space-y-3 sm:p-4 p-3 sm:max-h-[70vh] max-h-[60vh] overflow-auto rounded-md">
						<Addresses
							data={data}
							defaultAddress={defaultAddress}
							showMoreBtn={showMoreBtn}
							setShowMoreBtn={setShowMoreBtn}
						/>
					</div>
				</div>

				<div className="_addressBlock bg-green-300 p-4">Summary</div>
			</div>
		</section>
	);
};

export default Checkout;
