import React from "react";

const Divider = ({ colorBg, twStyle }) => {
  if(!colorBg) colorBg = "bg-neutral-500/30"
  const tailwindStyle = "h-[0.1px]" + " " + colorBg + " " + twStyle;

	return <div className={tailwindStyle}></div>;
};

export default Divider;
