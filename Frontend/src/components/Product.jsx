import React, { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	addToCartItems,
	deleteCartItem,
	fetchCartItems,
	updateCartItem,
} from "../redux/cart/cartSlice";
import axiosErrorMsg from "../utils/axiosError";
import Spinner from "./Spinner";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { notifySuccess, notifyWarning } from "../utils/foxToast";
import { calculateDiscountedPrice, formatCurrency } from "../utils/UtilityFunctions";

const Product = (params) => {
	let {
		productData,
		data,
		customClasses,
		handleClick,
		keyExtend,
		newTabOpen = false,
	} = params;
	const navigate = useNavigate();
	if (!(productData || data)) {
		return null;
	}
	if (!customClasses) {
		customClasses = {};
	}
	if (!handleClick) {
		handleClick = (e, data) => {
			e.preventDefault();
			const id = data?._id.toString();
			const name = encodeURIComponent(data?.name);
			if (newTabOpen) {
				window.open(`/product/${name}-${id}`, "_blank", "noopener, noreferrer");
			} else {
				navigate(`/product/${name}-${id}`);
			}
		};
	}
	if (!keyExtend) {
		keyExtend = "";
	}
	const {
		customClassProduct,
		customClassFrame,
		customClassDiscount,
		customClassName,
		customClassUnit,
		customClassPrice,
		customClassBtn,
	} = customClasses;

	const id = productData?._id.toString() || data?._id.toString();
	const src = productData?.images[0].url || data?.images[0].url;
	const name = productData?.name || data?.name;
	const disc = Number(productData?.discount) || Number(data?.discount);
	const unit = productData?.unit || data?.unit;
	const price = Number(productData?.price) || Number(data?.price);
	const stock = Number(productData?.stock) || Number(data?.stock);

	const dispatch = useDispatch();
	const cartItems = useSelector((state) => state.cart.cartItems);
	const totalCartItems = useSelector((state) => state.cart.totalItems);
	const totalCartValue = useSelector((state) => state.cart.totalValue);
	const status = useSelector((state) => state.cart.status);

	const [discountedPrice, setDiscountedPrice] = useState(price)
	const [loading, setLoading] = useState(false);
	const [productInCart, setProductInCart] = useState(false);
	const [productQuantity, setProductQuantity] = useState(0);
	const [cartItem, setCartItem] = useState(null);

	// Event Listeners
	const handleAddClick = async (e, id) => {
		e.preventDefault();
		e.stopPropagation();
		if (loading) return;

		setLoading(true);
		try {
			const add = await dispatch(addToCartItems({ productId: id })).unwrap();
			// console.log('add to cart return data: ', add)
			await dispatch(fetchCartItems()).unwrap();
			setProductInCart(true);
			
		} catch (error) {
			return axiosErrorMsg(error);
		} finally {
			setLoading(false);
		}
	};
	const handleIncrement = async (e, cart_id) => {
		e.preventDefault();
		e.stopPropagation();

		if (status.update === "pending") return;

		const id = cart_id.toString();

		setProductQuantity(productQuantity + 1);
		const d = await dispatch(
			updateCartItem({ id, quantity: productQuantity + 1 })
		).unwrap();
		// notifySuccess("Item added ✔");
		dispatch(fetchCartItems());
	};
	const handleDecrement = async (e, cart_id) => {
		e.preventDefault();
		e.stopPropagation();

		if (status.update === "pending") return;

		const id = cart_id.toString();

		if (productQuantity === 1) {
			const d = await dispatch(deleteCartItem({ id })).unwrap();
			// notifyWarning("Item removed from cart!");
		} else {
			setProductQuantity(productQuantity - 1);
			const d = await dispatch(
				updateCartItem({ id, quantity: productQuantity - 1 })
			).unwrap();
			// notifySuccess("Item updated ✔");
		}
		dispatch(fetchCartItems()).unwrap();
	};

	useEffect(() => {
		const checkExists = cartItems.some((item) => {
			const condition = id === item.product._id;
			if (condition) {
				setProductQuantity(item.quantity);
				setCartItem(item);
			}
			return condition;
		});
		setProductInCart(checkExists);
	}, [cartItems]);	
	useEffect(()=> {
		setDiscountedPrice(calculateDiscountedPrice(price, disc))
	}, [data])

	return (
		<Link
			key={`${id}_${keyExtend}`}
			className={twMerge(
				"_productCard border border-gray-200 w-60 min-w-60 min-h-36 py-3 px-3 bg-white flex flex-col items-center gap-3 cursor-pointer select-none rounded relative",
				customClassProduct
			)}
			onClick={(e) => handleClick(e, data || productData)}
		>
			<div
				className={twMerge(
					"_frame bg-blue-50 w-50 overflow-hidden",
					customClassFrame
				)}
			>
				<img
					src={src}
					alt={name.slice(0, 6)}
					className="w-full h-full object-contain"
					loading="lazy"
				/>
			</div>

			<div
				className={twMerge(
					"flex text-xs gap-3 text-green-700 mr-auto px-0.5 font-semibold",
					customClassDiscount
				)}
			>
				<span>10 min</span>{" "}
				{!!disc && (
					<span className="block bg-green-100 px-1">
						{disc ? disc : 0}% discount
					</span>
				)}
			</div>

			<div
				className={twMerge(
					"flex items-start h-[44px] py-1 bg-gray-50 select-none",
					customClassName
				)}
			>
				<p
					title={name}
					className=" text-gray-600 text-ellipsis line-clamp-2 py-0.5"
				>
					{name}
				</p>
			</div>

			<p className={twMerge("text-md mr-auto text-gray-500", customClassUnit)}>
				{unit && unit}
			</p>

			<div className="w-full text-sm flex justify-between items-center">
				<p
					className={
						price
							? twMerge("sm:text-[17px] font-nunito", customClassPrice)
							: "text-xs"
					}
				>
					{price ? (
						<span className="font-semibold"> {formatCurrency(discountedPrice, true)} </span>
					) : (
						"Not yet declared"
					)}
				</p>
				{!!stock ? (
					!productInCart ? (
						<button
							className={twMerge(
								"bg-green-700 hover:bg-green-900 active:bg-green-700 text-white px-3 py-1 rounded cursor-pointer overflow-hidden",
								customClassBtn
							)}
							onClick={(e) => handleAddClick(e, id)}
						>
							{loading ? (
								<Spinner
									borderClr={"text-emerald-700"}
									customClass={"min-h-5 min-w-5 border-2"}
									customClassTrack={"min-h-5 min-w-5 border-2"}
								/>
							) : (
								"Add"
							)}
						</button>
					) : (
						<div
							className="flex gap-2"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
						>
							<button
								className="bg-green-700 hover:bg-green-900 active:bg-green-700 text-white px-1.5 py-1 rounded cursor-pointer"
								onClick={(e) => handleDecrement(e, cartItem?._id)}
							>
								<FaMinus />
							</button>
							<span className="font-medium text-[1.1em]">{productQuantity}</span>
							<button
								className="bg-green-700 hover:bg-green-900 active:bg-green-700 text-white px-1.5 py-1 rounded cursor-pointer"
								onClick={(e) => handleIncrement(e, cartItem?._id)}
							>
								<FaPlus />
							</button>
						</div>
					)
				) : (
					<p className="text-red-500 font-medium">Out of Stock</p>
				)}
			</div>
		</Link>
	);
};

export default memo(Product);
