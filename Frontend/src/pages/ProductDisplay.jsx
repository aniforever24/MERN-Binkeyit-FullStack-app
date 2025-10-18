import React, { memo, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router";
import {
	calculateDiscountedPrice,
	formatCurrency,
	setPageTitle,
} from "../utils/UtilityFunctions";
import axiosErrorMsg from "../utils/axiosError";
import axiosInstance from "../config/axiosConfig";
import SummaryApi from "../Common/SummaryApi";
import { twMerge } from "tailwind-merge";
import {
	IoCaretBackSharp as Previous,
	IoCaretForwardSharp as Next,
} from "react-icons/io5";
import img1 from "../assets/img/minute_delivery.png";
import img2 from "../assets/img/Best_Prices_Offers.png";
import img3 from "../assets/img/Wide_Assortment.png";
import { v4 as uuidv4 } from "uuid";
import ProductMoreDetailsDisplay from "../components/ProductMoreDetailsDisplay";
import Divider from "../components/Divider";
import { useDispatch, useSelector } from "react-redux";
import {
	addToCartItems,
	deleteCartItem,
	fetchCartItems,
	updateCartItem,
} from "../redux/cart/cartSlice";
import Spinner from "../components/Spinner";
import { FaMinus, FaPlus } from "react-icons/fa";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { motion } from "motion/react";

const ProductDisplay = () => {
	const location = useLocation();
	const params = useParams();
	const dispatch = useDispatch();
	const cartItems = useSelector((state) => state.cart.cartItems);
	const status = useSelector((state) => state.cart.status);

	const [loading, setLoading] = useState(false);
	const [data, setData] = useState(null);
	const [images, setImages] = useState([]);
	const [index, setIndex] = useState(0);
	const [canScroll, setCanScroll] = useState({
		previous: false,
		next: true,
	});
	const [discountedPrice, setDiscountedPrice] = useState(null);
	const [productInCart, setProductInCart] = useState(false);
	const [cartItem, setCartItem] = useState(null);
	const [productQuantity, setProductQuantity] = useState(false);

	const miniImageRef = useRef({});
	const miniImagesContainerRef = useRef(null);
	const mainImageRef = useRef(null);

	const productId =
		location?.state?.id || params?.productId?.split("-").slice(-1)[0];

	const customData = [
		{
			id: uuidv4(),
			image: img1,
			title: "Superfast Delivery",
			description:
				"Get your order delievered to your doorstep at the earliest from dark stores near you",
		},
		{
			id: uuidv4(),
			image: img2,
			title: "Best Prices & Others",
			description:
				"Best price destination with offers directly from the manufacturers",
		},
		{
			id: uuidv4(),
			image: img3,
			title: "Wide Assortment",
			description:
				"Choose from 5000+ products across food personal care, household & other categories",
		},
	];
	// Event listeners
	const handleClickNext = () => {
		const el_mini = miniImageRef.current[0];
		const w_mini = el_mini.offsetWidth;
		const el_container = miniImagesContainerRef.current;
		el_container.scrollBy({
			left: w_mini + 4,
			behavior: "smooth",
		});
	};
	const handleClickPrevious = () => {
		const el_mini = miniImageRef.current[0];
		const el_container = miniImagesContainerRef.current;
		const w_mini = el_mini.offsetWidth;
		const scrollWidth = el_container.scrollWidth;
		const clientWidth = el_container.clientWidth;
		const scrollLeft = el_container.scrollLeft;

		if (!(clientWidth + scrollLeft < scrollWidth)) {
			setCanScroll((prev) => {
				return {
					...prev,
					next: true,
				};
			});
		}

		if (scrollLeft > 0) {
			setCanScroll((prev) => {
				return {
					...prev,
					previous: true,
				};
			});
			el_container.scrollBy({
				left: -(w_mini + 4),
				behavior: "smooth",
			});
		} else {
			setCanScroll((prev) => {
				return {
					...prev,
					previous: false,
				};
			});
		}
	};
	const handleScroll = () => {
		const el_container = miniImagesContainerRef.current;
		const scrollWidth = el_container.scrollWidth;
		const clientWidth = el_container.clientWidth;
		const scrollLeft = el_container.scrollLeft;

		// Setting previous button state
		if (scrollLeft > 0) {
			setCanScroll((prev) => {
				return {
					...prev,
					previous: true,
				};
			});
		} else
			setCanScroll((prev) => {
				return {
					...prev,
					previous: false,
				};
			});

		// Setting next button state
		if (!(clientWidth + scrollLeft < scrollWidth)) {
			setCanScroll((prev) => {
				return {
					...prev,
					next: false,
				};
			});
		} else {
			setCanScroll((prev) => {
				return {
					...prev,
					next: true,
				};
			});
		}
	};
	const handleAddClick = async (e, id) => {
		e.preventDefault();
		e.stopPropagation();
		if (status.add === "pending") return;

		try {
			const addedItem = await dispatch(addToCartItems({ productId: id })).unwrap();
			setCartItem(addedItem);
			await dispatch(fetchCartItems()).unwrap();
			setProductInCart(true);
		} catch (error) {
			return axiosErrorMsg(error);
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
			setProductInCart(false);
		} else {
			setProductQuantity(productQuantity - 1);
			const d = await dispatch(
				updateCartItem({ id, quantity: productQuantity - 1 })
			).unwrap();
			// notifySuccess("Item updated ✔");
		}
		dispatch(fetchCartItems());
	};
	const handleDelete = async (e, cartId) => {
		e.preventDefault();
		const consent = confirm(
			"Do You want to completely remove this item from your cart?"
		);
		if (consent) {
			const result = await dispatch(deleteCartItem({ id: cartId })).unwrap();
			setProductInCart(false);
			console.log("delete result:", result);
			const items = await dispatch(fetchCartItems()).unwrap();
			console.log(items);
		}
	};

	// api call to fetch product
	const getProductById = async (id) => {
		try {
			setLoading(true);
			const { data: responseData } = await axiosInstance({
				...SummaryApi.fetchProducts,
				data: {
					query: { _id: id },
					select: "-categories -subCategories",
					lean: true,
				},
			});
			const data = responseData.data.products[0];
			setData(data);
			setImages(data.images);
		} catch (error) {
			return axiosErrorMsg(error);
		} finally {
			setLoading(false);
		}
	};

	setPageTitle("Binkeyit!|Product description");
	useEffect(() => {
		if (productId) {
			getProductById(productId);
		}
	}, []);
	useEffect(() => {
		if (cartItems[0] && data) {
			let checkProdInCart;
			const prodInCart = cartItems.some((item) => {
				checkProdInCart = item?.product?._id.toString() === data?._id.toString();
				if (checkProdInCart) {
					setCartItem(item);
					setProductQuantity(item?.quantity);
				}
				return checkProdInCart;
			});
			setProductInCart(checkProdInCart);
		} else setProductInCart(false);
	}, [cartItems, data]);
	useEffect(() => {
		if (miniImageRef.current[index]) {
			miniImageRef.current[index].scrollIntoView({
				behavior: "smooth",
				block: "end",
				inline: "center",
			});
		}
	}, [index]);
	useEffect(() => {
		setDiscountedPrice((prev) => {
			return calculateDiscountedPrice(data?.price, data?.discount);
		});
	}, [data]);

	return (
		<motion.section
			initial="hidden"
			animate="start"
			variants={{
				hidden: {
					opacity: 0,
				},
				start: {
					opacity: 1,
					transition: {
						duration: 0.5,
						delay: 0.1,
						ease: "easeInOut",
					},
				},
			}}
			className="overflow-x-hidden [scrollbar-width:thin]"
		>
			{/* Product main details */}
			<div className="container 2xl:max-w-[107rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-1">
				<div className="_product-image w-full bg-blue-50 p-4 overflow-x-hidden [scrollbar-width:thin] select-none">
					<div className="bg-white w-full">
						<motion.div
							ref={mainImageRef}
							variants={{
								hidden: { scale: 0, opacity: 0 },
								start: {
									scale: 1,
									opacity: 1,
									transition: { duration: 0.25, delay: 0.1 },
								},
							}}
							className={twMerge(
								"_frame lg:w-120 lg:min-w-100 sm:min-w-80 w-65 mx-auto rounded overflow-hidden bg-white",
								loading && "animate-[pulse_0.8s_ease-in-out_infinite]"
							)}
						>
							<img
								src={images[0] && images[index].url}
								alt="Product image.jpg"
								loading="lazy"
							/>
						</motion.div>
					</div>

					{/* Circular image indicators*/}
					<div className="flex w-fit mx-auto sm:gap-2 gap-1">
						{images[0] &&
							images.map((_, i) => {
								return (
									<div
										className={twMerge(
											"_indicator mx-auto my-4 sm:w-3 w-2 sm:h-3 h-2 rounded-lg bg-amber-200 cursor-pointer",
											i === index && "bg-amber-600 scale-142"
										)}
										onClick={() => {
											setIndex(i);
										}}
									/>
								);
							})}
					</div>

					{/* Mini preview images */}
					<div className="relative overflow-visible w-fit mx-auto">
						<div
							ref={miniImagesContainerRef}
							className="_mini-preview-images flex gap-2 mx-auto w-full max-w-[80vw] sm:max-w-90 min-w-full sm:min-w-auto scrollbar-hidden p-2 select-none scroll-smooth relative"
							onScroll={handleScroll}
						>
							{images[0] &&
								images.map((imgObj, i) => {
									const url = imgObj.url;
									return (
										<div className="w-full">
											<div
												ref={(el) => {
													miniImageRef.current[i] = el;
												}}
												className={twMerge(
													"sm:w-15 lg:w-20 w-10 overflow-hidden p-1 cursor-pointer scroll-smooth",
													i === index &&
														"scale-120 border border-amber-500 rounded-lg shadow-ins"
												)}
												onClick={(e) => {
													setIndex(i);
													// mainImageRef.current.scrollIntoView()
												}}
											>
												<img
													src={url}
													className="w-full h-full object-contain"
													alt="preview.jpg"
													loading="lazy"
												/>
											</div>
										</div>
									);
								})}
						</div>

						<button
							disabled={!canScroll.previous}
							className={twMerge(
								"_previous-button select-none bg-white shadow-2xl/100 shadow-black   p-1 sm:flex hidden items-center justify-center rounded-full absolute -left-9 sm:top-8 top-6 z-10 cursor-pointer active:scale-80 group [box-shadow:0_10px_25px_rgba(0,0,0,0.6)]",
								!canScroll.previous &&
									"bg-gray-200 cursor-text active:scale-none sm:hidden"
							)}
							onClick={handleClickPrevious}
						>
							<span
								className={twMerge(
									"_previous text-green-700 group-hover:cursor-pointer",
									!canScroll.previous && "text-gray-400 group-hover:cursor-text"
								)}
							>
								<Previous size="22" />
							</span>
						</button>

						<button
							disabled={!canScroll.next}
							className={twMerge(
								"_next-button select-none bg-white p-1 sm:flex hidden items-center justify-center rounded-full absolute -right-9 sm:top-8 top-6 z-10 cursor-pointer active:scale-80 group [box-shadow:0_10px_25px_rgba(0,0,0,0.6)]",
								!canScroll.next && "bg-gray-200 cursor-text active:scale-none sm:hidden"
							)}
							onClick={handleClickNext}
						>
							<span
								className={twMerge(
									"_next group-hover:cursor-pointer text-green-700",
									!canScroll.next && "text-gray-400 group-hover:cursor-text"
								)}
							>
								<Next size="22" />
							</span>
						</button>
					</div>

					<div className="mx-2 select-text max-sm:hidden">
						<div className="mt-2">
							<h4 className="font-semibold text-gray-900">Description</h4>
							<p className="text-sm text-gray-600 text-justify">{data?.description}</p>
						</div>
						<div className="mt-2">
							<h4 className="font-semibold text-gray-900">Unit</h4>
							<p className="text-gray-600">{data?.unit}</p>
						</div>
					</div>
				</div>

				<div
					className="product-details bg-blue-50 p-4 [scrollbar-width:thin]"
				>
					<p className="bg-green-400 text-green-800 w-fit px-3 py-1 rounded-2xl font-medium select-none">
						10 min
					</p>
					<h2 className="font-bold text-lg sm:text-xl lg:text-3xl mt-1 max-w-190">
						{data?.name}
					</h2>
					<p className="text-productGray">{data?.unit}</p>
					<div className="mt-3">
						<h4 className="text-productGray font-medium">Price</h4>
						<div className="flex gap-3 items-center w-fit select-none">
							<div className="border border-green-500 bg-green-50 w-fit py-2 px-4 rounded font-nunito font-medium text-lg">
								{formatCurrency(discountedPrice, true)}
							</div>
							{!!data?.discount && (
								<>
									<div className="line-through text-productGray font-nunito font-medium sm:text-lg">
										{formatCurrency(data?.price, true)}
									</div>
									<div className="flex max-sm:flex-col sm:items-center sm:gap-2">
										<span className="text-green-700 font-semibold sm:text-lg text-base">
											{data?.discount}%
										</span>{" "}
										<span className="text-xs sm:text-base text-green-700 font-medium">
											Discount
										</span>
									</div>
								</>
							)}
						</div>
						{!data?.stock && (
							<div className="mt-1 sm:text-lg text-base text-red-500">
								Out of Stock
							</div>
						)}
						{!!data?.stock &&
							(!productInCart ? (
								<button
									className={twMerge(
										"bg-green-700 select-none hover:bg-green-900 active:scale-95 text-white cursor-pointer rounded-md my-3 px-3 py-1"
									)}
									onClick={(e) => handleAddClick(e, data?._id)}
								>
									{status.add === "pending" ? (
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
									className="flex my-3 w-fit"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
								>
									<button
										className="bg-green-700 hover:bg-green-900 active:bg-green-700 text-white sm:px-4 sm:py-2 px-1.5 py-1 rounded cursor-pointer"
										onClick={(e) => handleDecrement(e, cartItem?._id)}
										title={productQuantity === 1 ? "Remove from cart" : "Remove item"}
									>
										<FaMinus />
									</button>
									<span className="block text-center sm:w-14 w-10 font-medium sm:text-xl text-[1.1em]">
										{productQuantity}
									</span>
									<button
										className="bg-green-700 hover:bg-green-900 active:bg-green-700 text-white sm:px-4 sm:py-2 px-1.5 py-1 rounded cursor-pointer"
										onClick={(e) => handleIncrement(e, cartItem?._id)}
										title="Add item"
									>
										<FaPlus />
									</button>
									<button
										className="bg-red-600 ml-4 hover:bg-red-700 active:bg-red-500 text-white sm:px-3 px-1.5 py-1 rounded cursor-pointer"
										onClick={(e) => handleDelete(e, cartItem?._id)}
										title="Remove from cart"
									>
										<RiDeleteBin2Fill className={twMerge("sm:text-[20px] text-[18px]")} />
									</button>
								</div>
							))}
						<div className="my-2">
							<Divider />
						</div>
						<p className="font-semibold text-gray-900">Why shop from binkeyit?</p>
						<div className="space-y-4 p-4">
							{customData &&
								customData.map((obj, i) => {
									return (
										<div
											key={`${i}_${obj.id}`}
											className="flex items-center gap-3 select-none"
										>
											<div className="w-19 overflow-hidden">
												<img src={obj.image} alt="image.jpg" className="object-contain" />
											</div>
											<div className="">
												<div className="_title font-semibold text-sm text-gray-900">
													{obj.title}
												</div>
												<div className="_description max-w-[550px] text-sm text-gray-800">
													{obj.description}
												</div>
											</div>
										</div>
									);
								})}
						</div>
					</div>
					<div className="max-w-[720px] mt-2">
						<h4 className="font-semibold text-gray-900">Description</h4>
						<p className="text-sm text-gray-600 text-justify">{data?.description}</p>
					</div>
					<div className="mt-2">
						<h4 className="font-semibold text-gray-900">Unit</h4>
						<p className="text-gray-600">{data?.unit}</p>
					</div>
				</div>
			</div>

			{/* Product more details */}
			<div className="_moreDetails">
				<ProductMoreDetailsDisplay data={data} />
			</div>
		</motion.section>
	);
};

export default memo(ProductDisplay);
