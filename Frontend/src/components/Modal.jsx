import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import {createPortal} from "react-dom"

const Modal = ({
	children,
	setShowModal,
	setPreview,
	avatarFile,
    setAvatarFile,
	setUploading,
}) => {
	const [close, setClose] = useState(false);
	
	const handleClose = (e) => {
        setShowModal(false);

		if(setPreview) setPreview(null);
		if (avatarFile) {
			// console.log(avatarFile)
			URL.revokeObjectURL(avatarFile);
		}
		if(setAvatarFile) setAvatarFile(null);
		if(setUploading) setUploading(false);
	};

	return createPortal(
		<div className="fixed w-full h-full top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-neutral-700/75 select-none z-9999">
			<div className="flex justify-center items-center bg-white sm:min-w-[500px] min-w-[95%] min-h-[300px] p-2 relative">
				{children}
				<RxCross2
					onClick={handleClose}
					className="absolute -top-2 -right-2 font-semibold bg-black text-white hover:bg-red-500 cursor-pointer rounded-2xl p-1"
					size={32}
				/>
			</div>
		</div>,
		document.body
	)
};

export default Modal;
