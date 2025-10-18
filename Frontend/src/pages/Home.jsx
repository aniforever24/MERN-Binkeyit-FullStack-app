import React, { useEffect, useState } from "react";
import banner from "../assets/img/banner.jpg";
import bannerMobile from "../assets/img/banner-mobile.jpg";
import { useSelector, useDispatch } from "react-redux";
import { fetchSubCategories } from "../redux/category/categorySlice";
import { useNavigate } from "react-router";
import CategoryWiseProductsSlider from "../components/categoryWiseProductsSlider";
import CategoryWiseProductsDisplay from "../components/CategoryWiseProductsDisplay";
import { notifyError, notifyWarning } from "../utils/foxToast";
import { setPageTitle } from "../utils/UtilityFunctions";

const Home = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const allCategoriesData = useSelector((state) => state.category.categories);
	const allSubCategoriesData = useSelector(
		(state) => state.category.subCategories
	);

	const [imageLoaded, setImageLoaded] = useState({
		banner: false,
		categoryRow: false,
	});
	const [categoryPlaceholders, setCategoryPlaceholders] = useState(
		new Array(20).fill(null)
	);
	const [dataLoaded, setDataLoaded] = useState(false);

	const handleCategoryDisplay = (cat) => {
		if (!cat) {
			notifyWarning("Please wait while loading...");
			return;
		}
		const catId = cat._id.toString();
		const catName = encodeURIComponent(cat.name);

		if (!allSubCategoriesData[0]) {
			notifyWarning("Please wait while loading...");
			return;
		}
		const subCat = allSubCategoriesData.find((sc) => {
			const catArray = sc.categories;
			return catArray.some((c) => {
				const id = c._id.toString();
				return catId === id;
			});
		});

		const prevRoute = sessionStorage.getItem(
			"subCategoryWiseProductsPage_prevRoute"
		);
		prevRoute &&
			sessionStorage.removeItem("subCategoryWiseProductsPage_prevRoute");

		const subCatId = subCat._id.toString();
		const subCatName = subCat.name;

		const url = `/${catName}-${catId}/${subCatName}-${subCatId}`;
		navigate(url, { state: { categoryId: catId } });
	};

	useEffect(() => {
		const apiCall = dispatch(
			fetchSubCategories({ sort: { name: 1 }, limit: 0 })
		)
		apiCall.then((v)=>setDataLoaded(true))
		return () => {
			// Cancel the above api call if navigating away
			apiCall.abort();
			console.log("api call cancelled ....");
		};
	}, [dispatch]);

	return (
		<section className="">
			{/* Paan corner */}
			<div className="_toppart_banner bg-white md:px-4 px-0 sm:py-2 py-2 max-[356px]:py-0 select-none">
				{!imageLoaded.banner && (
					<div className="_skeletonLoader_banner mx-auto w-full my-3 bg-blue-50 h-40 animate-[pulse_850ms_linear_infinite]" />
				)}
				<div
					className={`_frame_banner flex items-center justify-center w-full max-h-76 max-[356px]:h-[220px] max-[356px]:max-w-[92%] mx-auto sm:px-4 px-6 overflow-hidden ${
						imageLoaded.banner ? "" : "hidden"
					}`}
				>
					<img
						src={banner}
						alt="banner"
						className="_bannerImg w-full h-full object-cover hidden sm:inline"
						loading="lazy"
						onLoad={() =>
							setImageLoaded((prev) => {
								return {
									...prev,
									banner: true,
								};
							})
						}
					/>
					<img
						src={bannerMobile}
						alt="banner"
						className="_bannerImg w-full h-full object-contain max-[356px]:scale-125 sm:hidden inline"
						onLoad={() =>
							setImageLoaded((prev) => {
								return {
									...prev,
									banner: true,
								};
							})
						}
					/>
				</div>
			</div>

			{/* Category row display */}
			<div className="_categoriesDisplay bg-white py-6 px-10 mx-auto grid 2xl:grid-cols-10 xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 grid-cols-3 max-[356px]:grid-cols-1 max-[520px]:grid-cols-2 justify-items-center">
				{/* Skeleton */}
				{!(allCategoriesData.length > 0)
					? categoryPlaceholders.map((_, i) => {
							return (
								<div
									key={i + " skeletonLoader"}
									className="_skeletonLoader_categoriesDisplay bg-blue-100 rounded-md min-h-40 max-w-44 sm:w-36 w-30 flex flex-col items-center justify-center gap-3 animate-[pulse_850ms_linear_infinite] py-4 my-2"
								>
									<div className=" bg-gray-50 w-2/3 h-24 rounded-md" />
									<div className=" bg-gray-50 w-2/3 h-7 rounded-md" />
								</div>
							);
					  })
					: categoryPlaceholders.map((_, i) => {
							const c = allCategoriesData;
							const id = c[i]?._id.toString();
							const src = c[i]?.image;

							return (
								<div
									key={id + "-categoriesDisplay"}
									className="_categoriesDisplay bg-white rounded min-h-30 max-w-44 w-36 max-[356px]:w-[60%] flex flex-col items-center justify-center cursor-pointer select-none"
									onClick={() => handleCategoryDisplay(c[i])}
								>
									<div className="_categoryImageFrame bg-gray-50 w-full rounded-md overflow-hidden">
										<img
											src={src}
											alt="category"
											className="w-full h-full object-contain"
											loading="lazy"
										/>
									</div>
								</div>
							);
					  })}
			</div>

			{/* Category-wise Product Display/Sliders */}
			<div className="bg-white space-y-5 w-full select-none">
				{allCategoriesData.length > 0 &&
					categoryPlaceholders.map((_, i) => {
						const catName = allCategoriesData[i].name;
						const catId = allCategoriesData[i]._id.toString();
						return (
							<CategoryWiseProductsDisplay
								key={`${catId}-categoriesDisplay-${i}`}
								catName={catName}
								catId={catId}
							/>
						);
					})}
			</div>
		</section>
	);
};

export default Home;
