import React, { useState } from "react";
import { motion } from "motion/react";

const PreviewImage = ({
	close,
	previewImg,		// An object with name and url property
}) => {
	const [previewContainer, setPreviewContainer] = useState(null)

	return (
		<div
			ref={(el) => {
				setPreviewContainer(el);
			}}
			tabIndex={-1}
			onBlur={close}
			className=" flex justify-center items-center bg-neutral-700 p-4 border border-gray-400 shadow-lg rounded-xl w-full h-[95vh] relative overflow-hidden"
		>
			<motion.img
				initial={{ opacity: 0 }}
				animate={{
					opacity: 1,
					// rotate: 360,
					transition: {
						opacity: { duration: 0.5 },
					},
				}}
				className="w-full h-full object-contain text-white"
				src={previewImg.url}
				alt={previewImg.name}
			/>
			{previewContainer && previewContainer.focus()}
		</div>
	);
};

export default PreviewImage;
