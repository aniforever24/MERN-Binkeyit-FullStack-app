import React, {
	lazy,
	Suspense,
	useEffect,
	useRef,
	useState,
	useCallback,
} from "react";
import { MdCloudUpload, MdDeleteForever, MdFileUpload } from "react-icons/md";
import { LuImport } from "react-icons/lu";
const CarouselSlick = lazy(() => import("./CarouselSlick"));
import { IoCaretBack, IoCaretForward } from "react-icons/io5";
import PreviewImage from "./PreviewImage";
import Loading from "./Loading";
import { useDispatch, useSelector } from "react-redux";
import {
	setCategories,
	setSubCategories,
	fetchSubCategories,
	fetchCategories,
} from "../redux/category/categorySlice";
const Popup = lazy(() => import("./Popup"));
// import { RxCrossCircled, RxCross1 } from "react-icons/rx";
import UploadProductsCategories from "./UploadProductsCategories";
import UploadProductsSubCategories from "./UploadProductsSubCategories";
import { notifyError, notifySuccess } from "../utils/foxToast";
import Spinner from "./Spinner";
import axiosErrorMsg from "../utils/axiosError";
import authAxiosInstance from "../config/authAxiosConfig";
import SummaryApi from "../Common/SummaryApi";
import AnimatingDots from "./AnimatingDots";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate, Navigate } from "react-router";
import { fetchProducts } from "../redux/products/productSlice";

