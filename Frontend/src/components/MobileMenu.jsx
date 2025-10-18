import React from "react";
import Divider from "./Divider";
import { Navigate, Outlet, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import authAxiosInstance from "../config/authAxiosConfig";
import SummaryApi from "../Common/SummaryApi";
import axiosErrorMsg from "../utils/axiosError";
import { notifySuccess } from "../utils/foxToast";
import { setUserDetails } from "../redux/user/userSlice";

const MobileMenu = () => {
	const user = useSelector((state) => state.user.userDetails);
	const dispatch = useDispatch();
	const navigate = useNavigate();

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
		navigate("/home");
	};

	return (
		<>
			<div className="container mx-auto grid text-neutral-600">
				<div className=" pb-7 bg-neutral-100 select-none">
					<h2 className="font-bold sm:text-3xl text-2xl sm:mb-2 mb-0 px-4 py-3 bg-neutral-200 ">
						My Account
					</h2>
					{user && (
						<h3 className="sm:text-xl text-lg font-semibold px-4">{user?.name}</h3>
					)}
					<div className="sm:mb-2 mb-1">
						<Divider />
					</div>

					{/* Sub Menu */}
					<div className="_menu max-sm:p-2 gap-y-2 grid font-semibold text-lg">
						<div className="pl-10 sm:pr-4 group hover:bg-amber-50 sm:mb-2">
							<Link to="/user/dashboard/categories">Category</Link>
						</div>

						<div className="pl-10 sm:pr-4 group hover:bg-amber-50 sm:mb-2">
							<Link to="/user/dashboard/sub-categories">Sub Category</Link>
						</div>
						<div className="pl-10 sm:pr-4 group hover:bg-amber-50 sm:mb-2">
							<Link to="/user/dashboard/upload-products">Upload Product</Link>
						</div>
						<div className="pl-10 sm:pr-4 group hover:bg-amber-50 sm:mb-2">
							<Link to="/user/dashboard/products">My Products</Link>
						</div>

						<div className="pl-10 sm:pr-4 group hover:bg-amber-50 sm:mb-2">
							<Link to="/user/dashboard/profile">My Profile</Link>
						</div>

						<div className="pl-10 sm:pr-4 group hover:bg-amber-50 sm:mb-2">
							<Link to="/user/dashboard/change-avatar">Change Avatar</Link>
						</div>

						<div className="pl-10 sm:pr-4 group hover:bg-amber-50 sm:mb-2">
							<Link to="/user/dashboard/edit-details">Edit Details</Link>
						</div>

						<div className="pl-10 sm:pr-4 group hover:bg-amber-50 sm:mb-2">
							<Link to="/user/dashboard/Menu4">My Orders</Link>
						</div>

						<div className="pl-10 sm:pr-4 group bg-red-50 hover:bg-red-100 sm:h-9 flex flex-col justify-end sm:mb-2 max-sm:justify-center">
							<Link
								className="cursor-pointer group-hover:text-red-600 w-fit hover:font-bold text-red-500"
								onClick={handleLogout}
							>
								Logout
							</Link>
							{/* <Divider twStyle={"group-hover:bg-amber-600"} /> */}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default MobileMenu;
