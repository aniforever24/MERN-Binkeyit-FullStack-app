import React from "react";

const Button = ({ title, handleClick, customClass }) => {
	return (
		<button
			type="button"
			className="border px-2 rounded cursor-pointer bg-amber-100 hover:bg-amber-300 hover:border-amber-400 border-amber-200"
			onClick={handleClick}
            style={customClass}
		>
			{title}
		</button>
	);
};

export default Button;
