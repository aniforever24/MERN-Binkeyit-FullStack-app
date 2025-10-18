import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const AdminRoute = ({ children }) => {
	const user = useSelector((state) => state.user.userDetails);
	const [wait, setWait] = useState(true);
	const iRef = useRef(null)

	useEffect(() => {
		iRef.current = setTimeout(setWait, 150, false)
		return ()=> {
			if(iRef.current) {
				clearTimeout(iRef.current)
				iRef.current = null;
			}
		}
	}, []);

	if(wait) return null
	else if(user && user.role === "ADMIN") return children;
	else return <p className="bg-red-100 text-red-400 p-4 font-semibold text-xl">Permission Denied!</p>;	
	
};
export default AdminRoute;
