import React, { memo, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/products/productSlice";
import { useNavigate, useParams } from "react-router";
import noData from "../assets/img/nothing here yet.webp";
import Spinner from "./Spinner";
import Product from "./Product";

const SubCategoryWiseProducts = () => {
	const params = useParams();
	const navigate = useNavigate()
	const dispatch = useDispatch();
	const productsData = useSelector((state) => state.product.products);
	const subCategories = useSelector((state) => state.category.subCategories);

	const [loading, setLoading] = useState(true);

	const subCatid = params?.subCategory.split("-").slice(-1)[0]

	const getSubCategoryName = (subData = []) => {
		const elSubCat = subData.filter((s, i) => {
			const id = s._id.toString();
			return id === subCatid;
		});
		return elSubCat[0]?.name;
	};
	
	const customClasses = {
		customClassFrame: "max-w-40 sm:w-50 w-auto",
		customClassDiscount: "sm:text-xs text-[10px]",
		customClassName: "text-xs sm:text-base",
		customClassUnit: "sm:text-md text-xs",
		customClassProduct: "min-w-40 sm:w-60 sm:min-w-60 py-2 sm:py-3 sm:gap-3 gap-2",
		customClassPrice: "text-xs",
		customClassBtn: "text-xs sm:text-base",
	};
	// Event Handlers
	const handleClick = (id, name) => {
		const encodedName = encodeURI(name);
		navigate(`/product/${encodedName}-${id}`, { state: { id, name } });
	};

	useEffect(() => {
		if (subCatid) {
			setLoading(true);
			dispatch(
				fetchProducts({
					limit: 0,
					sort: { name: 1 },
					query: { subCategories: { $in: [subCatid] } },
					lean: true
				})
			).then((v) => setLoading(false));
		}
	}, [subCatid]);

	return productsData[0] ? (
		<>
			<div className="bg-white border-neutral-50 sm:py-3 py-1 px-2 sm:px-3 flex items-center rounded shadow  sticky top-0 z-10 ">
				<h3 className="text-sm sm:text-lg font-medium">
					{subCategories[0] && getSubCategoryName(subCategories)}
				</h3>
			</div>
			{loading ? (
				<div className="w-full h-[50vh] flex justify-center items-center ">
					<Spinner borderClr={"text-amber-400"} />
				</div>
			) : (
				<>
					<div className="py-2">
						<div>
							<div
								className={`_products flex flex-wrap justify-center sm:justify-normal sm:gap-2 gap-3 relative sm:p-1`}
							>
								{productsData.length > 0 &&
									productsData.map((p, i) => {
										const id = p?._id.toString();
										const src = p?.images[0].url;
										const name = p?.name;
										const disc = p?.discount;
										const unit = p?.unit;
										const price = Number(p?.price);
										return (
											<Product 
											productData={p} 
											customClasses={customClasses}
											keyExtend={"subCategoryWiseProducts"}
											handleClick={()=> handleClick(id, name)}
											/>
										);
									})}
							</div>
						</div>
					</div>
				</>
			)}
		</>
	) : (
		<div
			className={[
				"flex flex-col items-center py-2",
				loading && "justify-center h-full",
			].join(" ")}
		>
			{loading ? (
				<div className="">
					<Spinner borderClr={"text-green-500"} />
				</div>
			) : (
				<>
					<div className="w-80">
						<img
							src={noData}
							alt="Nothing here yet!.png"
							className="w-full h-full object-contain"
						/>
					</div>
					<p className="font-medium mt-1">No Products Found!</p>
				</>
			)}
		</div>
	);
};

export default memo(SubCategoryWiseProducts);
