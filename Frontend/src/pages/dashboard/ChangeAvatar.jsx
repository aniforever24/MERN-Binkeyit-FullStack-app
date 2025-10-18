import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "../../components/modal";
import axiosErrorMsg from "../../utils/axiosError";
import authAxiosInstance from "../../config/authAxiosConfig";
import SummaryApi from "../../Common/SummaryApi";
import { setUserDetails } from "../../redux/user/userSlice";
import AnimatingDots from "../../components/AnimatingDots";
import { notifyError } from "../../utils/foxToast";

const ChangeAvatar = () => {
	const user = useSelector((state) => state.user.userDetails);
	const dispatch = useDispatch();

	const [avatarFile, setAvatarFile] = useState(null);
	const [preview, setPreview] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [uploading, setUploading] = useState(false);
	const handleClick = (e) => {
		setShowModal(!showModal);
	};

	const handleChange = (e) => {
		const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
		const selectedAvatar = e.target.files[0];

		if (!allowedFormats.includes(selectedAvatar?.type))
			return notifyError("Only png, jpeg or jpg image formats are allowed!");

		setAvatarFile(selectedAvatar);

		const preview = URL.createObjectURL(selectedAvatar);
		setPreview(preview);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (uploading) return; // if still uploading stop any user ineraction

		setUploading(true);
		const formData = new FormData();
		formData.append("avatar", avatarFile);
		// console.log(avatarFile);
		try {
			const { data: responseData } = await authAxiosInstance({
				...SummaryApi.upload_avatar,
				data: formData,
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			const avatarURL = responseData?.data?.url;
			
			dispatch(
				setUserDetails({ ...user, ...(avatarURL && { avatar: avatarURL }) })
			);
		} catch (error) {
			axiosErrorMsg(error);
		} finally {
			setUploading(false);
		}
	};

	return (
		<>
			{user && (
				<div className="flex flex-col justify-center items-center gap-2 sm:w-fit w-full max-sm:h-full">
					<div className="w-[140px] h-[140px] overflow-hidden rounded-full">
						<img
							className="object-cover w-full h-full"
							src={user?.avatar}
							width="120"
							alt={user?.name.split(" ")[0]}
						/>
					</div>
					<button
						className="bg-amber-100 font-semibold cursor-pointer rounded-xl p-1 px-2 hover:bg-amber-500 text-amber-600 hover:text-white border-amber-600 border"
						onClick={handleClick}
					>
						Edit Avatar
					</button>
				</div>
			)}
			{showModal && (
				<Modal
					setShowModal={setShowModal}
					setPreview={setPreview}
					avatarFile={avatarFile}
					setAvatarFile={setAvatarFile}
					setUploading={setUploading}
				>
					<div className="">
						<div className="flex flex-col justify-start items-center w-fit h-full p-1 gap-4">
							<div className="w-[140px] h-[140px] overflow-hidden rounded-full">
								<img
									className="object-cover w-full h-full"
									src={preview ? preview : user?.avatar}
									alt={user?.name}
								/>
							</div>
							<form
								onSubmit={handleSubmit}
								className="w-fit  text-center flex justify-center items-center gap-2  mb-2"
								enctype="multipart/form-data"
							>
								{!uploading && (
									<div className="border p-1 px-2 border-amber-400 hover:bg-amber-200 rounded-2xl">
										<label className="cursor-pointer" htmlFor="avatar">
											Choose
										</label>
									</div>
								)}
								{preview && (
									<button className="cursor-pointer border p-1 px-2 border-amber-400 hover:bg-amber-200 rounded-2xl">
										{uploading ? (
											<div className="w-25">
												{" "}
												<AnimatingDots text={"Uploading"} />{" "}
											</div>
										) : (
											"Upload"
										)}
									</button>
								)}
								<input
									className="hidden"
									type="file"
									name="avatar"
									id="avatar"
									onChange={handleChange}
									accept="image/png, image/jpeg, image/jpg"
								/>
							</form>
						</div>
					</div>
				</Modal>
			)}
		</>
	);
};

export default ChangeAvatar;
