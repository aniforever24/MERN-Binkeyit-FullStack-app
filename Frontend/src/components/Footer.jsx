import React, { useContext, useEffect, useState } from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { GlobalContext } from "../context/context";

const Footer = () => {
	const { error } = useContext(GlobalContext);

	const [currentYear, setCurrentYear] = useState(2025);

	useEffect(() => {
		const d = new Date();
		setCurrentYear(() => d.getFullYear());
	}, [currentYear]);

	if (Object.keys(error)[0]) {
			return null;
		}

	return (
		<footer className="sm:p-6 p-3 bg-blue-100 w-full z-20">
			<div className="container mx-auto flex sm:justify-between max-sm:flex-col max-sm:items-center max-sm:justify-center gap-2 max-sm:py-1">
				<p className="text-sm text-gray-500">
					&copy; All Rights reserved {currentYear}
				</p>
				<div className="flex gap-3">
					<FaFacebook
						size={20}
						className="cursor-pointer hover:text-blue-600 hover:shadow-blue-200"
					/>
					<FaInstagram size={20} className="cursor-pointer hover:text-pink-600" />
					<FaLinkedin size={20} className="cursor-pointer hover:text-sky-600" />
				</div>
			</div>
		</footer>
	);
};

export default Footer;
