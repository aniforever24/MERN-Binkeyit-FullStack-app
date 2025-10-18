// Layout of my this website

import React, { useContext, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router";
import { ToastContainer } from "react-fox-toast";
import RefreshHandler from "../components/RefreshHandler";
import { GlobalProvider } from "../context/GlobalProvider";

const root = () => {
	
	return (
		<GlobalProvider>
			<ToastContainer />
			<Header />
			<main className="min-h-[81.5vh] py-2 max-sm:pt-1 px-3 border border-neutral-200 shadow-lg bg-slate-200">
				<Outlet />
			</main>
			<RefreshHandler />
			<Footer />
		</GlobalProvider>
	);
};

export default root;
