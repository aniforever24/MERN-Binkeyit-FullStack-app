import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { debounce } from "../utils/UtilityFunctions";

const Tooltip = ({
	text,
	tooltipStyle = "",
	tooltipStyleInvisible,
	children,
	delay = 1200,
}) => {
	const [visible, setVisible] = useState(false);
	const debounceVisible = debounce(setVisible, delay);

	useEffect(() => {
		if (visible) {
			debounceVisible(false);
		}
	}, [visible]);

	return (
		<div className={twMerge("relative inline-block w-fit")}>
			{/* Target Element */}
			<div
				onMouseEnter={() => setVisible(true)}
				onMouseLeave={() => setVisible(false)}
				className="cursor-pointer"
			>
				{children}
			</div>

			{/* Tooltip Box */}
			<div
				className={twMerge(
					"absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-1 bg-gray-800 text-white text-sm rounded shadow-lg whitespace-nowrap opacity-0 transition-all ease-in-out duration-300 select-none",
					tooltipStyleInvisible,
					visible && ["opacity-100", tooltipStyle].join(" ")
				)}
				onClick={(e) => {
					e.preventDefault;
					e.stopPropagation();
				}}
			>
				{text}
			</div>
		</div>
	);
};

export default Tooltip;
