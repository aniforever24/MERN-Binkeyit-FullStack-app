import React, { useEffect, useRef, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { PiLineVertical } from "react-icons/pi";
import { fetchOrders, setStatusIdle } from "../../redux/order/orderSlice";
import { useSelector, useDispatch } from "react-redux";
import { formatCurrency, getLocaleDate } from "../../utils/UtilityFunctions";
import Spinner from "../../components/Spinner";

const MyOrders = () => {
	const dispatch = useDispatch();
	const { orders, countOfOrders, status } = useSelector((state) => state.order);

	const [data, setData] = useState([]);
	const [pagination, setPagination] = useState({ page: 1, limit: 10 });

	const hasFetchedRef = useRef(false);

	const fetchData = async () => {
		try {
			const { orders, countOfOrders } = await dispatch(fetchOrders()).unwrap();
			console.log("orders fetched success");
			setData((prev) => {
				return [...prev, ...orders];
			});
			return { orders, countOfOrders };
		} catch (error) {
			console.log("error in fetching data:", error);
			return error
		}
	};

	useEffect(() => {
		if (!hasFetchedRef.current) {
			hasFetchedRef.current = true;
			fetchData();
		}
	}, []);

	useEffect(() => {
		console.log("data: ", data);
	}, [data]);

	return (
		<section className="border-l border-neutral-300  min-h-[79vh] relative">
			<div className="_header shadow-lg border-r-0 flex justify-between items-center w-full px-4 py-2.5 select-none sticky top-25 bg-white z-10">
				<h2 className="_heading font-semibold sm:text-lg mr-1">My Orders</h2>
			</div>

			<div className="_ordersContainer grid gap-4 m-2">
				{data[0] &&
					data.map((ord) => {
						const orderCreationDate = getLocaleDate(ord.createdAt, {
							dateStyle: "medium",
						});
						const delivered = ord.deliveryStatus === "delivered";
						const imgUrl = ord.products[0].snapshot.images[0];
						const productName = ord.products[0].snapshot.name;
						const totalValue = formatCurrency(ord.totalAmt, true);
						const totalProductsCount = ord.products.length;
						const totalItemsCount = ord.productDetails.reduce((accu, item) => {
							return accu + item.quantity;
						}, 0);

						return (
							<div
								key={`ord-${ord._id}`}
								className="_order px-4 py-6 border-2 border-gray-100 rounded-2xl flex flex-col justify-center gap-3"
							>
								<div className="flex items-center gap-2 text-xs">
									<div className="flex justify-center items-center gap-0.5 p-1 px-1.5 bg-orange-100 border border-orange-50 rounded-xl">
										<GoDotFill size="13" color="oklch(55.3% 0.195 38.402)" />

										{delivered ? (
											<span className="text-green-700 font-medium">Delivered</span>
										) : (
											<span className="text-orange-700 font-medium">In progress</span>
										)}
									</div>
									<PiLineVertical size="18" />
									<p> {orderCreationDate} </p>
								</div>

								<div className="flex items-center gap-3">
									<div className="_image w-18 h-18 border border-gray-100 shadow overflow-hidden relative">
										<img
											className="object-fill w-full h-full"
											src={imgUrl}
											alt="random-image.jpg"
										/>
										{totalProductsCount > 1 && (
											<span className="text-red-700 absolute bottom-0 right-1 z-10 text-sm font-medium text-shadow-xs">
												+ {totalProductsCount - 1}
											</span>
										)}
									</div>

									<div className="flex flex-col justify-between h-18 overflow-hidden">
										<p className="text-xs font-bold text-orange-900">
											OrderID: &nbsp;&nbsp;{ord._id}
										</p>

										<div className="flex justify-between items-center">
											<p className="overflow-hidden text-ellipsis line-clamp-1 flex-1">
												{productName}
											</p>
											{totalProductsCount > 1 ? (
												<p className="overflow-hidden line-clamp-1 text-ellipsis text-orange-800">
													&nbsp;& {totalProductsCount - 1} more{" "}
													{totalProductsCount - 1 > 1 ? "products" : "product"}
												</p>
											) : (
												""
											)}
										</div>
										<div className="flex items-center gap-2 text-sm">
											<p className=" font-bold">{totalValue}</p>
											<PiLineVertical size="18" />
											{totalItemsCount > 0 && (
												<span className="text-red-700">{`${totalItemsCount} ${
													totalItemsCount >= 2 ? "items" : "item"
												}`}</span>
											)}
										</div>
									</div>
								</div>
							</div>
						);
					})}

				{status === "failure" && (
					<div className="font-semibold p-4">No Order Found! </div>
				)}

				{status === "pending" && (
					<div className="font-semibold px-[15%] pt-[10%] w-fit">
						<Spinner borderClr="text-amber-600" />
					</div>
				)}
			</div>
		</section>
	);
};

export default MyOrders;
