import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxOpenInNewWindow } from "react-icons/rx";
import Divider from "./Divider";
import { Link, useNavigate } from "react-router-dom";
import authAxiosInstance from "../config/authAxiosConfig";
import SummaryApi from "../Common/SummaryApi";
import axiosErrorMsg from "../utils/axiosError";
import { setUserDetails } from "../redux/user/userSlice";
import { notifySuccess } from "../utils/foxToast";
import { resetCart } from "../redux/cart/cartSlice";
import { GlobalContext } from "../context/context";

const MyAccountMenu = () => {
	const user = useSelector((state) => state.user.userDetails);
	const { setIsUserLoggedIn } = useContext(GlobalContext)
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isAdmin, setIsAdmin] = useState(false);

	const handleLogout = async (e) => {
		let response;
		try {
			response = await authAxiosInstance({
				...SummaryApi.logout,
			});
		} catch (error) {
			axiosErrorMsg(error);
		}

		if (response.status == 200) {
			notifySuccess("You have been successfully logged out");
		}

		localStorage.clear("accessToken");
		localStorage.clear("refreshToken");
		dispatch(setUserDetails(null));
		dispatch(resetCart())
		setIsUserLoggedIn(false)
		navigate("/home");
	};

	useEffect(() => {
		if (user && user.role === "ADMIN") {
			setIsAdmin(true);
		} else setIsAdmin(false);
	}, [user]);

	return (
		<div>
			<div className="text-sm">
				<div className="font-semibold text-[1rem]">My Account</div>
				<div className="flex items-center gap-2 cursor-pointer pt-1">
					<Link
						to="/user/dashboard/profile"
						className="hover:text-amber-500 cursor-pointer active:text-green-700 text-base"
					>
						{user && user.name.split(" ")[0]}
					</Link>

					<Link to="/user/dashboard/profile" target="_blank">
						<RxOpenInNewWindow
							className="hover:text-amber-600 cursor-pointer active:text-green-700"
							size={18}
						/>
					</Link>
				</div>
				{user && isAdmin &&  (
					<span className="capitalize font-semibold text-red-600">
						({user.role.toLowerCase()})
					</span>
				)}
				<div className="my-1">
					<Divider />
				</div>
				<div className="grid gap-y-1.5">

					{isAdmin && (
						<>
							<Link
								to="/user/dashboard/categories"
								className="hover:text-amber-600 cursor-pointer active:text-green-700"
							>
								Category
							</Link>
							<Link
								to="/user/dashboard/sub-categories"
								className="hover:text-amber-600 cursor-pointer active:text-green-700"
							>
								Sub Category
							</Link>
							<Link
								to="/user/dashboard/upload-products"
								className="hover:text-amber-600 cursor-pointer active:text-green-700"
							>
								Upload Product
							</Link>
						</>
					)}

					<Link
						to="/user/dashboard/products"
						className="hover:text-amber-600 cursor-pointer active:text-green-700"
					>
						My Products
					</Link>
					<Link
						to="/user/dashboard/profile"
						className="hover:text-amber-600 cursor-pointer active:text-green-700"
					>
						My Profile
					</Link>
					<Link
						to="/user/dashboard/my-cart"
						className="hover:text-amber-600 cursor-pointer active:text-green-700"
					>
						My Cart
					</Link>
					<Link
						onClick={handleLogout}
						className="text-center hover:bg-red-500 hover:text-white hover:drop-shadow-md cursor-pointer active:text-green-700 text-red-600"
					>
						Logout
					</Link>
				</div>
			</div>
		</div>
	);
};

export default MyAccountMenu;
