import React, { useEffect, memo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const ProductMoreDetailsDisplay = ({ data }) => {
	const [moreDetails, setMoreDetails] = useState([]);
	// console.log("moreDetails:", moreDetails);
	useEffect(() => {
		if (data?.moreDetails && Object.keys(data?.moreDetails).length > 0) {
			let d = data?.moreDetails;
			let d_array = [];
			for (const title in d) {
				if (Object.prototype.hasOwnProperty.call(d, title)) {
					const desc = d[title];
					d_array.push({
						id: uuidv4(),
						[title]: desc,
					});
				}
			}
			setMoreDetails(d_array);
		}
	}, [data]);

	return (
		<div className="container 2xl:max-w-[107rem] bg-blue-50 my-1 mx-auto grid sm:grid-cols-2 sm:gap-x-9 sm:gap-y-2 p-4 px-6">
			{moreDetails &&
				moreDetails.map((obj, i) => {
					const title = Object.keys(obj).filter((str) => str !== "id")[0];
					const description = obj[title];
					return (
						<div key={obj.id} className="">
							<div className="mt-2 mx-auto">
								<h4 className="font-semibold text-gray-900">{title}</h4>
								<p className="text-sm text-gray-600 text-justify">
									{description}
								</p>
							</div>
						</div>
					);
				})}
		</div>
	);
};

export default memo(ProductMoreDetailsDisplay);
