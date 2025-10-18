import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../redux/products/productSlice";
import { IoIosSearch } from "react-icons/io";
import { escapeRegex } from "../utils/UtilityFunctions";
import { memo } from "react";

const ProductSearchFilter = ({ searchTextState, pagination }) => {
	const dispatch = useDispatch();
	const [searchText, setSearchText] = searchTextState;

	const firstMountApiCallRef = useRef(false);

	const queryFn = (value) => {
		return {
			name: { $regex: value, $options: "i" },
		};
	};

	const iRef = useRef(null);

	const handleClickSearchFilter = async (e) => {
		let value = escapeRegex(searchText);
		let query = queryFn(value);
		dispatch(fetchProducts({ ...pagination, query }));
	};
	const handleChange = (e) => {
		const { value } = e.target;
		setSearchText(value);
		if (iRef.current) {
			clearTimeout(iRef.current);
		}
		iRef.current = setTimeout(() => {
			dispatch(
				fetchProducts({
					...pagination,
					query: queryFn(escapeRegex(escapeRegex(value))),
				})
			);
		}, 900);
	};

	return (
		<div className="_searchProductsDiv font-normal rounded-md overflow-hidden sm:bg-blue-50 bg-amber-100 border border-neutral-300 hover:border-amber-500 focus-within:border-amber-500 relative">
			<IoIosSearch
				className="border-none absolute top-1 left-1 z-10 cursor-pointer hover:text-amber-600 active:text-amber-700"
				size="20"
				onClick={handleClickSearchFilter}
			/>
			<input
				className="_searchProducts px-2 pl-7.5 w-full h-full outline-none text-[16px] focus:bg-amber-50"
				type="text"
				name="search"
				id="search"
				value={searchText}
				onChange={handleChange}
			/>
		</div>
	);
};

export default memo(ProductSearchFilter);
