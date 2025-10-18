import React, { useEffect, useState } from "react";
import axiosErrorMsg from "../utils/axiosError";
import authAxiosInstance from "../config/authAxiosConfig";
import SummaryApi from "../Common/SummaryApi";
import AnimatingDots from "./AnimatingDots";
import { useDispatch } from "react-redux";
import { notifySuccess } from "../utils/foxToast";

const EditCategory = ({
	previewState,
	fileState,
	openEditState,
	categoryUpdatedState,
	currentCategoryState,
}) => {
	const dispatch = useDispatch();
	const [categoryUpdated, setCategoryUpdated] = categoryUpdatedState;
	const [openEdit, setOpenEdit] = openEditState;
	const [preview, setPreview] = previewState;
	const [currentCategory, setCurrentCategory] = currentCategoryState;
	const [file, setFile] = fileState;
	const [disabled, setDisabled] = useState(true);
	const [uploading, setUploading] = useState(false);
	const [form, setForm] = useState({
		name: "",
		image: "",
		categoryId: "",
	});

	const handleFileChange = (e) => {
		const imageFile = e.target.files[0];
		console.log(typeof imageFile);
		// console.log("imageName:", imageName.slice(0,imageName.lastIndexOf('.')));
		if (imageFile) {
			const imageName = imageFile?.name;
			setForm((prev) => {
				return {
					...prev,
					name: imageName.slice(0, imageName.lastIndexOf(".")),
					image: imageFile,
				};
			});
			setFile(imageFile);
			setPreview(URL.createObjectURL(imageFile));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (uploading) return; // if still uploading return user interaction

		setUploading(true);
		const formData = new FormData();
		formData.append("name", form.name.trim());
		formData.append("image", form.image);
		formData.append("categoryId", form.categoryId);

		try {
			const response = await authAxiosInstance({
				...SummaryApi.updateCategory,
				data: formData,
			});
			if (response.status === 200) {
				notifySuccess("Category updated successfully ✔");
				setCategoryUpdated(true);
				setOpenEdit(false);
			}
		} catch (error) {
			return axiosErrorMsg(error);
		} finally {
			setUploading(false);
		}
	};

	useEffect(() => {
		// console.log(currentCategory)
		setForm({
			name: currentCategory.name,
			image: currentCategory.image,
			categoryId: currentCategory.categoryId,
		});
		setPreview(currentCategory.image);
	}, []);

	useEffect(() => {
		if (preview) {
			setDisabled(false);
		} else setDisabled(true);
	}, [preview]);

	return (
		<div className="_editCategory px-2 py-3 sm:min-w-[550px] m-2.5">
			{/* Popup Form */}
			<form className="space-y-4" onSubmit={handleSubmit}>
			<h2 className="_title bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 p-2 px-3 mt-1.5 font-bold text-center uppercase rounded-lg">Edit Category</h2>
				<div className="_Name">
					<label className="grid">
						<span className="font-semibold">Name:</span>
						<input
							type="text"
							name="name"
							disabled={disabled}
							placeholder={disabled ? "Choose Category image below first" : "name"}
							title={disabled && "Choose image below first"}
							className="border outline-none focus:border-amber-200 focus:bg-amber-50 bg-blue-50 border-neutral-200 px-2 py-1 rounded-md enabled:hover:border-amber-200 disabled:bg-neutral-100 disabled:cursor-not-allowed max-sm:placeholder:text-xs"
							value={form.name}
							onChange={(e) => {
								setForm((prev) => {
									return { ...prev, name: e.target.value };
								});
							}}
						/>
					</label>
				</div>

				<div className="space-y-2">
					<h2 className="font-semibold text-center md:text-left">Image:</h2>
					<div className="_image flex md:flex-row flex-col items-center gap-4">
						<div className="_imageContainer border border-neutral-200 w-48 h-48 flex justify-center items-center rounded-lg overflow-hidden bg-blue-50">
							{preview ? (
								<img
									src={preview}
									alt="category"
									className="w-full h-full object-contain"
								/>
							) : (
								<span>No Image</span>
							)}
						</div>
						<div className="_button flex gap-2">
							<label
								htmlFor="category"
								className="border px-2 rounded cursor-pointer bg-amber-100 hover:bg-amber-300 hover:border-amber-400 border-amber-200"
							>
								Choose
							</label>
							<input
								type="file"
								name="category"
								id="category"
								onChange={handleFileChange}
								hidden
							/>
						</div>
					</div>
				</div>
				<button
					className={
						"border border-green-500 enabled:hover:bg-green-500 cursor-pointer font-semibold hover:text-white enabled:hover:shadow disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed disabled:border-neutral-200 p-2 rounded-lg font flex justify-center mx-auto my-3 mt-6 min-w-35 text-center " +
						(uploading ? "bg-green-500 text-white" : "bg-green-100")
					}
					style={{ wordSpacing: "2px" }}
					disabled={
						disabled ||
						Object.values(form).some((v) => {
							let value;
							if (typeof v === "string") value = v.trim();
							else value = v;
							return value === "";
						})
					}
				>
					{!uploading ? `Update Category` : <AnimatingDots text={"Updating"} />}
				</button>
			</form>
		</div>
	);
};

export default EditCategory;
