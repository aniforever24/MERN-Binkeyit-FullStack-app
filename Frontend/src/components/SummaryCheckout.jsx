import React, { useEffect, useState } from "react";
import { debounce, formatCurrency } from "../utils/UtilityFunctions";
import { twMerge } from "tailwind-merge";
import Divider from "../components/Divider";
import { LuDot } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
	setCustomDefaultAddress,
	updateAddress,
} from "../redux/address/addressSlice";
import { notifyError, notifyWarning, toastLoading } from "../utils/foxToast";
import authAxiosInstance from "../config/authAxiosConfig";
import SummaryApi from "../Common/SummaryApi";
import { deleteCartItem, fetchCartItems } from "../redux/cart/cartSlice";
import axiosErrorMsg from "../utils/axiosError";

const SummaryCheckout = () => {
	const dispatch = useDispatch();
	const {
		cartItems,
		totalItems,
		totalValue,
		totalActualValue,
		totalDiscount,
		otherCharges: fixedOtherCharges,
		status,
	} = useSelector((state) => state.cart);
	const { customDefaultAddress, defaultAddress } = useSelector(
		(state) => state.address
	);
	const navigate = useNavigate();
	// const debouncedNavigate = debounce(navigate, 1550)

	const [finalCartValue, setFinalCartValue] = useState(0);
	const [loading, setLoading] = useState(false);
	const [products, setProducts] = useState([]); // Array of products
	const [productIds, setProductIds] = useState([]); // Array of product ids
	const [cartItemsIds, setCartItemsIds] = useState([])
	const [fixedOtherChargesValue, setFixedOtherChargesValue] = useState(0);

	// Event Listeners
	const handleCashOnDelivery = async (e) => {
		e.preventDefault();
		if (!defaultAddress) {
			return notifyWarning("Please provide an address!");
		}
		if (loading) return;

		try {
			setLoading(true);
			let deliveryAddress = defaultAddress;

			// Conditional default address updation
			try {
				if (
					customDefaultAddress &&
					customDefaultAddress?.address?._id !== defaultAddress?._id
				) {
					const result = await Swal.fire({
						title:
							'<h4 class="text-xl text-gray-600">Would you like to save this address as your new default address?</h4>',
						showDenyButton: true,
						// showCancelButton: true,
						confirmButtonText: "Make Default",
						denyButtonText: `skip`,
						allowOutsideClick: false,
					});
					if (result.isConfirmed) {
						const { data } = await dispatch(
							updateAddress({ id: customDefaultAddress?.address?._id })
						).unwrap();
						deliveryAddress = data;
						dispatch(
							setCustomDefaultAddress({
								address: null,
								index: -1,
							})
						);
					} else {
						deliveryAddress = customDefaultAddress.address;
					}
				}
			} catch (error) {
				console.log("error in updating default address:", error);
				notifyError(
					"There's an error in updating your default address.",
					"Please update from profile section."
				);
			}

			// Create new order
			let totalAmt = totalValue;
			if (totalValue < 500) {
				totalAmt += fixedOtherChargesValue;
			}
			// console.log('totalAmt:', totalAmt)

			const { data: responseData } = await authAxiosInstance({
				...SummaryApi.orderPayment,
				data: {
					products: productIds,
					productDetails: cartItemsIds,
					deliveryAddress,
					subTotalAmt: totalValue,
					totalAmt,
					paymentMode: "cod",
				},
			});

			const newOrder = responseData.data;
			if (responseData.success) {
				// Empty cart on order confirmation
				const { data: responseData } = await authAxiosInstance({
					...SummaryApi.emptyCart,
					data: { id: deliveryAddress?.userId },
				});
				dispatch(fetchCartItems());

				await Swal.fire({
					title: "Your new order created successfully!",
					icon: "success",
					allowOutsideClick: false,
					timer: 3000,
					timerProgressBar: true,
					showConfirmButton: false,
				});

				navigate(`/new-order/success/${newOrder?._id}`, { state: { newOrder } });
			}
		} catch (error) {
			console.log("error on submitting cod btn-->", error);
			navigate(`/new-order/failure`, { state: { error } });
		} finally {
			setLoading(false);
		}
	};
	const handlePayOnline = async (e) => {
		e.preventDefault;
		if (loading) return;
		setLoading(true);
		let deliveryAddress = defaultAddress;

		// Conditional default address updation
		try {
			if (
				customDefaultAddress &&
				customDefaultAddress?.address?._id !== defaultAddress?._id
			) {
				const result = await Swal.fire({
					title:
						'<h4 class="text-xl text-gray-600">Would you like to save this address as your new default address?</h4>',
					showDenyButton: true,
					// showCancelButton: true,
					confirmButtonText: "Make Default",
					denyButtonText: `skip`,
					allowOutsideClick: false,
				});
				if (result.isConfirmed) {
					const { data } = await dispatch(
						updateAddress({ id: customDefaultAddress?.address?._id })
					).unwrap();
					deliveryAddress = data;
					dispatch(
						setCustomDefaultAddress({
							address: null,
							index: -1,
						})
					) 
				} else {
						deliveryAddress = customDefaultAddress.address;
					}
			}
		} catch (error) {
			console.log("error in updating default address:", error);
			notifyError(
				"There's an error in updating your default address.",
				"Please update from profile section."
			);
		}

		// Online payment redirection setup
		try {
			const api = authAxiosInstance({
				...SummaryApi.orderPayment,
				data: {
					productDetails: cartItems,
					deliveryAddress,
					fixedOtherChargesValue,
					subTotalAmt: totalValue,
					paymentMode: "online",
				},
			});

			toastLoading("Loading...");

			const { data: responseData } = await api;

			const data = responseData.data;
			const {payment_url, sessionId} = data;
			
			window.location.href = payment_url;

		} catch (error) {
			axiosErrorMsg(error)
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (cartItems[0]) {
			// console.log('cartItems:', cartItems)
			const extraCharges = Object.values(fixedOtherCharges).reduce((acc, c) => {
				return acc + c;
			}, 0);
			setFixedOtherChargesValue(extraCharges);
			if (totalValue >= 500) {
				setFinalCartValue(totalValue);
			} else {
				setFinalCartValue(totalValue + extraCharges);
			}
		}
	}, [cartItems, fixedOtherCharges]);
	useEffect(() => {
		if (cartItems[0]) {
			let prods = [];
			let cartIds = [];
			const cartProductIds = cartItems.map((c, i) => {
				prods[i] = c.product;
				cartIds[i] = c._id;
				return c.product._id;
			});
			setProducts(prods);
			setProductIds(cartProductIds);
			setCartItemsIds(cartIds)
		}
	}, [cartItems]);
	// useEffect(() => {
	// 	console.log("productIds:", productIds);
	// 	console.log("products:", products);
	// }, [productIds, products]);

	return (
		<>
			<div className="_orderSummary text-sm md:text-base sticky top-0 overflow-x-hidden bg-white flex flex-col sm:py-4 py-2 sm:px-4 px-3">
				<div className="_head font-semibold text-gray-800 text-lg flex justify-between items-center w-full">
					<h2 className="max-md:text-base text-xl">Summary</h2>
				</div>

				<div className="my-2">
					<Divider />
				</div>

				<div className="_summaryItems px-1 text-gray-700 space-y-2 font-medium">
					<div className="flex justify-between items-center">
						<div className="flex gap-1">
							<div className="flex items-center font-semibold">
								<span className="">ITEMS</span>
								<div className="text-xl">
									<LuDot />
								</div>
							</div>
							<span>{cartItems.length}</span>
						</div>
						<span className="font-nunito">
							{formatCurrency(totalActualValue, true)}
						</span>
					</div>

					<div
						className={twMerge(
							"flex justify-between items-center",
							totalValue >= 500 && "line-through text-gray-400"
						)}
					>
						<p className={twMerge("")}>Delivery Charges</p>
						<p className={twMerge("font-nunito")}>{fixedOtherCharges.delivery}</p>
					</div>
					<div
						className={twMerge(
							"flex justify-between items-center",
							totalValue >= 500 && "line-through text-gray-400"
						)}
					>
						<p className={twMerge("")}>Handling Fees</p>
						<p className={twMerge("font-nunito")}>{fixedOtherCharges.handling}</p>
					</div>
					<div
						className={twMerge(
							"flex justify-between items-center",
							totalValue >= 500 && "line-through text-gray-400"
						)}
					>
						<p className={twMerge("")}>Plateform Fees</p>
						<p className={twMerge("font-nunito")}>{fixedOtherCharges.plateform}</p>
					</div>

					<div className="flex justify-between items-center text-green-700 bg-green-50 md:py-2 py-1">
						<span>Discount</span>
						<span className="font-nunito">{formatCurrency(totalDiscount, true)}</span>
					</div>

					{/* <div className="flex flex-col gap-3">
						<h3>PROMO CODE</h3>
						<div>
							<input
								className="border border-gray-300 outline-none focus:placeholder:opacity-0 w-full placeholder:text-gray-400 placeholder:font-normal bg-white p-2 rounded"
								type="text"
								placeholder="Enter your promo code"
							/>
						</div>
						<button className="bg-green-500 text-white w-fit p-2 px-4 rounded cursor-pointer hover:bg-green-600 active:bg-green-700">
							Apply
						</button>
					</div> */}
				</div>

				<div className="my-2">
					<Divider />
				</div>

				<div className="flex justify-between items-center font-semibold text-blue-500">
					<span className="[word-spacing:2px]">Total Items</span>
					<span className="font-nunito">{totalItems}</span>
				</div>
				<div className="flex justify-between items-center font-bold">
					<span>Total Cost</span>
					<span className="font-nunito">{formatCurrency(finalCartValue, true)}</span>
				</div>

				<div className="flex justify-between sm:gap-4 gap-0 sm:flex-row flex-col sm:mt-10 mt-5">
					<Link
						className={twMerge(
							"bg-green-600 hover:bg-green-500 active:bg-green-700 text-white  font-medium rounded-md p-2.5 my-2 mb-0 cursor-pointer block w-full text-center",
							loading &&
								"bg-gray-500 hover:bg-gray-500 active:bg-gray-500 text-gray-200 cursor-not-allowed"
						)}
						onClick={(e) => handleCashOnDelivery(e)}
					>
						Cash On Delivery
					</Link>
					<Link
						className={twMerge(
							"bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium rounded-md p-2.5 my-2 mb-0 cursor-pointer block w-full text-center",
							loading &&
								"bg-gray-500 hover:bg-gray-500 active:bg-gray-500 text-gray-200 cursor-not-allowed"
						)}
						onClick={(e) => handlePayOnline(e)}
					>
						Pay Online
					</Link>
				</div>
			</div>
		</>
	);
};

export default SummaryCheckout;
