import React, { memo, useEffect, useRef, useState } from "react";
import axiosErrorMsg from "../utils/axiosError";
import axiosInstance from "../config/axiosConfig";
import SummaryApi from "../Common/SummaryApi";
import { IoChevronBackOutline as Previous } from "react-icons/io5";
import { IoChevronForwardOutline as Next } from "react-icons/io5";
import { useNavigate } from "react-router";
import "./css/utilities.css";
import Product from "./Product";

const CategoryWiseProductsSlider = ({ data }) => {
	const navigate = useNavigate();
	const [disabled, setDisabled] = useState({ previous: false, next: false });
	const [nextBtnRight, setNextBtnRight] = useState(0);

	const slidesGap = 10; // _productSlider css gap variable
	const sliderRef = useRef(null);
	const rightBtnRef = useRef(null);

	// Event Handlers
	const handleClick = (id, name) => {
		const encodedName = encodeURI(name);
		navigate(`/product/${encodedName}-${id}`, { state: { id, name } });
	};
	const handleClickPrevious = () => {
		const elSlider = sliderRef.current;
		const card = elSlider.querySelector("._productCard");
		const w = card.offsetWidth;
		elSlider.scrollBy({ left: -(w + slidesGap), behavior: "smooth" });
	};
	const handleClickNext = () => {
		const elSlider = sliderRef.current;
		const card = elSlider.querySelector("._productCard");
		const w = card.offsetWidth;
		elSlider.scrollBy({ left: w + slidesGap, behavior: "smooth" });
	};
	const handleScrollSlider = () => {
		const el = sliderRef.current;
		if (!el) {
			return;
		}

		if (el.scrollLeft == 0) {
			setDisabled((prev) => {
				return {
					...prev,
					previous: true,
					next: false,
				};
			});
		} else if (
			el.scrollLeft != el.scrollWidth - el.clientWidth &&
			el.scrollLeft > 0
		) {
			setDisabled((prev) => {
				return {
					...prev,
					previous: false,
					next: false,
				};
			});
		} else if (el.scrollLeft == el.scrollWidth - el.clientWidth) {
			setDisabled((prev) => {
				return {
					...prev,
					next: true,
					previous: false,
				};
			});
		}
	};

	// Function to position the right button
	const calculateNextBtnRight = () => {
		const slider = sliderRef.current;
		const container = sliderRef.current.parentElement;
		if (slider.scrollWidth < container.clientWidth) {
			setNextBtnRight(container.clientWidth - slider.scrollWidth + 2);
		} else {
			setNextBtnRight(0);
		}
	};

	useEffect(() => {
		handleScrollSlider();

		window.addEventListener("resize", calculateNextBtnRight);
		return () => {
			window.removeEventListener("resize", calculateNextBtnRight);
		};
	}, []);
	useEffect(() => {
		calculateNextBtnRight();
	}, [data]);

	return (
		<div className="relative flex">
			<div
				ref={sliderRef}
				className={`_productsSlider bg-white flex relative p-1 scrollbar-hidden`}
				style={{ gap: slidesGap }}
				onScroll={handleScrollSlider}
			>
				{data.length > 0 &&
					data.map((p, i) => {
						return (
							<Product
								productData={p}
								handleClick={() => handleClick(p?._id?.toString(), p?.name)}
								keyExtend="name_slideItem"
							/>
						);
					})}
			</div>
			{data[0] && (
				<>
					<button
						type="button"
						disabled={disabled.previous}
						className="_previousBtn absolute top-[40%] left-0 z-10 bg-gray-100 hover:bg-gray-200 p-2 rounded-full flex justify-center items-center shadow-md hover:opacity-100 active:bg-gray-50 opacity-80 border border-gray-300 cursor-pointer group disabled:bg-gray-100 disabled:cursor-text disabled:opacity-50"
						onClick={(e) => handleClickPrevious()}
					>
						<span className=" group-hover:cursor-pointer group-disabled:text-gray-400 text-gray-700 group-disabled:cursor-text">
							<Previous size={25} />
						</span>
					</button>
					<button
						ref={rightBtnRef}
						type="button"
						disabled={disabled.next}
						className={
							"_nextBtn bg-gray-100 hover:bg-gray-200 p-2 rounded-full flex justify-center items-center shadow-md hover:opacity-100 active:bg-gray-50 opacity-80 border border-gray-300 cursor-pointer absolute z-10 top-[40%] right-0 group disabled:bg-gray-100 disabled:cursor-text disabled:opacity-50"
						}
						style={{ right: nextBtnRight }}
						onClick={(e) => handleClickNext()}
					>
						<span className=" group-hover:cursor-pointer group-disabled:text-gray-400 text-gray-700 group-disabled:cursor-text">
							<Next size={25} />
						</span>
					</button>
				</>
			)}
		</div>
	);
};

export default memo(CategoryWiseProductsSlider);
