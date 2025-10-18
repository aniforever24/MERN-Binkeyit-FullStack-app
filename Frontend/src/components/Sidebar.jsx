import React, { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import { MdClose } from "react-icons/md";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FaPlus, FaMinus } from "react-icons/fa6";
import ShoppingCart from "../assets/img/Fast Cart.svg";
import Divider from "./Divider";
import { useDispatch, useSelector } from "react-redux";
import {
	addToCartItems,
	fetchCartItems,
	deleteCartItem,
	updateCartItem,
} from "../redux/cart/cartSlice";
import {
	calculateDiscountedPrice,
	formatCurrency,
} from "../utils/UtilityFunctions";
import { motion, AnimatePresence, easeInOut } from "motion/react";
import { v4 as uuidv4 } from "uuid";
import emptyCart from "../assets/img/empty_cart.webp";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/context";
import { notifyError, notifyWarning } from "../utils/foxToast";

const Sidebar = ({ close }) => {
	const { isUserLoggedIn } = useContext(GlobalContext);
	
	const location = useLocation();
	const dispatch = useDispatch();
	const cartItems = useSelector((state) => state.cart.cartItems);
	const totalCartValue = useSelector((state) => state.cart.totalValue);
	const totalCartItems = useSelector((state) => state.cart.totalItems);
	const status = useSelector((state) => state.cart.status);
	const [openSidebar, setOpenSidebar] = close;

	const [data, setData] = useState([]);
	const [productQuantity, setProductQuantity] = useState([]);

	const keyRef = useRef();

	// Event Listeners
	const handleIncrement = async (e, cart_id, index) => {
		e.preventDefault();
		// e.stopPropagation();

		if (status.update === "pending") return;

		const id = cart_id.toString();

		const d = await dispatch(
			updateCartItem({ id, quantity: productQuantity[index] + 1 })
		).unwrap();
		dispatch(fetchCartItems());
	};
	const handleDecrement = async (e, cart_id, index) => {
		e.preventDefault();
		// e.stopPropagation();

		if (status.update === "pending") return;

		const id = cart_id.toString();

		if (productQuantity[index] === 1) {
			return;
		} else {
			const d = await dispatch(
				updateCartItem({ id, quantity: productQuantity[index] - 1 })
			).unwrap();
			dispatch(fetchCartItems()).unwrap();
		}
	};
	const handleDelete = async (e, cart_id) => {
		e.preventDefault();
		// e.stopPropagation()
		if (status.delete === "pending") return;

		const consent = window.confirm(
			"Are your sure to remove this item completely from your cart?"
		);
		if (consent) {
			const d = await dispatch(deleteCartItem({ id: cart_id })).unwrap();
			await dispatch(fetchCartItems()).unwrap();
		}
	};

	useEffect(() => {
		keyRef.current = uuidv4();
	}, []);
	useEffect(() => {
		if (openSidebar) setOpenSidebar(false);
	}, [location.pathname]);
	useEffect(() => {
		if (cartItems[0]) {
			const newData = cartItems.map((item, i) => {
				return item.product;
			});
			const quantityArr = cartItems.map((item, i) => {
				return item.quantity;
			});
			setData(newData);
			setProductQuantity(quantityArr);
		}
	}, [cartItems]);

	return (
		<AnimatePresence>
			{openSidebar && isUserLoggedIn && (
				<>
					<motion.div
						key="backdrop"
						initial={{ opacity: 0 }}
						animate={{ opacity: 0.55 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="fixed inset-0 bg-black"
						onClick={() => setOpenSidebar(false)}
					/>
					<motion.div
						key={keyRef.current}
						initial={{ x: "100%", opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
						exit={{ x: "100%", opacity: 0, transition: { duration: 0.2 } }}
						className={twMerge(
							"_sidebar rounded fixed top-0 right-0 z-50 sm:p-4 p-2 sm:min-h-52 min-h-110 sm:min-w-32  bg-[#FFFFF9] overflow-hidden shadow",
							"bg-neutral-100"
						)}
					>
						<div
							className="absolute top-0.5 right-3 active:text-red-800 cursor-pointer hover:text-red-600"
							onClick={() => setOpenSidebar(false)}
						>
							<MdClose size="22" />
						</div>

						<div className="pr-2">
							<div className="_frameShoppingCart w-11 mx-auto">
								<img src={ShoppingCart} className="w-full h-full object-contain"></img>
							</div>
						</div>
						<h3 className="text-center mb-2 text-gray-800 font-semibold relative">
							Your Cart
							<span className="absolute right-1 -bottom-2.5 text-sm font-semibold font-nunito normal-case">
								{cartItems.length} Items
							</span>
						</h3>

						<div className="shadow">
							<Divider />
						</div>

						{cartItems[0] && (
							<>
								<motion.div
									initial="hidden"
									animate="show"
									variants={{
										hidden: {},
										show: { transition: { staggerChildren: 0.2, delayChildren: 0.2 } }, // delay between children
									}}
									className="_cartProducts flex flex-col text-sm mt-6 overflow-y-auto max-h-[56vh] scroll-smooth [scrollbar-width:thin] [scrollbar-color:#00a63e_#fffbeb]"
								>
									<AnimatePresence>
										{data[0] &&
											data.map((p, i) => {
												const src = p?.images[0]?.url;
												const priceAfterDisc = calculateDiscountedPrice(
													p?.price,
													p?.discount
												);
												const price = formatCurrency(priceAfterDisc, true);
												const originalPrice = formatCurrency(p?.price, true);
												const quantity = productQuantity[i];

												return (
													<motion.div
														key={`${p?._id}_cartProduct`}
														variants={{
															hidden: { opacity: 0, x: -30 },
															show: { opacity: 1, x: 0 },
														}}
														exit={{
															opacity: 0,
															scale: 0,
															rotate: 120,
															filter: "blur(6px) brightness(2)",
															transition: { duration: 0.3 },
														}}
														transition={{ duration: 0.3 }}
														className="_cartProduct border border-gray-50 bg-white flex gap-2 my-1 shadow-2xl/10 min-h-[150px] p-3 py-4 w-72 rounded-md overflow-hidden"
													>
														<div className="_productImage overflow-hidden h-30 w-[30%] bg-neutral-50 border border-neutral-50 shadow-xs rounded-md">
															<img
																className="w-full h-full object-contain"
																src={src}
																alt={`${p?.name.slice(10)}.jpg`}
															/>
														</div>

														<div className=" max-w-[70%] flex flex-col justify-between text-gray-700">
															<p className="_name line-clamp-3 text-[13px] text-ellipsis overflow-hidden font-medium">
																{p?.name}{" "}
															</p>

															<div className="flex flex-col gap-2 text-gray-800">
																<div className="flex justify-between items-center">
																	<span className="font-nunito font-medium">{price}</span>
																	{!!p?.discount && (
																		<span className="block font-nunito font-medium pr-4 line-through">
																			{originalPrice}
																		</span>
																	)}
																</div>

																<div className="flex pb-1">
																	<button
																		className="bg-green-600 text-white px-1 cursor-pointer active:scale-90"
																		onClick={(e) => handleDecrement(e, cartItems[i]._id, i)}
																	>
																		<FaMinus />
																	</button>

																	<span className="min-w-7 text-center bg-neutral-100">
																		{quantity}
																	</span>

																	<button
																		className="bg-green-600 text-white px-1 cursor-pointer active:scale-90"
																		onClick={(e) => handleIncrement(e, cartItems[i]._id, i)}
																	>
																		<FaPlus />
																	</button>

																	<button
																		className="text-red-600 ml-3 cursor-pointer active:scale-90"
																		title="remove"
																		onClick={(e) => handleDelete(e, cartItems[i]._id)}
																	>
																		<RiDeleteBin2Fill size="22" />
																	</button>
																</div>
															</div>
														</div>
													</motion.div>
												);
											})}
									</AnimatePresence>
								</motion.div>

								<div className="shadow my-6 mb-8">
									<Divider />
								</div>

								<div className="_subtotal font-semibold bg-blue-50 border border-gray-100 py-2 rounded shadow flex justify-between items-center px-4 text-sm text-gray-700">
									<span className="">Subtotal</span>
									<span className="font-nunito font-bold">
										{formatCurrency(totalCartValue, true)}
									</span>
								</div>

								<Link
									to="checkout"
									className="block text-center bg-black w-full text-white py-2 my-2 mb-1 rounded text-sm cursor-pointer active:scale-[98%]"
								>
									Check Out
								</Link>
								<Link
									to="cart"
									className="block text-center bg-white border hover:shadow-sm w-full text-black py-2 my-1 rounded text-sm cursor-pointer active:scale-[98%]"
								>
									View Cart
								</Link>
							</>
						)}

						{!cartItems[0] && (
							<div className="my-6 flex flex-col-reverse gap-4">
								<div className="_emptyCartFrame w-60 rounded-full overflow-hidden mx-2">
									<img className="w-full h-full object-contain" src={emptyCart} alt="" />
								</div>
								<p className="text-center my-2 text-lg text-amber-500 text-shadow-2xs font-nunito">
									Your Cart is empty!
								</p>
							</div>
						)}
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default Sidebar;
