import React, { useEffect, useState, createContext } from "react";
import { createPortal } from "react-dom";
import { RxCross2 } from "react-icons/rx";
import { motion } from "motion/react";

// Create this context to make all the props available to Popup component
// to its children 
export const PopupContext = createContext(()=> {});

const Popup = ({ children, close }) => {
	const handleClose = (e) => {
		close();
	};

	function handleKeydown(e) {
		if (e.key === "Escape") {
			close();
		}
	}

	useEffect(() => {
		window.addEventListener("keydown", handleKeydown);
		return () => {
			window.removeEventListener("keydown", handleKeydown);
		};
	}, []);

	return createPortal(
		<PopupContext value={{close} }>
			<div className="_popup fixed w-full h-full top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-neutral-700/75 select-none z-50">
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{
						opacity: 1,
						y: 0,
						transition: {
							opacity: { duration: 0.5 },
							y: { type: "tween", ease: "easeOut", duration: 0.25 },
						},
					}}
					exit={{ 
						opacity: 0, 
						y: 50 ,
						transition: {
							opacity: { duration: 0.20 },
							y: { type: "tween", ease: "easeOut", duration: 0.25 }
						}
					}}
					className=" bg-white sm:min-w-[500px] min-w-[95%]  relative rounded-xl m-2"
				>
					{children}
					<RxCross2
						onClick={handleClose}
						className="absolute -top-2 -right-2 font-semibold bg-black text-white hover:bg-red-500 cursor-pointer rounded-2xl p-1 z-50"
						size={32}
					/>
				</motion.div>
			</div>
		</PopupContext>,
		document.body
	);
};

export default Popup;
