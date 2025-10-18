import React, { useState } from "react";

const Layout = ({ children }) => {
	return (
		<div className="container mx-auto grid max-sm:grid-flow-dense md:grid-cols-[240px_1fr] lg:grid-cols-[320px_1fr] grid-cols-[1fr] text-neutral-600">
			{children}
		</div>
	);
};

export default Layout;
