import React from "react";
import Nodata from "../assets/img/nothing here yet.webp";

const NoData = ({infoText = 'Nothing to Show here!'}) => {
	return (
		<div className="container max-w-[29rem] mx-auto flex flex-col justify-center overflow-hidden">
			<img className="w-full h-[90%] object-contain" src={Nodata} alt="No data" />
			<span className="text-center font-semibold text-sm sm:text-lg text-neutral-500">
				{infoText}
			</span>
		</div>
	);
};

export default NoData;