const EditProduct = () => {
	const location = useLocation();
	const navigate = useNavigate();
	if(!location.state?.product) {
			return <Navigate to="/user/dashboard/products" replace="true"/>
		}
	const dispatch = useDispatch();
	const allCategories = useSelector((state) => state.category.categories);
	const allSubCategories = useSelector((state) => state.category.subCategories);
	const [allCategoriesSorted, setAllCategoriesSorted] = useState([]); // by name
	const [allSubCategoriesSorted, setAllSubCategoriesSorted] = useState([]); // by name
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [selectedSubCategories, setSelectedSubCategories] = useState([]);
	const [pagination, setPagination] = useState({});
	const [reset, setReset] = useState({
		selectCategories: () => {},
		selectSubCategories: () => {},
	});
	const [form, setForm] = useState({
		id: "",
		name: "",
		description: "",
		imgs: [],
		images: [],
		categories: [],
		subCategories: [],
		unit: "",
		stock: "",
		price: "",
		discount: "",
		published: false,
		moreDetails: {},
	});
	const [uploadedImages, setUploadedImages] = useState({
		images: [],
		previews: [],
		ids: [],
	});
	const [currentSlide, setCurrentSlide] = useState(0);
	const [totalSlides, setTotalSlides] = useState(0);
	// const [isDragging, setIsDragging] = useState(false);
	const [showPreviewImg, setShowPreviewImg] = useState(false);
	const [previewImg, setPreviewImg] = useState({ name: "", url: "" });
	const [coverImage, setCoverImage] = useState({
		name: "",
		url: "",
		image: null,
	});
	// const [loadingPreview, setLoadingPreview] = useState(false);
	const [addMoreDetails, setAddMoreDetails] = useState([]);
	const [openMoreDetails, setOpenMoreDetails] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const [newDetailAdded, setNewDetailAdded] = useState(false);

	const jRef = useRef(null);
	const newDetailsTitleRef = useRef(null);
	const formSubmitBtn = useRef(null);
	const productForm = useRef(null);
	const runOnceRef = useRef({
		category: false,
		subCategory: false,
	});

	const product = location?.state?.product

	async function handleImportData(e) {
		const file = e.target.files[0];
		const fileReader = new FileReader(); // File reader api to read file
		let data = [];
		// console.log(file)
		if (file && file.type === "application/json") {
			// When fileRead api finished reading of the file successfully
			fileReader.addEventListener("load", (e) => {
				try {
					data = JSON.parse(e.target.result);
					updateDataStates(data);
				} catch (error) {
					console.log(error);
					return notifyError(
						error?.message || "There's an error in parsing the imported data"
					);
				}
			});
			// If any error occured in reading the file
			fileReader.addEventListener("error", (e) => {
				console.log("Error in reading imported file:", fileReader.error);
				return notifyError(fileReader?.error?.message || "Error in reading file!");
			});
			// Try to read contenst of the file as text
			fileReader.readAsText(file);

			function updateDataStates(data) {
				const { name, description, unit, stock, price, discount } = data;
				let { moreDetails } = data;
				let addMoreDetails;
				if (Object.keys(moreDetails)[0]) {
					addMoreDetails = Object.keys(moreDetails).map((name, i) => {
						return {
							name,
							details: "",
							id: uuidv4(),
						};
					});
				}
				setAddMoreDetails(addMoreDetails);
				setForm((prev) => {
					return {
						...prev,
						...(name && { name }),
						...(description && { description }),
						...(description && { description }),
						...(unit && { unit }),
						...(stock && { stock }),
						...(price && { price }),
						...(discount && { discount }),
						published: true,
						...(moreDetails && { moreDetails }),
					};
				});
				// Reset input type=file for reselection properly
				e.target.value = null;
			}
		} else {
			return notifyError("Imported file is not of type json!");
		}
	}

	// A kind of form validation (can submit form only if this validation passes)
	const isDisabled = () => {
		const isDisabled = Object.entries(form).some((entry) => {
			let v = entry[1]; // form field value
			let n = entry[0]; // form field label

			if ((typeof v === "object" && n === "subCategories") || n === "imgs") {
				return false;
			} else if (n !== "discount" && v?.length > 0) {
				return false;
			} else if (n !== "discount" && v?.length === 0) {
				return true;
			}
			return false;
		});
		return isDisabled;
	};

	// Event Listener functions
	const onChange = (e) => {
		const { name, value } = e.target;
		const type = e.target.type;

		setForm((prev) => {
			return {
				...prev,
				[name]: type === "checkbox" ? e.target.checked : value,
			};
		});
	};
	const handleImageFileChange = (e) => {
		let Ids = [];
		const imageFiles = Object.values(e.target.files);
		const previews = imageFiles.map((file, i) => {
			const preview = URL.createObjectURL(file);
			Ids[i] = uuidv4();
			return preview;
		});
		setUploadedImages((prev) => {
			return {
				...prev,
				images: [...prev.images, ...imageFiles],
				previews: [...prev.previews, ...previews],
				ids: [...prev.ids, ...Ids],
			};
		});
		setForm((prev) => {
			return {
				...prev,
				images: [...prev.images, ...imageFiles],
			};
		});

		// Reset the input type=file value for allwing reselection
		// of images again properly
		e.target.value = null;
	};
	const handleDeletePreview = (e, ind, preview) => {
		e.stopPropagation();

		setUploadedImages((prev) => {
			const newPreviews = [...prev.previews];
			const newImages = [...prev.images];
			const newIds = [...prev.ids];
			newPreviews.splice(ind, 1);
			newImages.splice(ind, 1);
			newIds.splice(ind, 1);
			return {
				...prev,
				images: [...newImages],
				previews: [...newPreviews],
				ids: [...newIds],
			};
		});
		setForm((prev) => {
			const newImages = [...prev.images];
			newImages.splice(ind, 1);
			return {
				...prev,
				images: [...newImages],
			};
		});
		// Delete image preview completely from browser cache
		URL.revokeObjectURL(preview);
	};
	const handleAddMoreDetails = (e) => {
		const detailsName = newDetailsTitleRef.current.value.trimStart();
		if (!detailsName) {
			return notifyError("New field name cannot be empty!");
		}
		const names = addMoreDetails.map((o, i) => {
			return o.name.trim();
		});
		const isDuplicate = names.some((n) => {
			return detailsName.trim() === n;
		});
		if (isDuplicate) {
			return notifyError(
				"Duplicate name is not allowed! Please Choose a different name."
			);
		}
		setAddMoreDetails((prev) => {
			return [
				...prev,
				{
					name: detailsName,
					details: "",
					id: uuidv4(),
				},
			];
		});
		setForm((prev) => {
			return {
				...prev,
				moreDetails: {
					...prev.moreDetails,
					[detailsName]: "",
				},
			};
		});
		setOpenMoreDetails(false);
	};
	const handleUploadCover = (e) => {
		// Before selecting new cover image
		// revoke previous cover url from memory
		if (coverImage.url) {
			URL.revokeObjectURL(coverImage.url);
		}
		const file = e.target.files[0];
		if (!file) {
			notifyError("No image selected!");
			console.log("No image selected!");
			return;
		}
		const i = file?.name.lastIndexOf(".");
		const name = file?.name.slice(0, i);
		//   return console.log(file)
		const url = URL.createObjectURL(file);
		setCoverImage((prev) => {
			return {
				...prev,
				name,
				url,
				image: file,
			};
		});
		const previewsCoverStr = sessionStorage.getItem("previewsCover");
		if (previewsCoverStr) {
			const previewsCover = JSON.parse(previewsCoverStr);
			previewsCover.push(url);
			sessionStorage.setItem("previewsCover", JSON.stringify(previewsCover));
		} else {
			sessionStorage.setItem("previewsCover", JSON.stringify([url]));
		}
		e.target.value = null;
	};

	const handleUpdate = async (e) => {
		// If use clicked on submit button during uploading product
		e.preventDefault();
		if (uploading) return;

		setUploading(true);
		// Append cover image(if any) as the first
		// image in form.images
		const allImages = [coverImage?.image, ...form.images];
		let imgs = [];
		const images = allImages.filter((img) => {
			if (img?.url) {
				if (img?._id) {
					const { _id, ...rest } = img;
					imgs.push(rest);
				} else imgs.push(img);
				return false;
			} else return img;
		});

		const formData = new FormData();
		// Append all product images to formData key 'images'
		for (let i = 0; i < images.length; i++) {
			const file = images[i];
			formData.append("images", file);
		}

		// Append rest of the form data to formData
		for (const key in form) {
			const value = form[key];
			if (key === "images") continue; // skip this iteration in the given condition

			if (typeof value === "object") {
				formData.append(key, JSON.stringify(value));
			} else {
				formData.append(key, value);
			}
		}
		// Set (replace) 'img' and 'images' to the new value in formData
		formData.set("imgs", JSON.stringify(imgs));

		try {
			const response = await authAxiosInstance({
				...SummaryApi.updateProduct,
				data: formData,
			});
			const { data: responseData } = response;

			if (response.status === 201) {
				notifySuccess(responseData?.message);
			}
		} catch (error) {
			console.log(error);
			return axiosErrorMsg(error);
		} finally {
			setUploading(false);
		}
		dispatch(
			fetchProducts({
				...pagination,
				sort: { updatedAt: -1 },
			})
		);
		jRef.current = setTimeout(() => {
			navigate("/user/dashboard/products", {
				state: { updated: true, pagination },
				replace: true,
			});
		}, 2500);
	};
	function updateSortedCategories(
		selected = [],
		stateData,
		setStateData,
		runOnce
	) {
		if (!selected[0] || !stateData[0]) return;
		let indexes = [];
		const stateDataIds = stateData.map((o) => o._id);
		selected.forEach((s) => {
			const selectedId = s._id;
			const ind = stateDataIds.indexOf(selectedId);
			indexes.push(ind);
		});
		setStateData((prev) => {
			const p = [...prev];
			indexes.forEach((ind) => {
				p.splice(ind, 1);
			});
			return p;
		});
		runOnce();
	}
	// Functions for prefilling products data
	function preFillingMoreDetails(product) {
		const { moreDetails } = product;
		let prevDetails = [];
		for (const key in moreDetails) {
			const val = moreDetails[key];
			prevDetails.push({ name: key, details: val, id: uuidv4() });
		}
		setAddMoreDetails((prev) => {
			return [...prevDetails];
		});
		setForm((prev) => {
			return { ...prev, moreDetails: { ...moreDetails } };
		});
	}
	function prefillingImages(product) {
		const { images } = product;
		let ids = [];
		let imgs = images.map((img, i, ar) => {
			ids[i] = uuidv4();
			return img.url;
		});
		// imgs.shift();
		setUploadedImages({
			images: [...imgs],
			previews: [...imgs],
			ids: [...ids],
		});
		setForm((prev) => {
			return { ...prev, images };
		});
		// setCoverImage((prev) => {
		// 	return {
		// 		...prev,
		// 		name: "cover",
		// 		url: images[0].url,
		// 	};
		// });
	}
	function prefillingCategories(product) {
		const { categories } = product;
		setSelectedCategories([...categories]);
	}
	function prefillingSubCategories(product) {
		const { subCategories } = product;
		setSelectedSubCategories([...subCategories]);
	}

	// Slider prev and next arrow customization and settings
	function PrevArrow1(props) {
		const { disabled, onClick } = props;

		return (
			<button
				type="button"
				disabled={disabled}
				className={`_prevArrow block absolute top-[30%] -left-10 z-10 text-secondary-100 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer active:text-primary-100 disabled:hidden`}
				// style={{ ...style, display: "block", }}
				// onClick={onClick}
				onClick={!disabled ? onClick : null}
			>
				<IoCaretBack size={40} />
			</button>
		);
	}
	function NextArrow1(props) {
		const { disabled, onClick } = props;
		return (
			<button
				type="button"
				disabled={disabled}
				className="_nextArrow block absolute top-[30%] -right-10 z-10 text-secondary-100 disabled:text-gray-500 cursor-pointer disabled:cursor-not-allowed active:text-primary-100 disabled:hidden"
				// style={{ ...style, display: "block", background: "red" }}
				onClick={!disabled ? onClick : null}
				// onClick={onClick}
			>
				<IoCaretForward size={40} />
			</button>
		);
	}
	let slidesToShow = 5;
	const sliderSettings = {
		dots: true,
		infinite: false,
		slidesToShow,
		slidesToScroll: 5,
		lazyLoad: true,
		afterChange: (current) => {
			setCurrentSlide(current);
		},
		// prevArrow: <PrevArrow1 />,
		prevArrow: <PrevArrow1 disabled={currentSlide === 0} />,
		// nextArrow: <NextArrow1 />,
		nextArrow: (
			<NextArrow1 disabled={currentSlide === totalSlides - slidesToShow} />
		),
		responsive: [
			{
				breakpoint: 1600,
				settings: {
					slidesToShow: 4,
					slidesToScroll: 4,
					nextArrow: <NextArrow1 disabled={currentSlide === totalSlides - 4} />,
				},
			},
			{
				breakpoint: 1300,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 2,
					nextArrow: <NextArrow1 disabled={currentSlide === totalSlides - 3} />,
				},
			},
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					nextArrow: <NextArrow1 disabled={currentSlide === totalSlides - 2} />,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					nextArrow: <NextArrow1 disabled={currentSlide === totalSlides - 1} />,
					dots: false,
					// infinite: true,
				},
			},
		],
	};
	
	useEffect(() => {
		const { pagination } = location.state;
		setPagination((prev) => {
			return {
				...prev,
				...pagination,
			};
		});
	}, []);

	useEffect(() => {
		// Revoke all temporary previews urls from browser memory
		// when this main component is unmounted
		return () => {
			if (sessionStorage.getItem("previews")) {
				const previews = JSON.parse(sessionStorage.getItem("previews"));
				previews.forEach((url, _) => {
					URL.revokeObjectURL(url);
				});
				sessionStorage.removeItem("previews");
			}
			if (sessionStorage.getItem("previewsCover")) {
				const previewsCover = JSON.parse(sessionStorage.getItem("previewsCover"));
				previewsCover.forEach((url, _) => {
					URL.revokeObjectURL(url);
				});
				sessionStorage.removeItem("previewsCover");
			}
		};
	}, []);
	// Pre Fill product details
	useEffect(() => {
		const {
			name,
			description,
			unit,
			stock,
			price,
			discount,
			published,
			_id: id,
		} = product;
		setForm((prev) => {
			return {
				...prev,
				id,
				name,
				description,
				unit,
				stock,
				price,
				discount,
				published,
			};
		});
		preFillingMoreDetails(product);
		prefillingImages(product);
		prefillingCategories(product);
		prefillingSubCategories(product);

		return () => {
			if (jRef.current) {
				clearTimeout(jRef.current);
				jRef.current = null;
			}
		};
	}, []);
	useEffect(() => {
		dispatch(fetchSubCategories({ page: 1, limit: 0 }));
		dispatch(fetchCategories());
	}, [dispatch]);
	useEffect(() => {
		if (allCategories[0] && !allCategoriesSorted[0]) {
			setAllCategoriesSorted((prev) => {
				const sorted = [...allCategories].sort((a, b) => {
					a = a.name;
					b = b.name;
					return b > a ? -1 : 1;
				});
				return sorted;
			});
		}
		if (allSubCategories[0] && !allSubCategoriesSorted[0]) {
			setAllSubCategoriesSorted((prev) => {
				const sorted = [...allSubCategories].sort((a, b) => {
					a = a.name;
					b = b.name;
					return b > a ? -1 : 1;
				});
				return sorted;
			});
		}
	}, [allCategories, allSubCategories]);
	useEffect(() => {
		const previewsString = JSON.stringify(uploadedImages.previews);
		sessionStorage.setItem("previews", previewsString);
		setTotalSlides(uploadedImages.previews.length);
	}, [uploadedImages]);

	useEffect(() => {
		setForm((prev) => {
			return {
				...prev,
				categories: selectedCategories[0] ? selectedCategories : [],
				subCategories: selectedSubCategories[0] ? selectedSubCategories : [],
			};
		});
	}, [selectedCategories, selectedSubCategories]);
	useEffect(() => {
		if (
			selectedCategories[0] &&
			allCategoriesSorted[0] &&
			!runOnceRef.current.category
		) {
			updateSortedCategories(
				selectedCategories,
				allCategoriesSorted,
				setAllCategoriesSorted,
				() => {
					runOnceRef.current.category = true;
				}
			);
		}
		if (
			selectedSubCategories[0] &&
			allSubCategoriesSorted[0] &&
			!runOnceRef.current.subCategory
		) {
			updateSortedCategories(
				selectedSubCategories,
				allSubCategoriesSorted,
				setAllSubCategoriesSorted,
				() => {
					runOnceRef.current.subCategory = true;
				}
			);
		}
	}, [
		selectedCategories,
		selectedSubCategories,
		allSubCategoriesSorted,
		allCategoriesSorted,
	]);
	useEffect(() => {
		setDisabled(isDisabled);
	}, [isDisabled()]);
	useEffect(() => {
		// console.log("form:", form);
	}, [form]);

	return (
		<section className="_editProducts min-h-[80vh] w-full pb-4 relative z-0">
			{/* Top Part */}
			<div className="_topPart select-none border-b border-r-0 bg-white border-neutral-200 px-3 py-3.5 shadow-lg font-bold text-lg sticky top-25 z-20 w-full flex justify-between items-center">
				<h2>Edit Product</h2>
				<label
					title="Import Data"
					className="block sm:mr-3 font-normal text-neutral-500 shadow-md border border-gray-100 px-1 cursor-pointer hover:bg-neutral-50 hover:text-neutral-800"
				>
					<LuImport size="27" />
					<input
						type="file"
						name="data"
						id="data"
						accept=".json"
						hidden
						onChange={handleImportData}
					/>
				</label>
			</div>

			{/* Upload Products */}
			<div className="_bottomPart px-3 ">
				<form
					ref={productForm}
					className="border border-t-0 border-gray-100 py-4 sm:px-4 px-2 space-y-5 relative select-none"
					onSubmit={(e) => handleUpdate(e)}
				>
					{/* Product Name */}
					<div className="_name font-semibold space-y-1.5 grid">
						<label htmlFor="name" className="capitalize pl-1 w-fit">
							Name:<span className="text-red-500"> *</span>
						</label>
						<input
							id="name"
							name="name"
							value={form.name}
							className="border border-neutral-200 bg-blue-50 p-1.5 px-2.5 outline-none focus:border-primary-100 focus:bg-amber-50 hover:border-primary-100 rounded-lg capitalize font-normal focus:placeholder:opacity-0 placeholder:normal-case"
							type="text"
							placeholder="Enter name Of the product"
							onChange={onChange}
							minLength="3"
							required
						/>
					</div>

					{/* Product Description */}
					<div className="_description font-semibold space-y-1.5 grid">
						<label htmlFor="desc" className="capitalize pl-1 w-fit">
							Description:<span className="text-red-500"> *</span>
						</label>
						<textarea
							id="desc"
							name="description"
							value={form.description}
							className="border border-neutral-200 bg-blue-50 p-1.5 px-2.5 outline-none focus:border-primary-100 focus:bg-amber-50 hover:border-primary-100 rounded-lg font-normal focus:placeholder:opacity-0 resize-none"
							type="text"
							placeholder="Enter description of the product"
							rows="4"
							onChange={onChange}
							required
							minLength="3"
						/>
					</div>

					{/* Product Images */}
					<div className="_Images space-y-1.5" title="Select image(s) to upload">
						<h3 className="capitalize pl-1 font-semibold w-fit">
							Images:<span className="text-red-500"> *</span>
						</h3>

						<div className="_uploadImages border border-neutral-200 p-2 py-4 text-center space-y-4 rounded-lg bg-blue-50 hover:border-primary-100 w-full overflow-hidden">
							<div
								className={
									"_imagePreviews md:max-w-[55vw] max-w-[60vw] min-w-[250px] mx-auto relative overflow-hidden " +
									(uploadedImages?.previews[0] && "px-10 py-8 ")
								}
							>
								<Suspense fallback={null}>
									{uploadedImages?.previews[0] && (
										<CarouselSlick settings={sliderSettings}>
											{uploadedImages.previews.map((preview, i) => {
												const imageFile = uploadedImages.images[i];
												const id = uploadedImages.ids[i];
												return (
													<div
														key={id}
														className={`_imageContainer border border-neutral-300 max-w-40 h-40 rounded-md mx-1 p-2 bg-amber-50 relative group cursor-pointer`}
														onClick={(e) => {
															setPreviewImg({ name: imageFile.name, url: preview });
															setShowPreviewImg(true);
														}}
													>
														<img
															className="w-full h-full object-contain"
															src={preview}
															alt={uploadedImages.images[i].name}
															// loading="lazy"
															// title={uploadedImages.images[i].name}
														/>
														<div
															title="delete"
															className="_deletePreviewImg absolute right-0 bottom-0 bg-red-100 hover:bg-red-200 p-1 border border-red-200 hover:border-red-500 rounded-tl-xl hidden group-hover:block group/icon"
															onClick={(e) => handleDeletePreview(e, i, preview)}
														>
															<MdDeleteForever
																size={22}
																className="text-red-400 group-hover/icon:text-red-700"
															/>
														</div>
													</div>
												);
											})}
										</CarouselSlick>
									)}
									{/* Image preview rendering in the body */}
									{showPreviewImg && (
										<Popup close={() => setShowPreviewImg(false)}>
											<PreviewImage
												close={() => setShowPreviewImg(false)}
												previewImg={previewImg}
											/>
										</Popup>
									)}
								</Suspense>
							</div>
							<label
								title="upload images"
								className="_upload cursor-pointer flex flex-col justify-center items-center w-fit mx-auto shadow hover:shadow-lg active:shadow p-1 group bg-neutral-50"
								tabIndex="0"
							>
								<MdCloudUpload
									className="_uploadIcon group-hover:text-green-500 relative"
									size={30}
								/>
								<span className="group-hover:text-green-500">Upload</span>

								<input
									type="file"
									accept="image/*"
									multiple
									hidden
									onChange={handleImageFileChange}
								/>
							</label>
						</div>
					</div>

					{/* Product Cover image */}
					<div className="_coverImageMain">
						<h3 className="capitalize pl-1 font-semibold w-fit">Cover Image:</h3>
						<div className="_uploadCoverImage border border-neutral-200 p-2 py-4 text-center space-y-4 rounded-lg bg-blue-50 hover:border-primary-100 w-full overflow-hidden">
							{coverImage.url && (
								<div className="_coverImageFrame border border-amber-100 rounded-xl w-40 h-40 overflow-hidden mx-auto relative group">
									<img
										className="_coverImage object-cover w-full h-full"
										src={coverImage.url}
										alt={coverImage.name}
									/>
									<div
										className="_deleteCover text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:text-red-700 absolute bottom-0.5 right-0 cursor-pointer bg-red-200 p-1 rounded-tl-xl"
										onClick={(e) => {
											setCoverImage((prev) => {
												URL.revokeObjectURL(prev.url);
												return {
													...prev,
													name: "",
													url: "",
													image: null,
												};
											});
										}}
									>
										<MdDeleteForever size={22} className="" />
									</div>
								</div>
							)}
							<label
								title="upload cover"
								className="_upload cursor-pointer flex flex-col justify-center items-center w-fit mx-auto shadow hover:shadow-lg active:shadow p-1 group bg-neutral-50"
								tabIndex="0"
							>
								<MdFileUpload
									className="_uploadIcon group-hover:text-green-500 relative"
									size={30}
								/>
								<input
									type="file"
									accept="image/*"
									hidden
									onChange={handleUploadCover}
								/>
							</label>
						</div>
					</div>

					{/* Product Categories */}
					<UploadProductsCategories
						allCategoriesSortedState={[allCategoriesSorted, setAllCategoriesSorted]}
						selectedCategoriesState={[selectedCategories, setSelectedCategories]}
						setReset={setReset}
						// formState={[form, setForm]}
					/>

					{/* Product Sub Categories */}
					<UploadProductsSubCategories
						allSubCategoriesSortedState={[
							allSubCategoriesSorted,
							setAllSubCategoriesSorted,
						]}
						selectedSubCategoriesState={[
							selectedSubCategories,
							setSelectedSubCategories,
						]}
						setReset={setReset}
						// formState={[form, setForm]}
					/>

					{/* Unit */}
					<div className="_unit font-semibold space-y-1.5 grid">
						<label htmlFor="unit" className=" pl-1 w-fit">
							Unit(s):<span className="text-red-500"> *</span>
						</label>
						<input
							id="unit"
							name="unit"
							value={form.unit}
							className="border border-neutral-200 bg-blue-50 p-1.5 px-2.5 outline-none focus:border-primary-100 focus:bg-amber-50 hover:border-primary-100 rounded-lg font-normal focus:placeholder:opacity-0 placeholder:normal-case"
							type="text"
							placeholder="Enter product units"
							onChange={onChange}
							required
						/>
					</div>

					{/* Stock */}
					<div className="_stock font-semibold space-y-1.5 grid">
						<label htmlFor="stock" className="pl-1 w-fit">
							Stock:<span className="text-red-500"> *</span>
						</label>
						<input
							id="stock"
							name="stock"
							value={form.stock}
							className="border border-neutral-200 bg-blue-50 p-1.5 px-2.5 outline-none focus:border-primary-100 focus:bg-amber-50 hover:border-primary-100 rounded-lg capitalize font-normal focus:placeholder:opacity-0 placeholder:normal-case"
							type="number"
							min="0"
							placeholder="Enter product stock"
							onChange={onChange}
							required
						/>
					</div>

					{/* Price */}
					<div className="_price font-semibold space-y-1.5 grid">
						<label htmlFor="price" className="pl-1 w-fit">
							Price:<span className="text-red-500"> *</span>
						</label>
						<input
							id="price"
							name="price"
							value={form.price}
							className="border border-neutral-200 bg-blue-50 p-1.5 px-2.5 outline-none focus:border-primary-100 focus:bg-amber-50 hover:border-primary-100 rounded-lg capitalize font-normal focus:placeholder:opacity-0 placeholder:normal-case"
							type="number"
							min="0"
							placeholder="Enter product price"
							onChange={onChange}
							required
						/>
					</div>

					{/* Discount */}
					<div className="_discount font-semibold space-y-1.5 grid">
						<label htmlFor="discount" className="pl-1 w-fit">
							Discount:
						</label>
						<input
							id="discount"
							name="discount"
							value={form.discount}
							className="border border-neutral-200 bg-blue-50 p-1.5 px-2.5 outline-none focus:border-primary-100 focus:bg-amber-50 hover:border-primary-100 rounded-lg capitalize font-normal focus:placeholder:opacity-0 placeholder:normal-case"
							type="number"
							placeholder="Enter discount"
							onChange={onChange}
						/>
					</div>

					{/* More details population */}
					{addMoreDetails[0] &&
						addMoreDetails.map((d, i, ar) => {
							const { id, name: detailsName, details } = d;

							return (
								<div
									key={id}
									className="_extraDetails font-semibold space-y-1.5 grid select-text"
								>
									<label
										htmlFor={`moreDetails_${detailsName}_${id}`}
										className="pl-1 w-fit"
									>
										{detailsName}:
									</label>
									<div className="flex w-full items-center gap-3">
										<input
											id={`moreDetails_${detailsName}_${id}`}
											name={`moreDetails_${detailsName}`}
											value={form.moreDetails[detailsName]}
											autoComplete="false"
											className="border border-neutral-200 bg-blue-50 p-1.5 px-2.5 outline-none focus:border-primary-100 focus:bg-amber-50 hover:border-primary-100 rounded-lg font-normal focus:placeholder:opacity-0 placeholder:normal-case grow"
											type="text"
											autoFocus={newDetailAdded ? i === ar.length - 1 && true : false}
											onChange={(e) => {
												setForm((prev) => {
													return {
														...prev,
														moreDetails: {
															...prev.moreDetails,
															[detailsName]: e.target.value,
														},
													};
												});
											}}
											onBlur={() => setNewDetailAdded(false)}
										/>
										<div
											title="Delete detail"
											className="_moreDetailsFieldDelete text-red-400 hover:text-red-600 cursor-pointer"
											onClick={(e) => {
												// delete field at i position
												setAddMoreDetails((prev) => {
													const newAr = [...prev];
													newAr.splice(i, 1);
													return newAr;
												});
												// delete this field from form
												setForm((prev) => {
													const { [detailsName]: _, ...rest } = prev.moreDetails;
													return {
														...prev,
														moreDetails: { ...rest },
													};
												});
											}}
										>
											<MdDeleteForever size="25" />
										</div>
									</div>
								</div>
							);
						})}

					{/* Published */}
					<div className="_discount font-semibold flex gap-4 w-fit">
						<label htmlFor="discount" className="pl-1 w-fit">
							Publish:
						</label>
						<input
							id="publish"
							name="published"
							checked={form.published}
							className="border border-neutral-200 bg-blue-50 p-1.5 px-2.5 outline-none focus:primary-200 focus:bg-amber-50 hover:border-primary-100 rounded-lg capitalize font-normal focus:placeholder:opacity-0 placeholder:normal-case"
							type="checkbox"
							onChange={onChange}
						/>
					</div>

					{/* Add more details pop up */}
					<div className="">
						<button
							type="button"
							className="_addMoreDetailsBtn cursor-pointer p-1 px-3 bg-blue-200 rounded-xl font-medium hover:bg-blue-500 hover:text-white text-neutral-600 active:bg-blue-600 oultine-none focus-visible:outline-amber-500"
							onClick={(e) => setOpenMoreDetails(true)}
						>
							Add more details
						</button>
					</div>
					{openMoreDetails && (
						<Suspense fallback={null}>
							<Popup close={() => setOpenMoreDetails(false)}>
								<>
									<div className="_more_details  space-y-1.5 grid m-4">
										<label
											htmlFor="enterName"
											className=" pl-1 text-neutral-600 font-semibold"
										>
											Add new field name:
										</label>
										<input
											ref={newDetailsTitleRef}
											id="enterName"
											name="enterName"
											className="border border-green-200 bg-green-50 p-1.5 px-2.5 mb-3 outline-none focus:border-primary-100 focus:bg-gray-50 hover:border-primary-100 rounded-lg font-medium focus:placeholder:opacity-0 placeholder:normal-case text-neutral-600"
											type="text"
											onSubmit={(e) => handleAddMoreDetails(e)}
											autoFocus
											maxLength="40"
										/>
										<button
											type="button"
											className="_addMoreDetailsBtn block  cursor-pointer p-1 px-3 bg-primary-100 rounded-xl font-medium hover:bg-amber-300  text-neutral-600 active:outline-1 active:shadow-sm active:scale-95 outline-none shadow-md"
											onClick={(e) => {
												handleAddMoreDetails(e);
												setNewDetailAdded(true);
											}}
										>
											Add
										</button>
									</div>
								</>
							</Popup>
						</Suspense>
					)}

					{/* Submit form */}
					<div className="_submitBtn">
						<button
							ref={formSubmitBtn}
							type="submit"
							title={disabled && "All fields marked with * are required!"}
							onMouseOver={(e) => {
								setDisabled(e.currentTarget.disabled);
							}}
							className={
								"_formSubmitBtn border border-green-500 enabled:hover:bg-green-500 cursor-pointer font-semibold hover:text-white enabled:hover:shadow disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed disabled:border-neutral-200 p-2 rounded-lg font flex justify-center mx-auto my-3 mt-6 min-w-35 text-center oultine-none focus-visible:outline-amber-500 " +
								(uploading ? "bg-green-500 text-shadow-xs text-white" : "bg-green-100")
							}
							disabled={isDisabled()}
						>
							{!uploading ? "Update Product" : <AnimatingDots text={"Updating"} />}
						</button>
					</div>
					{disabled && (
						<p className="text-red-600 text-xs absolute bottom-20 left-4 text-shadow-xs">
							*All fields marked with * are required.
						</p>
					)}
				</form>
			</div>
		</section>
	);
};

export default EditProduct;
