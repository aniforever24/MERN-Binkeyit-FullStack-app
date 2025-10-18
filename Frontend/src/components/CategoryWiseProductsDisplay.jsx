import React, { memo, useEffect, useState } from "react";
import CategoryWiseProductsSlider from "./categoryWiseProductsSlider";
import SummaryApi from "../Common/SummaryApi";
import axiosErrorMsg from "../utils/axiosError";
import axiosInstance from "../config/axiosConfig";
import { setPageTitle } from "../utils/UtilityFunctions";

const CategoryWiseProductsDisplay = ({ catName, catId }) => {
	const [productsData, setProductsData] = useState([]);

	const payload = {
		limit: 20,
		sort: { name: 1 },
		query: { categories: { $in: [catId] } },
		select: "-categories -subCategories",
		lean: true
	};
	// api call
	const getProductData = async (payload) => {
		try {
			const response = await axiosInstance({
				...SummaryApi.fetchProducts,
				data: payload,
			});
			const { data: responseData } = response;
			setProductsData(responseData.data.products);
		} catch (error) {
			axiosErrorMsg(error);
		}
	};

	useEffect(() => {
		getProductData(payload);
	}, []);

	return (
		<>
			{productsData.length > 0 && (
				<div className="bg-white sm:px-10 px-6 space-y-2 w-full">
					<div className=" flex justify-between">
						<h3 className="font-semibold sm:text-xl">{catName}</h3>
						<button className="text-green-700 hover:text-green-500 active:text-green-600 cursor-pointer text-xs sm:text-base">
							See All
						</button>
					</div>
					<div className="overflow-hidden w-full">
						<CategoryWiseProductsSlider data={productsData} />
					</div>
				</div>
			)}
		</>
	);
};

export default memo(CategoryWiseProductsDisplay);
