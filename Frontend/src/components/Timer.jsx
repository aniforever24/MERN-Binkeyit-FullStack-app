import React, { useEffect, useRef, useState } from "react";

const Timer = ({ min }) => {
	if (!min) min = 30;
	const [minutes, setMinutes] = useState(min);
	const [seconds, setSeconds] = useState(0);
	const [otpExpired, setOtpExpired] = useState(false);
	const iRef = useRef(null);
	// function to covert a number to two digit string
	const doubleDigit = (num) => String(num).padStart(2, "0");

	useEffect(() => {
		iRef.current = setInterval(() => {
			setSeconds((prev) => (prev === 0 ? 59 : prev - 1));
		}, 1000);

		return () => {
			clearInterval(iRef.current);
		};
	}, []);

	useEffect(() => {
		if (seconds === 59) {
			setMinutes((prev) => prev > 0 && prev - 1);
		}
	}, [seconds]);

	useEffect(() => {
		let interval;
		if (minutes === 0 && seconds === 0) {
			clearInterval(iRef.current);
			interval = setInterval(() => {
				setOtpExpired((prev) => !prev);
			}, 500);
		}
		return () => {
			clearInterval(interval);
		};
	}, [minutes, seconds]);

	return (
		<div
			className="px-0.5 py-0.5 flex gap-0.5 relative left-2"
			style={{
				backgroundColor: !otpExpired
					? minutes === 0 && seconds === 0 && "yellow"
					: "green",
				color: !otpExpired ? "black" : "white",
			}}
		>
			<span className="block min-w-9 font-semibold text-center">
				{doubleDigit(minutes)}
			</span>
			<span>:</span>
			<span className="block min-w-9 font-semibold text-center">
				{doubleDigit(seconds)}
			</span>
		</div>
	);
};

export default Timer;
