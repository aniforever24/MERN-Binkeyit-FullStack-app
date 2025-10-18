import React, { useEffect, useState, memo, useCallback } from "react";
import { AiFillEdit } from "react-icons/ai";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchProducts,
} from "../../redux/products/productSlice";
import {
	alphnumericKey,
	escapeRegex,
	recalculatePage,
} from "../../utils/UtilityFunctions";
import nothingHere from "../../assets/img/nothing here yet.webp";
import { useLocation, useNavigate } from "react-router";
import { notifyError } from "../../utils/foxToast";
import axiosInstance from "../../config/axiosConfig";
import SummaryApi from "../../Common/SummaryApi";
import { IoIosSearch } from "react-icons/io";
import useMobile from "../../hooks/useMobile";
import ProductSearchFilter from "../../components/ProductSearchFilter";

const MyProducts = () => {
	const [sm] = useMobile(640);
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const products = useSelector((state) => state.product.products);
	const totalProducts = useSelector((state) => state.product.countAll);
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
		sort: { createdAt: -1 },
		query: {},
	});
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(null);
	const [productsDisplayedNumber, setProductsDisplayed] = useState(null);
	const [wait, setWait] = useState(true);
	const [productUpdated, setProductUpdated] = useState({
		updated: location?.state?.updated,
		pagination: location?.state?.pagination,
	});
	const [searchText, setSearchText] = useState("");

	const handleEditProduct = async (e, p) => {
		let product = { ...p };
		try {
			const { data: responseData } = await axiosInstance({
				...SummaryApi.fetchProducts,
				data: {
					query: { _id: p._id },
					populate: ["categories", "subCategories"],
				},
			});
			product = responseData.data.products[0];
			// console.log('responseData:', responseData.data.products[0])
		} catch (error) {
			return notifyError("Error in getting product info!");
		}
		navigate(`/user/dashboard/products/edit/${product._id}`, {
			state: { product, pagination },
		});
	};
	const handleDeleteProduct = async (e, p) => {
		console.log("handleDeleteProduct runs");
		console.log("Product (to be deleted) details:", p);
	};
	const handlePageChange = async (e) => {
		let page = e.target.value;
		// setCurrentPage(page)
		// if(!page) {
		// 	await new Promise(resolve => {
		// 	  setTimeout(()=> {resolve(1)}, 3000)
		// 	})
		// }
		if (page < 1) {
			setCurrentPage(1);
			setPagination((prev) => {
				sessionStorage.setItem("pagination", JSON.stringify({ ...prev, page: 1 }));
				sessionStorage.setItem("currentPage", "1");
				return { ...prev, page: 1 };
			});
			// e.target.value = 1
			return;
		} else if (Number(`${page}`) !== `${page}`) {
			page = Number(`${page}`);
			setCurrentPage(page);
			setPagination((prev) => {
				sessionStorage.setItem("pagination", JSON.stringify({ ...prev, page }));
				sessionStorage.setItem("currentPage", JSON.stringify(page));
				return { ...prev, page };
			});
			e.target.value = page;
		}
		if (Number(page) > Number(totalPages)) {
			page = totalPages;
			setCurrentPage(page);
			setPagination((prev) => {
				sessionStorage.setItem("pagination", JSON.stringify({ ...prev, page }));
				sessionStorage.setItem("currentPage", JSON.stringify(page));
				return { ...prev, page };
			});
			// e.target.value = totalPages;
		}
	};
	const handlePrev = (e) => {
		if (currentPage === 1) return e.preventDefault();
		setCurrentPage(currentPage - 1);
		setPagination((prev) => {
			sessionStorage.setItem(
				"pagination",
				JSON.stringify({ ...prev, page: currentPage - 1 })
			);
			sessionStorage.setItem("currentPage", JSON.stringify(currentPage - 1));
			return { ...prev, page: currentPage - 1 };
		});
	};
	const handleNext = (e) => {
		if (currentPage === totalPages) return e.preventDefault();
		setCurrentPage(currentPage + 1);
		setPagination((prev) => {
			sessionStorage.setItem(
				"pagination",
				JSON.stringify({ ...prev, page: currentPage + 1 })
			);
			sessionStorage.setItem("currentPage", JSON.stringify(currentPage + 1));
			return { ...prev, page: currentPage + 1 };
		});
	};
	const handleChangeLimit = (e) => {
		const newLimit = e.target.value;
		const newPage = recalculatePage(currentPage, pagination.limit, newLimit);
		setCurrentPage(newPage);
		setPagination((prev) => {
			sessionStorage.setItem(
				"pagination",
				JSON.stringify({ ...prev, limit: newLimit, page: newPage })
			);
			sessionStorage.setItem("currentPage", JSON.stringify(newPage));
			return {
				...prev,
				limit: newLimit,
				page: newPage,
			};
		});
	};

	// console.log("productsDisplayedNumber:", productsDisplayedNumber);
	useEffect(() => {
		const p = sessionStorage.getItem("pagination");
		const c = sessionStorage.getItem("currentPage");
		if (p) {
			const pagination = JSON.parse(p);
			setPagination((prev) => {
				sessionStorage.setItem(
					"pagination",
					JSON.stringify({ ...prev, ...pagination })
				);
				return {
					...prev,
					...pagination,
				};
			});
		}
		if (c) {
			setCurrentPage(JSON.parse(c));
		}
		return () => {
			sessionStorage.removeItem("pagination");
			sessionStorage.removeItem("currentPage");
		};
	}, []);
	useEffect(() => {
		dispatch(fetchProducts({}));
	}, [dispatch]);
	useEffect(() => {
		// Use debouncing to limit api call
		const i = setTimeout(() => {
			dispatch(fetchProducts({ ...pagination }));
		}, 600);
		console.log("pagination", pagination);
		return () => {
			clearTimeout(i);
		};
	}, [pagination]);
	useEffect(() => {
		const { limit, page } = pagination;
		const p = limit * page;
		const i = setTimeout(() => {
			setProductsDisplayed(p > totalProducts ? totalProducts : p);
			setTotalPages((prev) => {
				return Math.ceil(totalProducts / pagination.limit);
			});
		}, 600);
		// Save pagination state in session storage to
		// maintain pagination across reloads

		return () => {
			clearTimeout(i);
		};
	}, [pagination, totalProducts]);
	useEffect(() => {
		const i = setTimeout(setWait, 500, false);
		return () => {
			clearTimeout(i);
		};
	}, [products]);
	useEffect(() => {
		window.scrollTo({ top: 0, right: 0, behavior: "smooth" });
	}, [currentPage]);
	useEffect(() => {
		console.log("productUpdated:", productUpdated);
		const limit = location?.state?.pagination?.limit;
		if (productUpdated.updated) {
			setPagination((prev) => {
				return { ...prev, limit, page: 1, sort: { updatedAt: -1 } };
			});
			setCurrentPage(1);
		}
		window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
	}, [productUpdated]);

	return (
		<section className="_myProducts min-h-[732px] relative z-0">
			{/* Top Section */}
			<div className="_topPart select-none border-b border-r-0 bg-white border-neutral-200 px-3 py-3.5 shadow-lg font-semibold text-lg sticky top-25 z-20 w-full ">
				<div className="flex justify-between items-center">
					<h2 className="min-w-[220px]">
						My Products{" "}
						<span className="font-medium">
							({productsDisplayedNumber && productsDisplayedNumber} of{" "}
							{totalProducts && totalProducts > 0 ? totalProducts : ""})
						</span>{" "}
					</h2>
					{!sm && (
						<div className="ml-auto mr-4 max-w-60 min-w-20">
							<ProductSearchFilter
								pagination={pagination}
								searchTextState={[searchText, setSearchText]}
							/>
						</div>
					)}

					<div className="_controlLimit text-base font-normal relative space-x-2">
						<label htmlFor="limit">Show</label>
						<select
							className="border border-neutral-200 focus:outline-1 focus:outline-amber-400 focus:bg-amber-50 rounded-lg"
							name="limit"
							id="limit"
							value={pagination.limit}
							onChange={handleChangeLimit}
						>
							<option selected value="10">
								10
							</option>
							<option value="20">20</option>
							<option value="30">30</option>
							<option value="40">40</option>
							<option value="50">50</option>
						</select>
					</div>
				</div>
				{sm && (
					<div className="mx-4 mt-1.5  min-w-60">
						<ProductSearchFilter
							pagination={pagination}
							searchTextState={[searchText, setSearchText]}
						/>
					</div>
				)}
			</div>
			{/* Second Part */}
			{products[0] ? (
				<section className="_products m-2">
					<div className="_productsDisplay grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 max-[450px]:grid-cols-1 gap-2 sm:gap-y-6 gap-y-4 justify-items-center-safe">
						{products[0] &&
							products.map((p, _) => {
								const cover = p["images"][0].url;

								return (
									<div
										key={p?._id}
										className="_product relative rounded-xl border border-neutral-200 shadow-md py-1 w-[200px] h-[290px] bg-white flex flex-col justify-start items-center group cursor-pointer transition-transform duration-500 ease-out hover:scale-105 overflow-hidden"
									>
										<div className="_frame rounded-xl bg-white w-[180px] h-[180px] mb-2 overflow-hidden">
											<img className="object-contain w-full h-full" src={cover} alt="" />
										</div>
										<p
											className="_productInfo text-center mx-4 line-clamp-2 leading-5 text-sm my-1 mb-2 h-10 font-medium"
											title={p.name}
										>
											{p.name}
										</p>
										<div className="_buttons absolute bottom-0 flex justify-between w-full">
											<div
												title="edit"
												className="_edit transition-opacity text-secondary-100 bg-green-200 hover:bg-green-300 p-1 cursor-pointer rounded-tr-2xl"
												onClick={(e) => {
													handleEditProduct(e, p);
												}}
											>
												<AiFillEdit size="26" />
											</div>
											<div
												title="delete"
												className="_delete transition-opacity text-red-600 hover:bg-red-300 bg-red-200 p-1 cursor-pointer rounded-tl-2xl"
												onClick={(e) => {
													handleDeleteProduct(e, p);
												}}
											>
												<RiDeleteBin2Fill size="26" />
											</div>
										</div>
									</div>
								);
							})}
					</div>
					{/* Page navigation */}
					<div className="_navigationButtons flex justify-between my-2 mt-3 select-none">
						<button
							className="_prevBtn relative border border-gray-400 w-fit py-1 px-4 text-center rounded-xl text-lg font-semibold bg-amber-300 cursor-pointer shadow hover:shadow-lg hover:bg-amber-400 active:scale-95"
							onClick={handlePrev}
						>
							Prev
						</button>
						<div className="_middle w-fit select-auto">
							<span className="mr-2">Page</span>
							<input
								type="number"
								min="1"
								name="page"
								id="page"
								className="outline-none border border-neutral-200 text-center w-15 placeholder:text-black"
								value={currentPage}
								onChange={handlePageChange}
							/>
							<span className="inline-block mx-1">/</span>
							{totalPages && <span>{totalPages}</span>}
						</div>
						<button
							className="_nextBtn relative border border-gray-400 w-fit py-1 px-4 text-center rounded-xl text-lg font-semibold bg-amber-300 cursor-pointer shadow hover:shadow-lg hover:bg-amber-400 active:scale-95"
							onClick={handleNext}
						>
							Next
						</button>
					</div>
				</section>
			) : (
				!wait && (
					<div className="overflow-hidden max-w-96 relative mx-auto">
						<img src={nothingHere} alt="No products to show!"></img>
						<p className="text-center font-medium">No Products to show!</p>
						<p className="text-center">Come back later.</p>
					</div>
				)
			)}
		</section>
	);
};

export default MyProducts;
