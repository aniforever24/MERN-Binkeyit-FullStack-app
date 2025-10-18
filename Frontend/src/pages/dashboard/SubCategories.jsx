import React, { useEffect, useState, Suspense, lazy, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
const Popup = lazy(() => import("../../components/Popup"));
const AddSubCategory = lazy(() => import("../../components/AddSubCategory"));
import { useSelector, useDispatch } from "react-redux";
import axiosErrorMsg from "../../utils/axiosError";
import SummaryApi from "../../Common/SummaryApi";
import {
	fetchSubCategories,
} from "../../redux/category/categorySlice";
import DataTable from "../../components/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import useMobile from "../../hooks/useMobile";
import "../css/Pages.css";
const EditSubCategory = lazy(() => import("../../components/EditSubCategory"));
const ConfirmDeleteSubCategory = lazy(() =>
	import("../../components/ConfirmDelete")
);
import authAxiosInstance from "../../config/authAxiosConfig";
import { notifySuccess } from "../../utils/foxToast";
import PreviewImage from "../../components/PreviewImage";
import { LuMoveDown, LuMoveUp } from "react-icons/lu";

const SubCategories = () => {
	const dispatch = useDispatch();
	const [smBreakpoint] = useMobile(640);
	const subCategories = useSelector((state) => state.category.subCategories);
	const totalSubCategories = useSelector(
		(state) => state.category.countAll.subCategories
	);
	const [showPopup, setShowPopup] = useState(false);
	const [subCategoryUpdated, setSubCategoryUpdated] = useState(false);
	const [currentSubCategory, setCurrentSubCategory] = useState({});
	const [deletingSubCategory, setDeletingSubCategory] = useState(false);
	const [openPreviewImg, setOpenPreviewImg] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const [previewImg, setPreviewImg] = useState({ name: "", url: "" });
	const [sort, setSort] = useState({
		flag: false,
		sortUp: false,
		order: 1,
	});
	const [pause, setPause] = useState(true);
	const [subCategParams, setSubCategParams] = useState({ page: 1, limit: 10 });

	const waitTimerRef = useRef(null);

	const handleAddSubCategory = (e) => {
		setShowPopup(true);
	};
	const confirmDeleteSubcategory = async (e) => {
		if (deletingSubCategory) return;
		setDeletingSubCategory(true);
		const subCategoryid = currentSubCategory._id;
		const image = currentSubCategory.image;
		// console.log("suCategoryid to delete: ", subCategoryid, currentSubCategory);

		try {
			const response = await authAxiosInstance({
				...SummaryApi.deleteSubCategory,
				data: { subCategoryid, image },
			});
			const { data: responseData } = response;
			// console.log("response: ", response)
			if (response.status === 200) {
				notifySuccess(
					`Sub category (${currentSubCategory.name}) deleted successfully ✔`
				);
				setSubCategoryUpdated(true);
			}
		} catch (error) {
			console.log("error >>", error);
			axiosErrorMsg(error);
		} finally {
			setDeletingSubCategory(false);
			setOpenDelete(false);
		}
	};
	
	const columnHelper = createColumnHelper();
	const columns = [
		columnHelper.accessor(
			(row) => {
				// console.log("row:", row);
				return row._id;
			},
			{
				header: "S.No.",
				cell: (info) => {
					// console.log("info:", info);
					return (
						<div className="inline-block select-none">{info.row.index + 1}</div>
					);
				},
				size: 50,
			}
		),
		columnHelper.accessor("name", {
			header: () => <NameCell sort={sort} waitTimerRef={waitTimerRef} />,
			size: 320,
			cell: (info) => {
				return (
					<div
						// title="click to copy text"
						className="font-semibold inline-block select-all"
						onClick={(e) => navigator.clipboard.writeText(e.target.textContent)}
					>
						{info.getValue()}
					</div>
				);
			},
		}),
		columnHelper.accessor("image", {
			header: "Image",
			cell: (info) => (
				<div
					title="Click to preview!"
					className="sm:w-17 sm:h-17 mx-auto cursor-pointer select-none  relative top-2"
				>
					<img
						src={info.getValue()}
						className="w-full h-full object-contain bg-white"
						loading="lazy"
						onClick={() => {
							previewImg.url = info.getValue();
							previewImg.name = info.row.original.name;
							setOpenPreviewImg(true);
						}}
					/>
				</div>
			),
			size: 50,
		}),
		columnHelper.accessor("categories", {
			header: "Categories",
			size: 800,
			cell: (info) => <CategoriesCell categories={info.row.original.categories} />,
		}),
		columnHelper.accessor(
			(row) => {
				// console.log("row:", row);
				return row._id;
			},
			{
				header: "Action",
				cell: (info) => {
					// console.log("info:", info.row.original)
					return (
						<div className="flex justify-center items-center flex-wrap sm:flex-nowrap sm:gap-3 gap-1">
							<div
								className="_editBtn relative text-green-500 cursor-pointer bg-green-200 hover:text-green-700 p-1.5 rounded-full"
								onClick={(e) => {
									setCurrentSubCategory(info.row.original);
									setOpenEdit(true);
								}}
							>
								<MdOutlineEdit size={smBreakpoint ? 12 : 21} />
							</div>
							<div
								className="_deleteBtn relative text-red-500 cursor-pointer bg-red-200 hover:text-red-700 p-1.5 rounded-full"
								onClick={(e) => {
									setCurrentSubCategory(info.row.original);
									setOpenDelete(true);
								}}
							>
								<RiDeleteBin5Fill size={smBreakpoint ? 12 : 21} />
							</div>
						</div>
					);
				},
				size: 100,
			}
		),
	];

	// columns components
	function NameCell({ sort, waitTimerRef }) {
		return (
			<div
				title={sort.flag ? "double click to reset sort" : "click to sort"}
				className="relative select-none flex flex-row-reverse justify-center items-center gap-1 cursor-pointer"
				onClick={() => {
					if (waitTimerRef.current) return;
					const sorted = !sort.sortUp ? { name: 1 } : { name: -1 };
					waitTimerRef.current = setTimeout(() => {
						dispatch(
							fetchSubCategories({
								page: subCategParams.page,
								limit: subCategParams.limit,
								sort: sorted,
							})
						);
						setSort((prev) => {
							return {
								...prev,
								flag: true,
								sortUp: !sort.sortUp,
							};
						});
						waitTimerRef.current = null;
					}, 200);
				}}
				onDoubleClick={() => {
					clearTimeout(waitTimerRef.current);
					waitTimerRef.current = null;
					dispatch(
						fetchSubCategories({
							page: subCategParams.page,
							limit: subCategParams.limit,
						})
					);
					setSort((prev) => {
						return {
							...prev,
							flag: false,
							sortUp: false,
						};
					});
				}}
			>
				{sort.flag &&
					(sort.sortUp ? (
						<div className="_sort ">
							<LuMoveUp />
						</div>
					) : (
						<div className="_sort ">
							<LuMoveDown />
						</div>
					))}
				<span>Name</span>
			</div>
		);
	}
	function CategoriesCell({ categories }) {
		return (
			<div className="_table-categories flex h-full flex-wrap gap-x-4 gap-y-2">
				{categories.map((c, i) => {
					return (
						<span
							key={c._id + "table"}
							// title="click to copy text"
							className="bg-neutral-100 hover:bg-neutral-200 border-b rounded-lg border-b-white cursor-pointer shadow-sm p-1 px-2 select-all"
							onClick={(e) => {
								navigator.clipboard.writeText(e.target.textContent);
							}}
						>
							{c.name}
						</span>
					);
				})}
			</div>
		);
	}

	// console.log("cellRef.current:" ,cellRef.current);

	useEffect(() => {
		dispatch(fetchSubCategories()).then((v)=> setPause(false))		
	}, [dispatch]);

	useEffect(() => {
		if (subCategoryUpdated) {
			dispatch(fetchSubCategories(subCategParams.page, subCategParams.limit));
			setSubCategoryUpdated(false);
		}
	}, [subCategoryUpdated]);

	return (
		<section className="border-l border-neutral-300  min-h-[79vh] relative">
			<div className="_topPart shadow-lg border-r-0 flex justify-between items-center w-full px-4 py-2.5 select-none sticky top-25 bg-white z-10">
				<h2 className="font-semibold sm:text-lg mr-1">
					Sub Categories {" "}
					<motion.span
						initial={{opacity: 0}}
						animate={{opacity: 1, transition: {duration: 0.6}}}
					> 
						{!pause && subCategories.length > 0 && totalSubCategories > 0 && `(${subCategories.length} of ${totalSubCategories})` } </motion.span>
					{/* Categories {categories && <span>({categories.length})</span>} */}
				</h2>
				<button
					className="cursor-pointer border border-amber-400 px-2 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 hover:border-amber-500 max-sm:text-sm"
					onClick={handleAddSubCategory}
				>
					Add Sub Category
				</button>

				<AnimatePresence>
					{showPopup && (
						<Suspense fallback={null}>
							<Popup close={() => setShowPopup(false)}>
								<AddSubCategory
									showPopupState={[showPopup, setShowPopup]}
									subCategoryUpdatedState={[subCategoryUpdated, setSubCategoryUpdated]}
								/>
							</Popup>
						</Suspense>
					)}
				</AnimatePresence>
			</div>

			{/* Sub Categories display */}
			<motion.div
				className="_subCategories p-2 px-3"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { duration: 0.6 } }}
			>
				{!pause && (
					<DataTable
						data={subCategories}
						columns={columns}
						pagination={subCategParams}
						setPagination={setSubCategParams}
						sort={sort}
						allDataCount={totalSubCategories}
					/>
				)}
				{/* <DataTable data={[]} columns={columns} /> */}
			</motion.div>

			<AnimatePresence>
				{openEdit && (
					<Suspense fallback={null}>
						<Popup close={() => setOpenEdit(false)}>
							<EditSubCategory
								close={() => setOpenEdit(false)}
								currentSubCategory={currentSubCategory}
								subCategoryUpdatedState={[subCategoryUpdated, setSubCategoryUpdated]}
							/>
						</Popup>
					</Suspense>
				)}
				{openDelete && (
					<Suspense fallback={null}>
						<Popup
							close={() => {
								if (deletingSubCategory) return;
								setOpenDelete(false);
							}}
						>
							<ConfirmDeleteSubCategory
								key="deleteSubCategoryElement"
								cancel={() => setOpenDelete(false)}
								confirm={(e) => confirmDeleteSubcategory(e)}
								deleting={deletingSubCategory}
								elName={"Sub category"}
							/>
						</Popup>
					</Suspense>
				)}

				{openPreviewImg && (
					<Suspense fallback={null}>
						<Popup close={() => setOpenPreviewImg(false)}>
							<PreviewImage
								close={() => setOpenPreviewImg(false)}
								previewImg={previewImg}
							/>
						</Popup>
					</Suspense>
				)}
			</AnimatePresence>
		</section>
	);
};

export default SubCategories;
