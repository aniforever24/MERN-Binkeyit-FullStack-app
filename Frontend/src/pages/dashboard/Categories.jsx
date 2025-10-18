import React, { useEffect, useRef, useState } from "react";
import Modal from "../../components/modal";
import Popup from "../../components/Popup";
import AnimatingDots from "../../components/AnimatingDots";
import { useSelector, useDispatch } from "react-redux";
import { setCategories } from "../../redux/category/categorySlice";
import AddCategory from "../../components/AddCategory";
import axiosErrorMsg from "../../utils/axiosError";
import authAxiosInstance from "../../config/authAxiosConfig";
import SummaryApi from "../../Common/SummaryApi";
import { notifyError, notifySuccess } from "../../utils/foxToast";
import useMobile from "../../hooks/useMobile";
import CategoryOverlay from "../../components/OverlayElement";
import Spinner from "../../components/Spinner";
import NoData from "../../components/NoData";
import EditCategory from "../../components/EditCategory";
import ConfirmDeleteCategory from "../../components/ConfirmDelete";
import { AnimatePresence } from "motion/react";

const Categories = () => {
	const categories = useSelector((state) => state.category.categories);
	const dispatch = useDispatch();
	const [showPopup, setShowPopup] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState("");
	const [currentCategory, setCurrentCategory] = useState({});
	const [categoryUpdated, setCategoryUpdated] = useState(false);
	const [openDeleteCategory, setOpenDeleteCategory] = useState(false);
	const [deletingCategory, setDeletingCategory] = useState(false);
	const [lgjustifyStart, setLgjustifyStart] = useState(true);
	const [categoriesLoading, setCategoriesLoading] = useState(false);
	const [xlBreakpoint] = useMobile(1280);
	const categoriesRef = useRef([]);
	// const [categoriesArray, setCategoriesArray] = useState([]);

	const resetStates = () => {
		setPreview("");
		setFile(null);
		setCurrentCategory({});
	};

	const handleAddCategory = (e) => {
		setShowPopup(true);
	};

	const fetchCategories = async () => {
		try {
			setCategoriesLoading(true);
			const { data: responseData } = await authAxiosInstance({
				...SummaryApi.fetchCategories,
			});
			const categories = responseData?.data?.allCategories;
			if (categories) {
				// Sort categories alphabetically
				// const categoriesSorted = [...categories];
				// categoriesSorted.sort((a, b) => {
				// 	return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
				// });
				// dispatch(setCategories(categoriesSorted));
				dispatch(setCategories(categories));
			}
		} catch (error) {
			console.log("error:", error);
			return axiosErrorMsg(error);
		} finally {
			setCategoriesLoading(false);
		}
	};
	const handleEdit = async (e) => {
		const el = e.target.closest("._frame");
		const categoryImageURL = el.getElementsByClassName("_categoryImage")[0].src;
		const categoryName = el.getElementsByClassName("_categoryImage")[0].alt;
		const categoryId = el.dataset.assetId;
		setCurrentCategory((prev) => {
			const newCategory = {
				categoryId,
				image: categoryImageURL,
				name: categoryName,
			};
			return newCategory;
		});
		setOpenEdit(true);
		// console.log(
		// 	`categoryId: ${categoryId}\n`,
		// 	`categoryName: ${categoryName}\n`,
		// 	`categoryImageURL: ${categoryImageURL}\n`
		// );
	};

	const handleDelete = async (e) => {
		const el = e.target.closest("._frame");
		const categoryId = el.dataset.assetId;
		// const consent = confirm(
		// 	"Are you sure, you want to delete this category permanently? This cannot be undone."
		// );
		setCurrentCategory((prev) => {
			return { categoryId };
		});
		setOpenDeleteCategory(true);
	};

	const handleConfirmCategoryDelete = async (e) => {
		if (deletingCategory) return;
		setDeletingCategory(true);
		const { categoryId } = currentCategory;
		try {
			const response = await authAxiosInstance({
				...SummaryApi.deleteCategory,
				data: { categoryId },
			});
			// console.log("delete response:", response);
			if (response.status === 200) {
				notifySuccess("Category deleted successfully");
				setCategoryUpdated(true);
			}
		} catch (error) {
			console.log(error);
			return axiosErrorMsg(error);
		} finally {
			setOpenDeleteCategory(false);
			setDeletingCategory(false);
		}
	};

	// Goof function i created so just commented it out instead of removing it
	// const handleMouseOver = (e, i) => {
	// 	const el = e.currentTarget;
	// 	setCategoriesArray((prev) => {
	// 		let newAr = [...prev];
	// 		newAr[i].showCategoryOverlay = true;
	// 		return newAr;
	// 	});
	// };
	// const handleMouseOut = (e, i) => {
	// 	const el = e.currentTarget;
	// 	setCategoriesArray((prev) => {
	// 		let newAr = [...prev];
	// 		newAr[i].showCategoryOverlay = false;
	// 		return newAr;
	// 	});
	// };

	useEffect(() => {
		fetchCategories();
	}, []);

	// useEffect(()=> {
	// 	console.log("currentCategory: ", currentCategory)
	// }, [currentCategory])

	useEffect(() => {
		if (categoryUpdated) {
			fetchCategories();
			setCategoryUpdated(false);
		}
	}, [categoryUpdated]);

	useEffect(() => {
		if (!showPopup || !openEdit) {
			URL.revokeObjectURL(preview);
			// console.log("URL revoked");
			resetStates();
		}
	}, [showPopup, openEdit]);

	useEffect(() => {
		// console.log("categories:", categories)
		if (categories && xlBreakpoint && categories?.length > 5)
			setLgjustifyStart(false);
		else setLgjustifyStart(true);
	}, [categories, xlBreakpoint]);

	// useEffect(() => {
	// 	if (categories && categoriesRef.current.length > 0) {
	// 		setCategoriesArray((prev) => {
	// 			let a = [];
	// 			categories.forEach((el, i) => {
	// 				a[i] = {
	// 					element: categoriesRef.current[i],
	// 					showCategoryOverlay: false,
	// 				};
	// 			});
	// 			return a;
	// 		});
	// 	}
	// }, [categories]);

	return (
		<section className="border-l border-neutral-300  h-[79.5vh] overflow-y-auto">
			<div className="_topPart shadow-lg flex justify-between items-center w-full px-4 py-2.5 select-none sticky top-0 bg-white z-10">
				<h2 className="font-semibold text-lg">
					Categories {categories && <span>({categories.length})</span>}
				</h2>
				<button
					className="cursor-pointer border border-amber-400 px-2 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 hover:border-amber-500"
					onClick={handleAddCategory}
				>
					Add Category
				</button>

				<AnimatePresence>
					{showPopup && (
						<Popup close={() => setShowPopup(false)}>
							<AddCategory
								previewState={[preview, setPreview]}
								fileState={[file, setFile]}
								showPopupState={[showPopup, setShowPopup]}
								categoryUpdatedState={[categoryUpdated, setCategoryUpdated]}
							/>
						</Popup>
					)}

					{openEdit && (
						<Popup close={() => setOpenEdit(false)}>
							<EditCategory
								previewState={[preview, setPreview]}
								fileState={[file, setFile]}
								openEditState={[openEdit, setOpenEdit]}
								categoryUpdatedState={[categoryUpdated, setCategoryUpdated]}
								currentCategoryState={[currentCategory, setCurrentCategory]}
							/>
						</Popup>
					)}

					{openDeleteCategory && (
						<Popup
							close={() => {
								if (!deletingCategory) setOpenDeleteCategory(false);
							}}
						>
							<ConfirmDeleteCategory
								cancel={() => setOpenDeleteCategory(false)}
								confirm={handleConfirmCategoryDelete}
								deleting={deletingCategory}
								elName={"Category"}
							/>
						</Popup>
					)}
				</AnimatePresence>
			</div>

			{/* Categories */}
			<div
				className={
					"_categories flex flex-wrap gap-6 content-baseline justify-center border border-blue-50 px-4 py-4 overflow-y-auto relative select-none " +
					(lgjustifyStart ? "lg:justify-start" : "lg:justify-evenly")
				}
			>
				{categoriesLoading && (
					<div className="mx-auto my-6 mt-[10%]">
						<Spinner borderClr={"border-amber-500"} />
					</div>
				)}

				{!categoriesLoading &&
					categories &&
					categories.map((categ, i) => {
						const imageId = categ._id.toString();
						return (
							<div
								key={i}
								ref={(el) => {
									categoriesRef.current[i] = el;
								}}
								data-asset-id={imageId}
								className="_frame group cursor-pointer border border-neutral-200 w-53 h-53 overflow-hidden bg-blue-50 flex flex-col justify-start items-center gap-2 shadow-md rounded-lg relative"
								// onMouseOver={(e) => handleMouseOver(e, i)}
								// onMouseOut={(e) => handleMouseOut(e, i)}
							>
								<img
									src={categ.image}
									alt={categ.name}
									loading="lazy"
									className="_categoryImage w-full h-[81%] object-contain"
								/>
								<span className="_categoryName text-sm line-clamp-2 w-[12rem] text-center ">
									{categ.name}
								</span>

								{/* {categoriesArray[i]?.showCategoryOverlay && <CategoryOverlay />} */}
								<div className="absolute w-full h-full hidden group-hover:block">
									<CategoryOverlay
										openEditState={[openEdit, setOpenEdit]}
										handleEdit={handleEdit}
										handleDelete={handleDelete}
									/>
								</div>
							</div>
						);
					})}

				{!categoriesLoading && (!categories || categories.length < 1) && <NoData />}
			</div>
		</section>
	);
};

export default Categories;
