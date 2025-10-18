import React, { useEffect, useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useLocation, useNavigate, useParams } from "react-router";
import { IoMdArrowRoundBack } from "react-icons/io";
import useMobile from "../hooks/useMobile";
import { twMerge } from "tailwind-merge";
import { escapeRegex, isReactEvent } from "../utils/UtilityFunctions";
import axiosInstance from "../config/axiosConfig";
import SummaryApi from "../Common/SummaryApi";
import {
	setProductsSearched,
	setProductsSearchedCount,
	setProductsSearchedStatus,
} from "../redux/products/productSlice";
import { useDispatch, useSelector } from "react-redux";
import axiosErrorMsg from "../utils/axiosError";


const SearchMain = ({ setSearch, searchTextState }) => {
	const {search} = useLocation()
	const params = new URLSearchParams(search)

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [borderClr, setBorderClr] = useState("border-neutral-300");
	const [textClr, setTextClr] = useState("");
	const [backgroundClr, setBackgroundClr] = useState("bg-slate-50");
	const [mdBreakpoint] = useMobile();
	const [searchText, setSearchText] = searchTextState;
	
	const searchRef = useRef(null);
	const iRef = useRef(null);

	const getProductsData = async (searchTerm) => {
		try {
			dispatch(setProductsSearchedStatus("pending"));
			const { data: responseData } = await axiosInstance({
				...SummaryApi.fetchProducts,
				data: {
					limit: 24,
					sort: {
						score: { $meta: "textScore" },
					},
					query: {
						$text: { $search: escapeRegex(searchTerm.trim()) }, // full-word text search (uses text index, weighted)
					},
					select: "-categories -subCategories -moreDetails",
					lean: true,
					searchText: escapeRegex(searchTerm.trim()),
					searchMode: true,
					score: true,
				},
			});
			const data = responseData.data;
			// console.log("data: ", data);
			dispatch(setProductsSearched(data?.products));
			dispatch(setProductsSearchedCount(data?.count));
			dispatch(setProductsSearchedStatus("success"));
		} catch (error) {
			dispatch(setProductsSearchedStatus("failure"));
			return axiosErrorMsg(error);
		}
	};
	// Event Handlers
	const handleBack = (e) => {
		setSearch(false);
		navigate("/home", { replace: true });
	};
	const handleChange = (e) => {
		if (iRef.current) {
			clearTimeout(iRef.current);
		}
		
		let value;
		if(isReactEvent(e)) {
			value = e.target.value;
		} else {
			value = e;
		}

		setSearchText(value.trimStart());
		if (value.trim()) {
			iRef.current = setTimeout(() => {
				getProductsData(value.trim())
				
				navigate(`?q=${encodeURI(value.trim())}`, {replace: true})
			}, 900);
		} else {
			dispatch(setProductsSearched([]));
		}
	};
	const handleClickSearch = async () => {
		if (searchText.trim() === "") return;
		getProductsData(searchText);
	};

	useEffect(() => {
		searchRef.current.focus();
		const searchTxt = params.get("q")?.trim()
		if(searchTxt) {
			setSearchText(searchTxt)
			handleChange(searchTxt)
		}
		return () => {
			dispatch(setProductsSearched([]));
			dispatch(setProductsSearchedStatus());
			setSearchText("");
		};
	}, []);
	useEffect(() => {
		(async () => {
			if (searchText.trim() === "") {
				await new Promise((resolve) => {
					setTimeout(() => resolve(""), 500);
				});
				dispatch(setProductsSearchedStatus());
			}
		})();
		sessionStorage.setItem("mainSearchText", searchText.trim());
		if(!searchText) {
			// navigate('?q=', {replace: true})
			navigate('/search', {replace: true})
		}
	}, [searchText]);

	return (
		<div
			className={twMerge(
				"border text-neutral-500 md:min-w-xs max-w-xl min-h-9 rounded-xl px-2 flex flex-1 items-center gap-2 hover:cursor-text select-none mx-4 group",
				borderClr,
				backgroundClr
			)}
			// onClick={handleClickOnSearchBar}
		>
			<div
				className="search cursor-pointer"
				onClick={() => searchRef.current.focus()}
			>
				{mdBreakpoint ? (
					<IoMdArrowRoundBack size={25} className={textClr} onClick={handleBack} />
				) : (
					<IoIosSearch size={20} className={textClr} onClick={handleClickSearch} />
				)}
			</div>
			<input
				ref={searchRef}
				type="text"
				value={searchText}
				placeholder="Search for atta dal and more"
				className="flex items-center gap-2 sm:text-[0.95rem] text-sm w-full focus:outline-none"
				onFocus={() => {
					setBorderClr("border-amber-400");
					setTextClr("text-amber-400");
					setBackgroundClr("bg-amber-50");
				}}
				onBlur={() => {
					setBorderClr("border-neutral-300");
					setTextClr("");
					setBackgroundClr("bg-slate-50");
				}}
				onChange={handleChange}
			/>
		</div>
	);
};

export default SearchMain;
