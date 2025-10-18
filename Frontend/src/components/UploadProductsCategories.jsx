import React, { memo, useEffect } from "react";
import { RxCrossCircled } from "react-icons/rx";
import { RxCross1 } from "react-icons/rx";
import './css/AddSubCategories.css'

const UploadProductsCategories = ({
	allCategoriesSortedState,
	selectedCategoriesState,
}) => {
	const [allCategoriesSorted, setAllCategoriesSorted] = allCategoriesSortedState;
	const [selectedCategories, setSelectedCategories] = selectedCategoriesState;
	// const [form, setForm] = formState;
	const handleSelectCategory = (e) => {
		e.preventDefault();
		const { selectedIndex } = e.target.options;
		const selectedElement = e.target.options[selectedIndex];
		const { catId } = selectedElement.dataset;
		const selectedCateg = allCategoriesSorted.filter(
			(c) => c._id.toString() === catId
		);
		const indexToDelete = allCategoriesSorted.findIndex(
			(c) => c._id.toString() === catId
		);
		setSelectedCategories((prev) => {
			return [...prev, ...selectedCateg];
		});
		setAllCategoriesSorted((prev) => {
			let newCats = [...prev];
			newCats.splice(indexToDelete, 1);
			return newCats;
		});
	};
	const handleDeleteSelectedCategory = (e, id, c, i) => {
		
		setSelectedCategories((prev) => {
			const s = [...prev]
			s.splice(i, 1);
			return s;
		});
		setAllCategoriesSorted((prev) => {
			const cs = [...prev, c];
			cs.sort((a, b) => {
				a = a?.name;
				b = b?.name;
				return b > a ? -1 : 1;
			});
			return cs;
		});
	};
	const handleClearAllSelected = (e) => {
	  const copy = [...selectedCategories];
	  setSelectedCategories([])
	  setAllCategoriesSorted((prev)=> {
		return [...prev, ...copy]
	  })
	}

	return (
		<>
			<div className="_categories font-semibold space-y-1.5 grid relative">
				<label htmlFor="categories" className="capitalize pl-1 w-fit">
					Categories:<span className="text-red-500"> *</span>
				</label>
				{selectedCategories[0] && (
					<>
						<div className="_selectedCategories border border-primary-200 bg-blue-50 max-h-30 px-2 pt-3 pb-2 flex flex-wrap gap-3 overflow-y-scroll select-none rounded-lg mb-2 relative">
							{selectedCategories.map((c, i) => {
								return (
									<div
										key={`${c.name}_${c._id.toString()}`}
										className="group font-light text-neutral-500 bg-emerald-100 w-fit pl-2 rounded-md shadow-sm hover:shadow-md  cursor-pointer hover:text-neutral-600 hover:bg-emerald-200 relative flex justify-between items-center gap-3"
									>
										<p className="sm:text-base text-sm font-kanit capitalize">{c.name}</p>
										<div
											className="relative bottom-0.5 cursor-pointer text-gray-400 group-hover:text-gray-700 hover:bg-red-400 hover:text-white h-fit p-1"
											onClick={(e) =>
												handleDeleteSelectedCategory(e, c._id.toString(), c, i)
											}
										>
											<RxCross1 className="stroke-1" size={11} />
										</div>
									</div>
								);
							})}
						</div>
						<div 
						className="_clearAllButton absolute right-5 top-7 z-10"
						onClick={(e)=> handleClearAllSelected(e)}
						>
							<RxCrossCircled className="rounded-full bg-green-400 hover:bg-green-600 text-green-100 hover:text-red-50 cursor-pointer" size={20} />
						</div>
					</>
				)}
				<select
					id="categories"
					name="categories"
					className="border border-neutral-200 bg-blue-50 p-1.5 px-2.5 outline-none focus:border-primary-100 focus:bg-green-50 hover:border-primary-100 rounded-lg capitalize font-normal focus:placeholder:opacity-0 placeholder:normal-case"
					onChange={(e) => handleSelectCategory(e)}
					title="Select from the dropdown"
					
				>
					<option hidden value="Select Categories">
						{`Select Categories (${allCategoriesSorted.length})`}
					</option>
					{allCategoriesSorted[0] &&
						allCategoriesSorted.map((cat, i) => {
							return (
								<option
									key={cat?.name + "_" + cat?._id.toString()}
									value={cat?.name}
									data-cat-id={cat?._id.toString()}
								>
									{cat?.name}
								</option>
							);
						})}
				</select>
			</div>
		</>
	);
};

export default memo(UploadProductsCategories);
