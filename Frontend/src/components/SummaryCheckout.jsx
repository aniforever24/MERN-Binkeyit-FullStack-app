import React, { useEffect, useState } from "react";
import { formatCurrency } from "../utils/UtilityFunctions";
import { twMerge } from "tailwind-merge";
import Divider from "../components/Divider";
import { LuDot } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SummaryCheckout = () => {
	const {
		cartItems,
		totalItems,
		totalValue,
		totalActualValue,
		totalDiscount,
		otherCharges: fixedOtherCharges,
		status,
	} = useSelector((state) => state.cart);

	const [finalCartValue, setFinalCartValue] = useState(0);

	useEffect(() => {
		if (cartItems[0]) {
			const extraCharges = Object.values(fixedOtherCharges).reduce((acc, c) => {
				return acc + c;
			}, 0);
			if (totalValue >= 500) {
				setFinalCartValue(totalValue);
			} else {
				setFinalCartValue(totalValue + extraCharges);
			}
		}
	}, [cartItems, fixedOtherCharges]);

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
						to="/checkout"
						className="bg-green-600 hover:bg-green-500 active:bg-green-700 text-white text-shadow text-shadow-black font-medium rounded-md p-2.5 my-2 mb-0 cursor-pointer block w-full text-center"
					>
						Cash On Delivery
					</Link>
					<Link
						to="/checkout"
						className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-shadow text-shadow-black font-medium rounded-md p-2.5 my-2 mb-0 cursor-pointer block w-full text-center"
					>
						Pay Online
					</Link>
				</div>
			</div>
		</>
	);
};

export default SummaryCheckout;
