import React, { useEffect, useState } from "react";

const AnimatingDots = ({ text, int }) => {
	const [dots, setDots] = useState("");

	useEffect(() => {
		const i = setInterval(
			() => {
				setDots((prev) => (prev.length < 3 ? prev + "." : ""));
			},
			int ? int : 400
		);

		return () => {
			clearInterval(i);
		};
	}, []);

	return (
		<div className="pl-1 flex justify-start gap-0.5">
			<span>{text}</span>
			<span className="w-4 text-start">{dots}</span>
		</div>
	);
};

export default AnimatingDots;
