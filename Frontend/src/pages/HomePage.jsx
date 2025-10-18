import React from "react";
import { Outlet } from "react-router";
import { setPageTitle } from "../utils/UtilityFunctions";

const HomePage = () => {
	setPageTitle('Binkeyit! | Home page')
	return (
		<>
			<Outlet />
		</>
	);
};

export default HomePage;
