import React, { lazy, memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Product from "../components/Product";
import NoResults from "../assets/img/nothing here yet.webp";
import Spinner from "../components/Spinner";
import axiosErrorMsg from "../utils/axiosError.js";
import axiosInstance from "../config/axiosConfig.js";
import SummaryApi from "../Common/SummaryApi.js";
import { escapeRegex } from "../utils/UtilityFunctions.js";
import { setProductsSearched } from "../redux/products/productSlice.js";
import { useLocation, useNavigate } from "react-router";
const InfiniteProducts = lazy(() =>
	import("../components/InfiniteProducts.jsx")
);

const SearchPage = () => {
	const location = useLocation()
	const params = new URLSearchParams(location.search)
	
	const dispatch = useDispatch();
	const data = useSelector((state) => state.product.productsSearched);
	const productData = useSelector((state) => state.product.products);
	const productsSearchedStatus = useSelector(
		(state) => state.product.productsSearchedStatus
	);
	const countProductsSearched = useSelector(
		(state) => state.product.countProductsSearched
	);
	const status = useSelector((state) => state.product.status);
	const countAll = useSelector((state) => state.product.countAll);
	const [limit, setLimit] = useState(24);
	const [allProductsDisplayed, setAllProductsDisplayed] = useState(false);
	const [loading, setLoading] = useState(false);
	const [searchText, setSearchText] = useState("")

	const lastElRef = useRef(null);

	const mainSearchText = sessionStorage.getItem("mainSearchText");
	const customClasses = {
		customClassProduct:
			"shadow-[0_6px_9px_rgba(0,0,0,0.4)] rounded-lg hover:scale-105 duration-400 ease-out",
	};

	// console.log("mainSearhText: ", mainSearchText, mainSearchText.length);
	const getProducts = async (limit, searchText) => {
		try {
			setLoading(true);
			const { data: responseData } = await axiosInstance({
				...SummaryApi.fetchProducts,
				data: {
					limit,
					sort: { score: {$meta: "textScore"} },
					query: {
						$text: {$search: escapeRegex(searchText.trim())},
					},
					select: "-categories -subCategories -moreDetails",
					lean: true,
					score: true,
					searchMode: true,
					searchText: escapeRegex(searchText.trim())
				},
			});
			const { data } = responseData;
			dispatch(setProductsSearched(data?.products));
			setLoading(false);
			return data;
		} catch (error) {
			return axiosErrorMsg(error);
		} finally {
			setLoading(false);
		}
	};
	const observerFn = (el) => {
		if (loading) return;
		const observer = new IntersectionObserver(
			([entry], observer) => {
				if (entry.isIntersecting) {
					const productsLeft = countProductsSearched - limit;
					getProducts(limit, searchText || mainSearchText);
					if (productsLeft >= 12) {
						setLimit((prev) => (prev += 12));
					} else {
						setLimit((prev)=> prev += productsLeft);
						// setAllProductsDisplayed(true);
					}
				}
			},
			{
				rootMargin: "250px 0px",
			}
		);

		observer.observe(el);
		return observer;
	};	
	useEffect(()=> {
		setSearchText(params.get("q")?.trim())
	}, [location])
	useEffect(() => {
		let observer;
		if(!data[0]) setLimit(24)
			
		if (data[0] && lastElRef.current && !allProductsDisplayed) {
			observer = observerFn(lastElRef.current);
			countProductsSearched === limit && setAllProductsDisplayed(true);
		}
		return () => {
			if (observer && lastElRef.current) {
				observer.unobserve(lastElRef.current);
			}
			setAllProductsDisplayed(false);
		};
	}, [data]);

	return (
		<section className="relative">
			<div className="container mx-auto xl:max-w-[1800px] bg-blue-50 sm:min-h-[79vh] relative">
				{/* Heading style */}
				<div className=" mx-auto flex gap-2 justify-center items-center bg-slate-50 w-full text-center p-2 rounded-xl rounded-tl-none rounded-tr-none h-fit shadow sticky sm:top-25 top-17 z-10">
					<div className="bg-gray-300 shadow w-50 h-[1px] self-end relative -top-2 hidden sm:block" />
					<h4 className="_heading text-gray-600 text-lg font-bold uppercase [word-spacing:4px]">
						{productsSearchedStatus === "idle" ? (
							<span>
								All Products{" "}
								<span className="font-medium normal-case max-sm:text-sm">
									{countAll > 0 ? `(${productData.length} of ${countAll})` : ""}
								</span>
							</span>
						) : (
							<span>
								{" "}
								Search Results:{" "}
								<span className="font-medium text-base normal-case max-sm:text-sm">
									{data[0] ? `${data.length} of ${countProductsSearched}` : ""}
								</span>
							</span>
						)}
					</h4>
					<div className="bg-gray-300 shadow w-50 h-[1px] self-end relative -top-2 hidden sm:block" />
				</div>

				{/* Searched Products population */}
				{data.length > 0 && (
					<>
						<div className=" p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 sm:gap-y-4 gap-y-2 justify-items-center auto-rows-min">
							{data.map((p, i) => {
								const id = p?._id.toString();
								return (
									<Product
										customClasses={customClasses}
										productData={p}
										newTabOpen={true}
									/>
								);
							})}
							<div ref={lastElRef} className="h-1 self-end" />
						</div>
						{loading && (
							<div className="py-2 pb-6">
								<Spinner borderClr="text-green-500" />
							</div>
						)}
					</>
				)}

				{data.length == 0 && productsSearchedStatus === "success" && (
					<div className="_NoResultsFound mx-auto w-fit flex flex-col-reverse h-fit mt-30 max-sm:gap-2">
						<div className="_NoResultsFrame sm:w-96 w-auto overflow-hidden">
							<img
								className="w-full h-full object-cover translate-y-[-120px] translate-x-[-8px] "
								src={NoResults}
								alt="No results.png"
							/>
						</div>
						<p className="text-center font-semibold sm:text-xl text-lg  text-gray-600">
							No Products found!
						</p>
					</div>
				)}

				{data.length == 0 && productsSearchedStatus === "pending" && (
					<div className="absolute top-[40%] left-[48%]">
						<Spinner customClass={"text-amber-500"} />
					</div>
				)}

				{data.length == 0 && productsSearchedStatus === "idle" && (
					// <div className="mx-auto text-center mt-[10%]">
					// 	<p className="text-lg text-slate-500 font-semibold w-fit mx-auto animate-[pulse_1s_ease-in-out_infinite]">Type in Search field to find your Products...</p>
					// </div>
					<div className=" p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 sm:gap-y-4 gap-y-2 justify-items-center auto-rows-min">
						<InfiniteProducts />
					</div>
				)}

				{status === "loading" && (
					<div className="py-2 pb-4">
						<Spinner borderClr={"text-green-700"} />
					</div>
				)}
			</div>
		</section>
	);
};

export default memo(SearchPage)
