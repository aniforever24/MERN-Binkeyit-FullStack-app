import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router";
import Spinner from "./Spinner";
import { createPortal } from "react-dom";
import authAxiosInstance from "../config/authAxiosConfig";
import SummaryApi from "../Common/SummaryApi";
import { fetchCartItems } from "../redux/cart/cartSlice";
import { useDispatch } from "react-redux";
import Divider from "./Divider";

const NewOrderSuccess = () => {
	const location = useLocation();
	const queryParams = new URLSearchParams(window.location.search);
	const params = useParams();
	const dispatch = useDispatch();

	const [newOrder, setNewOrder] = useState({});
	const [newOnlineOrder, setNewOnlineOrder] = useState(null);

	// api call to confirm payment
	const confirmPayment = async (paymentId) => {
		const source = queryParams.get("source");
		const sessionId = params.orderId;

		if (source && source === "stripe" && sessionId) {
			const response = await authAxiosInstance({
				...SummaryApi.paymentConfirmation,
				data: { sessionId },
			});

			if (response.data.success) {
				const { order } = response.data?.data;
				const { paymentId, userId, _id: orderId } = order;

				if (paymentId) {
					// Empty cart on order confirmation
					await authAxiosInstance({
						...SummaryApi.emptyCart,
						data: { id: userId },
					});
					dispatch(fetchCartItems());
				}

				window.location.href = `${
					import.meta.env.VITE_BASE_URL
				}/new-order/success/${orderId}?status=paid&paymentStatus=confirmed&mode=online&paymentId=${paymentId}`;
			} else {
				window.location.href = `${
					import.meta.env.VITE_BASE_URL
				}/new-order/failure/?status=unknown&paymentStatus=notConfirmed&mode=online`;
			}
		}
	};

	useEffect(() => {
		confirmPayment();
		if (location.state) {
			setNewOrder(location.state.newOrder);
		}

		if (
			queryParams.get("mode") === "online" &&
			queryParams.get("paymentStatus") === "confirmed"
		) {
			setNewOnlineOrder({
				orderId: params.orderId,
				paymentId: queryParams.get("paymentId"),
			});
		}
	}, []);

	if (queryParams.get("source") === "stripe") {
		return (
			<>
				{createPortal(
					<div className="absolute top-0 bottom-0 left-0 right-0 z-90 w-full h-full bg-white pt-[20%]">
						<Spinner borderClr="text-amber-500" />
					</div>,
					document.body
				)}
			</>
		);
	}

	return (
		<div className="max-w-lg md:min-w-[520px] mx-auto bg-green-100 rounded-lg p-6 my-4 pb-10">
		<div className="space-y-3 ">
			<h2 className="w-full bg-green-200 text-green-700 font-semibold text-lg sm:text-2xl px-4 py-3 text-center capitalize">
				New order created successfully!
			</h2>
			{newOnlineOrder ? (
				<>
					<p className="text-amber-600 text-left bg-gray-100 sm:p-4 p-2 upper sm:text-lg text-base flex flex-col gap-2">
						<div className="flex flex-col">
							<span>Your order id is </span>
							<span className="italic font-semibold text-wrap break-words md:text-base text-sm bg-yellow-100 text-center">
								{newOnlineOrder.orderId}
							</span>
						</div>
						<Divider/>
						<div className="flex flex-col">
							<span>Your payment id is </span>
							<span className="italic font-semibold text-wrap break-words md:text-base text-sm bg-yellow-100 text-center">
								{newOnlineOrder.paymentId}
							</span>
						</div>
					</p>
				</>
			) : (
				<>
					<p className="text-amber-600 text-left bg-gray-100 sm:p-4 p-2 upper sm:text-lg text-base">
						<span>Your order id is: </span>
						<span className="italic font-semibold text-wrap break-words text-base">
							{newOrder?._id || params.orderId}
						</span>
					</p>
				</>
			)}
			<p className="text-gray-500 text-sm mx-2 relative top-5">
				{newOnlineOrder ? "* Please keep this order id and payment id for future reference" : "* Please keep this order id for future reference"}				
			</p>
		</div>
		</div>
	);
};

export default NewOrderSuccess;
