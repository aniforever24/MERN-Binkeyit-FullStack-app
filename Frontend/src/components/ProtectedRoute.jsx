import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }) => {
	const accessToken = localStorage.getItem("accessToken");

	if (!accessToken) {
		return <Navigate to={"/login"} replace={true} />;
	} else return children;
};

export default ProtectedRoute;
