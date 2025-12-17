import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router";

const NewOrderSuccess = () => {
	const location = useLocation();

	const [newOrder, setNewOrder] = useState({});

	useEffect(() => {
		console.log("location from NewOrderSuccess:->", location.state);
		if (location.state) {
			setNewOrder(location.state.newOrder);
		}
	}, []);
	return (
		<div className="max-w-lg mx-auto bg-green-100 rounded-lg p-4 my-4 pb-2 space-y-3">
			<h2 className="w-full bg-green-200 text-green-700 font-semibold text-lg sm:text-2xl px-4 py-3 text-center capitalize">
				New order created successfully!
			</h2>

			<p className="text-amber-600 text-center bg-gray-100 sm:p-4 p-2 upper sm:text-lg text-base">
				Your order id is <span className="italic font-semibold">{newOrder?._id}</span>
			</p>
      <p className="text-gray-500 text-sm mx-2 ">* Please keep this order id for future reference</p>
		</div>
	);
};

export default NewOrderSuccess;
