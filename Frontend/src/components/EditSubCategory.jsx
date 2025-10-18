import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useSelector, useDispatch } from "react-redux";
import axiosErrorMsg from "../utils/axiosError";
import authAxiosInstance from "../config/authAxiosConfig";
import SummaryApi from "../Common/SummaryApi";
import { notifyError, notifySuccess } from "../utils/foxToast";
import AnimatingDots from "./AnimatingDots";

const EditSubCategory = ({
	close,
	currentSubCategory,
	subCategoryUpdatedState,
}) => {
	const allCategories = useSelector((state) => state.category.categories);
	const dispatch = useDispatch();
	const [subCategoryUpdated, setSubCategoryUpdated] = subCategoryUpdatedState;
	const [disabled, setDisabled] = useState(true);
	const [uploading, setUploading] = useState(false);
	const [preview, setPreview] = useState("");
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [allCategoriesSorted, setAllCategoriesSorted] = useState([]);

	const [form, setForm] = useState({
		name: "",
		image: "",
		categories: [],
	});
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (uploading) {
			return;
		}
		// Validation
		if(!form.categories[0]) {
			return notifyError("At least One category is required!")
		}

		setUploading(true);
		const formData = new FormData();
		formData.append("name", form.name.trim());
		formData.append("image", form.image);
		formData.append("categories", JSON.stringify(form.categories));
		formData.append("subCategoryId", currentSubCategory._id.toString());
		formData.append("url", currentSubCategory.image);

		try {
			const response = await authAxiosInstance({
				...SummaryApi.updateSubCategory,
				data: formData,
			});
			const { data: responseData } = response;
			// console.log("responseData:", responseData);
			if (response.status === 201) {
				notifySuccess(responseData.message || "Sub category updated successfully ");
				setSubCategoryUpdated(true);
				close();
			}
		} catch (error) {
			console.log(error);
			axiosErrorMsg(error);
		} finally {
			setUploading(false);
		}
	};

	const handleFileChange = (e) => {
		const image = e.target.files[0];
		const imageName = image.name.slice(0, image.name.lastIndexOf("."));
		setForm((prev) => {
			return { ...prev, name: imageName, image: image };
		});
		setPreview(URL.createObjectURL(image));
	};

	// Callback to handle changes in the categories options
	const handleSelectChange = (e) => {
		const el = e.target;
		const selectedOption = el.options[el.selectedIndex];
		const selectedCategoryId = selectedOption.dataset.id;
		const selectedCategoryIndex = allCategoriesSorted.findIndex((cat) => {
			return cat._id === selectedCategoryId;
		});
		const selectedCategory = allCategoriesSorted[selectedCategoryIndex];
		if (selectedCategory)
			setSelectedCategories((prev) => {
				return [...prev, selectedCategory];
			});
		setAllCategoriesSorted((prev) => {
			let copy = [...prev];
			copy.splice(selectedCategoryIndex, 1);
			return copy;
		});
		el.value = el.options[0];
	};

	const handleClearSelectedCategory = (e, cat, i) => {
		setSelectedCategories((prev) => {
			let newAra = [...prev];
			newAra.splice(i, 1);
			return newAra;
		});
		setAllCategoriesSorted((prev) => {
			let copy = [...prev];
			copy.push(cat);
			copy.sort((a, b) => {
				let x = a?.name;
				let y = b?.name;
				if (y > x) return -1;
			});
			return copy;
		});
	};

	const handleClearAll = (e) => {
		setSelectedCategories((prev) => {
			return [];
		});
		sortAllCategoriesFn(allCategories);
	};
	// console.log("form:", form);

	const sortAllCategoriesFn = (allCategories) => {
		if (!Array.isArray(allCategories)) {
			throw Error("Input allCategories must be an Array of Categories!");
		}
		if (allCategories.length > 0) {
			const allCategoriesSorted = [...allCategories].sort((a, b) => {
				const x = a.name;
				const y = b.name;
				if (y > x) return -1;
			});
			setAllCategoriesSorted(allCategoriesSorted);
		}
	};

	useEffect(() => {
		// console.log("currentSubCategory: ", currentSubCategory);
		const categoryOptions = allCategories.filter((c) => {
			let result = currentSubCategory.categories.some((sc) => c._id === sc._id);
			return !result;
		});
		setSelectedCategories(currentSubCategory.categories);
		sortAllCategoriesFn(categoryOptions);
		setPreview(currentSubCategory.image);
		setForm((prev) => {
			return {
				...prev,
				name: currentSubCategory.name,
				image: currentSubCategory.image,
				categories: currentSubCategory.categories,
			};
		});
		setDisabled(false);
	}, []);

	useEffect(() => {
		return () => {
			URL.revokeObjectURL(preview);
		};
	}, [preview]);

	useEffect(() => {
		setForm((prev) => {
			return {
				...prev,
				categories: selectedCategories,
			};
		});
	}, [selectedCategories]);

	return (
		<div className="_addSubCategory px-2 py-3 sm:min-w-[550px] m-2.5">
			{/* Add Sub Category pop up form */}
			<form className="space-y-4 relative" onSubmit={handleSubmit}>
				<h2 className="_title bg-gradient-to-r from-amber-500/70 via-amber-400/60 to-amber-500/70 p-2 px-3 mt-1.5 font-bold text-center uppercase rounded-lg">
					Edit Sub Category
				</h2>

				{/* Sub category name */}
				<div className="_Name">
					<label className="grid gap-1.5">
						<span className="font-semibold">Name:</span>
						<input
							type="text"
							name="name"
							disabled={disabled}
							placeholder={disabled ? "Choose image below first" : "name"}
							title={disabled && "Choose image below first"}
							className="border outline-none focus:border-amber-200 focus:bg-amber-50 bg-blue-50 border-neutral-200 px-2 py-1 rounded-md enabled:hover:border-amber-200 disabled:bg-neutral-100 disabled:cursor-not-allowed max-sm:placeholder:text-xs"
							value={form.name}
							onChange={(e) => {
								setForm((prev) => {
									return { ...prev, name: e.target.value.trimStart() };
								});
							}}
						/>
					</label>
				</div>

				{/* Sub Category image */}
				<div className="_subCategoryImage space-y-2">
					<h2 className="font-semibold text-center md:text-left">Image:</h2>
					<div className="_image flex md:flex-row flex-col items-center gap-4">
						<div className="_imageContainer border border-neutral-200 w-48 h-48 flex justify-center items-center rounded-lg overflow-hidden bg-blue-50">
							{preview ? (
								<img
									src={preview}
									alt={form?.name}
									className="w-full h-full object-contain"
								/>
							) : (
								<span>No Image</span>
							)}
						</div>
						<div className="_button flex gap-2">
							<label
								htmlFor="subCategory"
								className="border px-2 rounded cursor-pointer bg-amber-100 hover:bg-amber-300 hover:border-amber-400 border-amber-200"
							>
								Choose
							</label>
							<input
								type="file"
								name="subCategory"
								id="subCategory"
								onChange={handleFileChange}
								hidden
							/>
						</div>
					</div>
				</div>

				{/* Select Category Element */}
				<div className="_selectCategory grid gap-2">
					<label
						htmlFor="categories"
						className="font-semibold text-center md:text-left"
					>
						Select Category {` (${allCategoriesSorted?.length})`}
					</label>
					{selectedCategories[0] && (
						<div className="relative">
							<button
								type="button"
								className="_clearAllButton absolute -top-2.5 right-8 z-10 bg-red-200 p-1 rounded-full shadow-lg border border-neutral-200 text-neutral-500 text-sm hover:bg-red-400 hover:text-white cursor-pointer"
								onClick={handleClearAll}
							>
								<RxCross2 className="" strokeWidth="" />
							</button>

							<div className="_selectedCategories flex flex-wrap content-evenly gap-3 font-[Kanit] p-2 w-full max-w-[530px] bg-amber-50 overflow-y-scroll max-h-30 relative">
								{selectedCategories.map((cat, i) => {
									return (
										<div className="_selectedCategory bg-neutral-50 hover:bg-neutral-100 hover:shadow-md pl-2 flex items-center gap-1.5 shadow">
											<span className="text-neutral-500 text-md font-[400]">
												{cat?.name}
											</span>
											<div
												className="hover:bg-red-300 h-full flex items-center justify-center px-1 cursor-pointer group"
												onClick={(e) => handleClearSelectedCategory(e, cat, i)}
											>
												<RxCross2 size={13} className="" />
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)}

					<select
						id="categories"
						name="categories"
						className="border border-neutral-300 bg-blue-50 px-2"
						defaultValue={"default"}
						onChange={handleSelectChange}
					>
						<option value="default" className="hidden">
							{allCategoriesSorted[0] ? "Select Category" : "Empty"}
						</option>
						{allCategoriesSorted &&
							allCategoriesSorted.map((cat, i) => {
								return (
									<option key={i} value={cat.name} data-id={cat._id}>
										{cat.name}
									</option>
								);
							})}
					</select>
				</div>

				{/* Form submit button */}
				<button
					type="submit"
					className={
						"border border-green-500 enabled:hover:bg-green-500 cursor-pointer font-semibold hover:text-white enabled:hover:shadow disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed disabled:border-neutral-200 p-2 rounded-lg font flex justify-center mx-auto my-3 mt-6 min-w-35 text-center " +
						(uploading
							? "bg-radial-[at_50%_75%] from-green-500 via-green-400 to-green-900 to-90% text-black"
							: "bg-green-100")
					}
					disabled={
						disabled ||
						Object.values(form).some((v) => {
							let value = v;
							if (typeof v === "string") value = v.trim();
							else if (Array.isArray(v)) return false;
							return value === "";
						})
					}
				>
					{!uploading ? (
						"Update Sub Category"
					) : (
						<AnimatingDots text={"Updating..."} />
					)}
				</button>
			</form>
		</div>
	);
};

export default EditSubCategory;
