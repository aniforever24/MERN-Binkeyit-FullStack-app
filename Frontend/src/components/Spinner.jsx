// borderClr is a tailwindcss class
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

const Spinner = ({ borderClr, customClass, customClassTrack }) => {
	const [n, setN] = useState(10)
	return (
		<div className="flex items-center justify-center relative">
			<div
				className={twMerge(
					"_revolvingCirle min-w-10 min-h-10 border-4 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-[spin_0.7s_linear_infinite] relative z-10",
					borderClr,
					customClass
				)}
			/>
			<div
				className={twMerge(
					"_track min-w-10  min-h-10 border-4 border-neutral-200 rounded-full absolute animate-none",
					customClassTrack
				)}
			/>
		</div>
	);
};

export default Spinner;
