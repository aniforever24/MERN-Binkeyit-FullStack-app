import React, { memo, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {
	fetchSubCategories,
	setSubCategories,
} from "../redux/category/categorySlice";
import { Outlet } from "react-router";
import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { setPageTitle } from "../utils/UtilityFunctions";

const SubCategoryWiseProductsPage = () => {
	const params = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	// const categoriesData = useSelector((state) => state.category.categories);
	const subCategoriesData = useSelector((state) => state.category.subCategories);

	const [callOnce, setCallOnce] = useState(false);

	const prevRoute = useRef(
		sessionStorage.getItem("subCategoryWiseProductsPage_prevRoute")
	);

	const getCategoryId = () => {
		let str = params.category;
		const ar = str.split("-");
		const categoryId = ar[ar.length - 1];
		return categoryId;
	};

	const catId = location.state?.categoryId || getCategoryId();

	setPageTitle("Binkeyit! | Category-wise Products ");
	useEffect(() => {
		dispatch(setSubCategories([]));
		// Navigate to previous route when navigating here
		// using back or next button

		if (prevRoute.current) {
			navigate(`${prevRoute.current}`);
			sessionStorage.removeItem("subCategoryWiseProductsPage_prevRoute");
		}
	}, []);
	useEffect(() => {
		sessionStorage.setItem(
			"subCategoryWiseProductsPage_prevRoute",
			window.location.pathname
		);
	}, [window.location.pathname]);
	useEffect(() => {
		if (!catId) return;
		dispatch(
			fetchSubCategories({
				limit: 0,
				populate: false,
				sort: { name: 1 },
				query: { categories: { $in: [catId] } },
			})
		).then((v) => setCallOnce(true));
	}, [dispatch]);
	useEffect(() => {
		if (subCategoriesData[0] && callOnce) {
			const data = subCategoriesData;
			let url = `${encodeURIComponent(data[0].name)}-${data[0]._id.toString()}`;
			let rep = {replace: true}
			if (prevRoute.current) {
				url = prevRoute.current;
				// rep = {replace: false};
			}
			navigate(url, rep);
			setCallOnce(false);
		}
	}, [subCategoriesData]);

	return (
		<section className="_subCategoryWiseProducts overflow-y-auto max-h-[79vh] [scrollbar-width:thin] [scrollbar-color:#403f39_#e5e7eb] select-none">
			<div className="_container container 2xl:max-w-[1700px] mx-auto grid grid-cols-[100px_1fr] md:grid-cols-[180px_1fr] lg:grid-cols-[200px_1fr] xl:grid-cols-[300px_1fr] items-start">
				{/* Sub Categories */}
				<div className="grid gap-1 max-h-[79vh] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:#ffbe00_#e5e7eb]">
					{subCategoriesData[0] &&
						subCategoriesData.map((subCat, i) => {
							const id = subCat._id.toString();
							const name = subCat.name;
							const url = subCat.image;
							return (
								<NavLink
									key={`${i}-${name}-${id}`}
									to={`${encodeURIComponent(name)}-${id}`}
									// replace
									className={({ isActive, isPending }) =>
										twMerge(
											"border border-gray-200 bg-white hover:bg-green-200 rounded px-1.5 sm:px-2 py-1 sm:py-2 flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2 cursor-pointer",
											isActive && "bg-green-300 hover:bg-green-300"
										)
									}
									// onClick={() => handleClick(id)}
								>
									<div className="_imageFrame max-w-10 sm:max-w-13">
										<img
											src={url}
											alt={`${name}.jpg`}
											className=" w-full h-full object-contain"
										/>
									</div>
									<div className="text-sm sm:text-md">{name}</div>
								</NavLink>
							);
						})}
				</div>

				{/*Sub category wise Products */}
				<div className=" bg-blue-50 max-h-[79vh] h-full sticky top-0 overflow-y-auto px-4 pb-2 [scrollbar-width:thin] [scrollbar-color:#60bd04_#e5e7eb]">
					<Outlet />
				</div>
			</div>
		</section>
	);
};

export default memo(SubCategoryWiseProductsPage);
