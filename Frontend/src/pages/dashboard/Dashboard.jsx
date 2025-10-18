import React, { useContext, useEffect, useState } from "react";
import Divider from "../../components/Divider";
import { Navigate, Outlet, useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import authAxiosInstance from "../../config/authAxiosConfig";
import SummaryApi from "../../Common/SummaryApi";
import axiosErrorMsg from "../../utils/axiosError";
import { notifySuccess } from "../../utils/foxToast";
import { setUserDetails } from "../../redux/user/userSlice";
import Layout from "../../components/Layout";
import { resetCart } from "../../redux/cart/cartSlice";
import { GlobalContext } from "../../context/context";

const Dashboard = () => {
	const user = useSelector((state) => state.user.userDetails);
	const {setIsUserLoggedIn} = useContext(GlobalContext)
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [ifActive, setIfActive] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const active = "text-amber-600 font-bold w-fit";
	const activeClass = ({ isActive, isPending }) => {
		setIfActive(isActive);
		return isActive
			? `${active}`
			: "cursor-pointer group-hover:text-amber-600 w-fit hover:font-bold";
	};

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
		<section className="_dashboard bg-white">
			<Layout>
				{/* Left Dashboard Options */}
				<div className="sticky pb-7 bg-neutral-100 select-none max-md:hidden top-26 max-h-[calc(100vh-230px)]">
					<h2 className="font-bold sm:text-2xl text-xl sm:mb-2 mb-0 px-4 py-3 bg-neutral-200">
						My Account
					</h2>
					{user && <h3 className="sm:text-lg  font-semibold px-4">{user?.name}</h3>}
					{isAdmin && (
						<span className="capitalize font-semibold px-4 text-red-600 relative -top-1">
							({user.role.toLowerCase()})
						</span>
					)}
					<div className="sm:mb-2 mb-1">
						<Divider />
					</div>

					{/* Sub Menu */}
					<div className="_menu max-sm:p-2 grid max-sm:grid-rows-2 max-sm:grid-flow-col font-semibold max-sm:text-xs max-sm:gap-x-3 max-sm:gap-y-1">
						{isAdmin && (
							<>
								<div className="sm:pl-10 sm:pr-4 group hover:bg-amber-50 sm:h-9 flex flex-col justify-end sm:mb-2 max-sm:justify-center">
									<NavLink to="/user/dashboard/categories" className={activeClass}>
										Category
									</NavLink>
								</div>

								<div className="sm:pl-10 sm:pr-4 group hover:bg-amber-50 sm:h-9 flex flex-col justify-end sm:mb-2 max-sm:justify-center">
									<NavLink to="/user/dashboard/sub-categories" className={activeClass}>
										Sub Category
									</NavLink>
								</div>

								<div className="sm:pl-10 sm:pr-4 group hover:bg-amber-50 sm:h-9 flex flex-col justify-end sm:mb-2 max-sm:justify-center">
									<NavLink to="/user/dashboard/upload-products" className={activeClass}>
										Upload Products
									</NavLink>
								</div>
								<div className="sm:pl-10 sm:pr-4 group hover:bg-amber-50 sm:h-9 flex flex-col justify-end sm:mb-2 max-sm:justify-center">
									<NavLink to="/user/dashboard/products" className={activeClass}>
										My Products
									</NavLink>
								</div>
							</>
						)}

						<div className="sm:pl-10 sm:pr-4 group hover:bg-amber-50 sm:h-9 flex flex-col justify-end sm:mb-2 max-sm:justify-center">
							<NavLink to="/user/dashboard/profile" className={activeClass}>
								My Profile
							</NavLink>
						</div>

						<div className="sm:pl-10 sm:pr-4 group hover:bg-amber-50 sm:h-9 flex flex-col justify-end sm:mb-2 max-sm:justify-center">
							<NavLink to="/user/dashboard/edit-details" className={activeClass}>
								Edit Details
							</NavLink>
						</div>
						<div className="sm:pl-10 sm:pr-4 group hover:bg-amber-50 sm:h-9 flex flex-col justify-end sm:mb-2 max-sm:justify-center">
							<NavLink to="/user/dashboard/orders" className={activeClass}>
								My Orders
							</NavLink>
						</div>

						<div className="sm:pl-10 sm:pr-4 group bg-red-50 hover:bg-red-100 sm:h-9 flex flex-col justify-end sm:mb-2 max-sm:justify-center">
							<NavLink
								className="cursor-pointer group-hover:text-red-600 w-fit hover:font-bold text-red-500"
								onClick={handleLogout}
							>
								Logout
							</NavLink>
						</div>
					</div>
				</div>

				{/* Right Dashboard */}
				<div className="bg-white max-sm:justify-center sm:min-h-[540px]  min-h-[70vh] w-full">
					<Outlet />
				</div>
			</Layout>
		</section>
	);
};

export default Dashboard;
