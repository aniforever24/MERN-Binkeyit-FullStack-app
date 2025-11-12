import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Divider from "../components/Divider";
import CartDataTable from "../components/CartDataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { LuDot } from "react-icons/lu";
import Tooltip from "../components/Tooltip";
import {
	formatCurrency,
	calculateDiscountedPrice,
	debounce,
} from "../utils/UtilityFunctions";
import {
	fetchCartItems,
	updateCartItem,
	deleteCartItem,
} from "../redux/cart/cartSlice";
import emptyCart from "../assets/img/empty_cart.webp";
import { twMerge } from "tailwind-merge";
import { Link } from "react-router-dom";

const Cart = () => {
	const dispatch = useDispatch();
	const cartItems = useSelector((state) => state.cart.cartItems);
	const totalItems = useSelector((state) => state.cart.totalItems);
	const totalValue = useSelector((state) => state.cart.totalValue);
	const totalActualValue = useSelector((state) => state.cart.totalActualValue);
	const totalDiscount = useSelector((state) => state.cart.totalDiscount);
	const status = useSelector((state) => state.cart.status);
	const fixedOtherCharges = useSelector((state) => state.cart.otherCharges);

	const [wait, setWait] = useState(true);
	const [otherCharges, setOtherCharges] = useState(fixedOtherCharges);
	const [finalCartValue, setFinalCartValue] = useState(0);

	const debouncedWait = debounce(setWait, 500);
	const columnHelper = createColumnHelper();
	const columns = useMemo(
		() => [
			columnHelper.accessor("productDetails", {
				header: () => <h3 className="max-md:text-sm">Product Details</h3>,
				cell: (info) => {
					const product = info.row.original.product;
					const id = info.row.original._id.toString();
					return (
						<div className="flex gap-4 text-gray-500">
							<div className="_frame w-15 h-15 min-w-15 md:w-22 md:h-22 md:min-w-22 mb-6 bg-blue-50 overflow-hidden">
								<img
									className="w-full h-full object-contain"
									src={product.images[0].url}
									alt={`${product.name.slice(0, 10)}.jpg`}
								/>
							</div>
							<div className="flex flex-col gap-1.5">
								<p
									title={product.name}
									className="line-clamp-1 md:text-[15px] text-sm overflow-hidden text-ellipsis text-black"
								>
									{product.name}
								</p>
								<div className="flex gap-10">
									<span className=" text-sm md:text-[15px]">{product.unit}</span>
									<span className="text-green-500 font-medium max-md:text-sm">
										{product.discount}% Off
									</span>
								</div>
								<Tooltip text="Remove" tooltipStyle="bg-red-600/75" tooltipStyleInvisible="bg-red-600">
									<button
										// title="Remove"
										className="block text-red-500 cursor-pointer max-md:text-sm hover:text-red-600 active:scale-90 active:shadow w-fit"
										onClick={(e) => handleDelete(e, id)}
									>
										<RiDeleteBin2Fill />
									</button>
								</Tooltip>
							</div>
						</div>
					);
				},
				size: 600,
				minSize: 200,
			}),
			columnHelper.accessor("quantity", {
				header: () => <h3 className="text-center">Quantity</h3>,
				cell: (info) => {
					const id = info.row.original._id.toString();
					const q = info.row.original.quantity;
					return (
						<div className="text-center h-full flex gap-1 w-fit max-md:text-sm mx-auto">
							<button
								className="cursor-pointer active:scale-95 active:text-green-500 active:shadow text-gray-500 text-xs md:text-[15px]"
								onClick={(e) => handleDecrement(e, id, q)}
							>
								<FaMinus />
							</button>
							<span className="border border-gray-200 bg-gray-50 text-gray-600 w-10 text-center font-nunito">
								{info.getValue()}
							</span>
							<button
								className="cursor-pointer active:scale-95 active:text-green-500 active:shadow text-gray-500 text-xs md:text-[15px]"
								onClick={(e) => handleIncrement(e, id, q)}
							>
								<FaPlus />
							</button>
						</div>
					);
				},
			}),
			columnHelper.accessor((row) => row.product.price, {
				id: "price",
				header: () => <h3 className="text-center">Price</h3>,
				cell: (info) => {
					// console.log(info);
					return (
						<span className="block text-center text-black font-semibold font-nunito max-md:text-sm">
							{formatCurrency(info.getValue())}
						</span>
					);
				},
			}),
			columnHelper.accessor("total", {
				header: () => <h3 className="text-center">Total</h3>,
				cell: (info) => {
					const d = info.row.original;
					const q = d.quantity;
					const p = d.product.price;
					const p_dis = calculateDiscountedPrice(p, d.product.discount);
					const total = p * q;
					return (
						<div className="text-center font-nunito font-semibold text-black max-md:text-sm">
							<div>{formatCurrency(p_dis * q)}</div>
							<div className="line-through text-gray-400">{formatCurrency(total)}</div>
						</div>
					);
				},
			}),
		],
		[cartItems]
	);

	// Event Listeners
	async function handleIncrement(e, id, q) {
		e.preventDefault();
		if (status.update === "pending" || status.fetch === "pending") return;

		await dispatch(updateCartItem({ id, quantity: q + 1 })).unwrap();
		dispatch(fetchCartItems());
	}
	async function handleDecrement(e, id, q) {
		e.preventDefault();
		if (status.update === "pending" || status.fetch === "pending" || q === 1)
			return;

		await dispatch(updateCartItem({ id, quantity: q - 1 })).unwrap();
		dispatch(fetchCartItems());
	}
	async function handleDelete(e, id) {
		e.preventDefault();
		if (status.delete === "pending") return;

		const consent = confirm("Are you sure to remove this item from your cart?");
		if (consent) {
			await dispatch(deleteCartItem({ id })).unwrap();
			dispatch(fetchCartItems());
		}
	}

	useEffect(() => {
		if (cartItems[0]) {
			setWait(false);
			if (totalValue >= 500) {
				setOtherCharges((prev) => {
					return {
						...prev,
						delivery: 0,
						handling: 0,
						plateform: 0,
					};
				});
			} else {
				setOtherCharges((prev) => {
					return {
						...prev,
						delivery: 25,
						handling: 10,
						plateform: 5,
					};
				});
			}
		} else {
			debouncedWait(false);
		}
	}, [cartItems]);
	useEffect(() => {
		if (cartItems[0]) {
			const extraCharges = Object.values(otherCharges).reduce((acc, c) => {
				return acc + c;
			}, 0);
			setFinalCartValue(totalValue + extraCharges);
		}
	}, [cartItems, otherCharges]);

	return cartItems[0] ? (
		<section className="_cartPageSection p-4">
			<div className="_cartPage container mx-auto grid max-md:gap-y-2 lg:grid-cols-[3fr_1.3fr] xl:grid-cols-[3fr_1fr] rounded shadow min-h-[50vh] max-h-[76vh] relative overflow-auto md:scrollbar scrollbar-narrow [scrollbar-color:#ffbe00_#e5e7eb]">
				{/* Shopping Cart */}
				<div className="_shoppingCart bg-white flex flex-col lg:p-10 p-6 text-gray-800">
					<div className="_head font-semibold px-2 text-xl max-sm:text-base flex justify-between items-center sticky top-0 md:py-4 py-2 w-full bg-white z-9">
						<h2>Shopping Cart</h2>
						<span>{cartItems.length} Items</span>
					</div>

					<div className="my-4 sticky z-8 top-14">
						<Divider />
					</div>

					<div className="">
						<CartDataTable data={cartItems} columns={columns} />
					</div>
				</div>

				{/* Order Summary */}
				<div className="_orderSummary text-sm md:text-base sticky top-0 max-h-[80vh] md:w-full w-[86vw] max-sm:w-[82vw] overflow-x-hidden bg-gray-100 flex flex-col lg:py-10 lg:px-6 px-2 md:py-6 py-2">
					<div className="_head font-semibold text-gray-800 text-lg flex justify-between items-center md:py-4 w-full">
						<h2 className="max-md:text-base text-xl">Order Summary</h2>
					</div>

					<div className="my-4">
						<Divider />
					</div>

					<div className="_summaryItems px-1 text-gray-700 space-y-5 font-medium">
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
							<span className="font-nunito">
								{formatCurrency(totalDiscount, true)}
							</span>
						</div>

						<div className="flex flex-col gap-3">
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
						</div>
					</div>

					<div className="my-6">
						<Divider />
					</div>

					<div className="flex justify-between items-center font-semibold text-blue-500">
						<span className="[word-spacing:2px]">Total Items</span>
						<span className="font-nunito">
							{totalItems}
						</span>
					</div>
					<div className="flex justify-between items-center font-bold">
						<span>Total Cost</span>
						<span className="font-nunito">
							{formatCurrency(finalCartValue, true)}
						</span>
					</div>

					<Link to="/checkout" className="bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white p-2.5 my-2 mb-0 mt-4 cursor-pointer ">
						Checkout
					</Link>
				</div>
			</div>
		</section>
	) : (
		!wait && (
			<div className="space-y-6 sm:py-10 py-6">
				<h3 className="text-center font-semibold text-amber-500 text-xl sm:text-2xl">
					Your Cart is empty!
				</h3>
				<div className="_frame-emptyCart sm:w-130 sm:max-w-none max-w-100 overflow-hidden bg-transparent rounded-3xl mx-auto shadow">
					<img
						className="w-full h-full object-contain"
						src={emptyCart}
						alt="empty-cart.jpg"
					/>
				</div>
			</div>
		)
	);
};

export default Cart;
