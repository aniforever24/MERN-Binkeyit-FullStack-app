import { replace, useLocation, useNavigate, useRouteError } from "react-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "../context/context";

const ErrorPage = () => {
	const navigate = useNavigate();
	const { error: _error, setError } = useContext(GlobalContext);

	const timeoutRef = useRef(0);

	let error;
	if (_error) {
		error = _error;
	} else {
		error = useRouteError();
	}
	console.log("error from ErrorPage:", error);

	useEffect(() => {
		if (Object.keys(error)[0]) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(() => {
				navigate(0, { replace: true });
			}, 5000);
		} else {
			clearTimeout(timeoutRef.current);
		}
		return () => {
			clearTimeout(timeoutRef.current);
		};
	}, [error]);

	// debugger;
	return (
		<div className="mx-auto text-center my-[40vh] space-y-4">
			<h1 className="text-4xl font-semibold">Oops!</h1>
			<p className="text-2xl font-semibold">
				Sorry, an unexpected error has occured
			</p>
			<p>
				<em>{error?.statusText || error?.message}</em>
			</p>
		</div>
	);
};

export default ErrorPage;
