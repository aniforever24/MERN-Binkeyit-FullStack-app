import { useEffect, useState } from "react";
import { GlobalContext } from "./context";

export const GlobalProvider = ({ children }) => {
	const [error, setError] = useState({});
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);

	useEffect(()=> {
		const token = localStorage.getItem('accessToken') || localStorage.getItem('refreshToken')
		if(token) {
			setIsUserLoggedIn(true)
		} else {
			setIsUserLoggedIn(false)
		}
	}, [])

	return (
		<>
			<GlobalContext.Provider
				value={{ error, setError, isUserLoggedIn, setIsUserLoggedIn }}
			>
				{children}
			</GlobalContext.Provider>
		</>
	);
};
