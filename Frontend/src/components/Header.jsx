import React, { lazy, useContext, useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import logo from "../assets/img/logo.png";
import { BsCart4 } from "react-icons/bs";
import "../index.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useMobile from "../hooks/useMobile";
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import MyAccountMenu from "./MyAccountMenu";
import SearchMain from "./SearchMain";
import { debounce, formatCurrency } from "../utils/UtilityFunctions";
import { twMerge } from "tailwind-merge";
import { GlobalContext } from "../context/context";
import { notifyWarning } from "../utils/foxToast";
// import Sidebar from "./Sidebar";
const Sidebar = lazy(() => import("./Sidebar"));

const Header = () => {
	const [lgBreakpoint] = useMobile(1024);
	const [mdBreakpoint] = useMobile();
	const location = useLocation();
	const dispatch = useDispatch();
	const { error, isUserLoggedIn } = useContext(GlobalContext);

	const user = useSelector((state) => state.user.userDetails);
	const totalCartItems = useSelector((state) => state.cart.totalItems);
	const totalCartValue = useSelector((state) => state.cart.totalValue);
	const cartItems = useSelector((state) => state.cart.cartItems);
	const [openSidebar, setOpenSidebar] = useState(false);

	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [search, setSearch] = useState(false);
	const [searchText, setSearchText] = useState("");

	const menuRef = useRef(null);
	const navigate = useNavigate();
	const delayNavigate = debounce(navigate, 2000);

	// Event listeners
	const handleClick = (e) => {
		setIsMenuOpen(!isMenuOpen);
	};
	const handleClickOpenSidebar = () => {
		if (!isUserLoggedIn) {
			notifyWarning("You must login to view your Cart");
			delayNavigate("/login");
		} else {
			setOpenSidebar(true);
		}
	};

	useEffect(() => {
		if (lgBreakpoint) setIsMenuOpen(false);
		// console.log("lgBreakpoint:", lgBreakpoint);
	}, [lgBreakpoint]);

	useEffect(() => {
		setIsMenuOpen(false);
	}, [location.pathname]);

	useEffect(() => {
		if (isMenuOpen) {
			menuRef.current.focus();
		}
	}, [isMenuOpen]);

	useEffect(() => {
		const i = location.pathname.lastIndexOf("/");
		if (location.pathname.slice(i) === "/search") {
			setSearch(true);
		} else setSearch(false);
	}, [location.pathname]);

	if (Object.keys(error)[0]) {
		return null;
	}

	return (
		<header className="select-none shadow-md border-0.5 border-neutral-300 xl:px-20 sm:px-6 px-4 py-2 md:min-h-25 flex flex-col justify-center sticky top-0 z-20 bg-white">
			<div className="container max-w-[110rem] mx-auto flex justify-between items-center">
				{/* Logo */}
				<div
					className={twMerge(
						"min-w-36 pl-5 sm:pl-[4rem]",
						search && mdBreakpoint && "hidden",
						!mdBreakpoint ? "w-[300px]" : "max-sm:w-[130px] w-[300px]"
					)}
				>
					<Link to={"/home"} className="">
						<img
							src={logo}
							alt="logo"
							// width={!lgBreakpoint ? 250 : 130}
							className="cursor-pointer"
						/>
					</Link>
				</div>

				{/* SearchBar */}
				<div className="w-full max-w-2xl justify-center hidden md:flex mx-4">
					{!search ? (
						<SearchBar setSearch={setSearch} />
					) : (
						<SearchMain
							setSearch={setSearch}
							searchTextState={[searchText, setSearchText]}
						/>
					)}
				</div>

				{/* User login and My cart */}
				<div
					className={
						"flex items-center lg:gap-4 gap-2.5" +
						" " +
						(search && mdBreakpoint && "hidden")
					}
				>
					{!lgBreakpoint ? (
						<>
							<div className="relative">
								{!user ? (
									<Link to={"/login"} className="cursor-pointer">
										Login
									</Link>
								) : (
									<>
										<div className="relative">
											<div className="flex items-center justify-center gap-2">
												<Link
													to={"/user/dashboard/profile"}
													className="cursor-pointer hover:text-amber-500 sm:text-lg"
												>
													Account
												</Link>
												{!isMenuOpen ? (
													<FaCaretUp
														onClick={handleClick}
														// onMouseOver={handleClick}
														size={25}
														className="cursor-pointer hover:text-green-700"
													/>
												) : (
													<FaCaretDown
														onClick={handleClick}
														size={25}
														className="cursor-pointer hover:text-green-700"
													/>
												)}
											</div>
										</div>
									</>
								)}
								<div
									ref={menuRef}
									hidden={!isMenuOpen}
									tabIndex={-1}
									className="border border-amber-300 bg-white shadow rounded-lg absolute top-8 right-1 py-2 px-2 min-w-40 focus:outline-none"
									onBlur={(e) => {
										if (!e.relatedTarget) {
											setIsMenuOpen(false);
										}
									}}
								>
									<MyAccountMenu />
								</div>
							</div>

							<div
								className={twMerge(
									"group flex gap-2 cursor-pointer items-center text-white text-sm bg-secondary-100 hover:bg-secondary-200 p-2.5 px-3 rounded-lg",
									cartItems[0] && "shadow-[0_6px_10px_rgba(0,0,0,0.3)]"
								)}
								onClick={() => handleClickOpenSidebar()}
							>
								<BsCart4
									size={25}
									className={twMerge(
										"animate-none group-hover:animate-none",
										cartItems[0] && "animate-bounce"
									)}
								/>
								{!cartItems[0] ? (
									<span className="text-nowrap">My Cart</span>
								) : (
									<div className="flex flex-col">
										<span className="text-center text-[15px] text-shadow-white relative -top-1 normal-case">
											{totalCartItems} items
										</span>
										<span className="text-center text-[15px] text-shadow-white font-nunito relative -bottom-1">
											{formatCurrency(totalCartValue, true)}
										</span>
									</div>
								)}
							</div>
						</>
					) : (
						<>
							<div
								className=" bg-secondary-100 flex items-center justify-center rounded-full p-2 relative"
								onClick={() => handleClickOpenSidebar()}
							>
								<BsCart4
									size={!mdBreakpoint ? 25 : 20}
									className="cursor-pointer text-white"
								/>
								{cartItems[0] && <div className="bg-red-500/90 text-white font-semibold text-shadow-sm absolute -right-1 -top-3 w-6 h-6 rounded-full flex items-center text-xs sm:text-sm font-sans justify-center overflow-hidden">
									{totalCartItems}
								</div>}
							</div>
							<div className="relative">
								<CgProfile
									size={!mdBreakpoint ? 32 : 30}
									className="cursor-pointer"
									onClick={(e) => {
										if (mdBreakpoint) {
											return navigate("/user/menu");
										}
										navigate("/user/dashboard/profile");
									}}
								/>
								<div
									ref={menuRef}
									hidden={!isMenuOpen}
									tabIndex={-1}
									className="border border-amber-300 bg-white/30 shadow rounded-lg absolute top-8 right-1 py-2 px-2 w-36 focus:outline-none"
									onBlur={(e) => {
										if (!e.relatedTarget) {
											setIsMenuOpen(false);
										}
									}}
								>
									<MyAccountMenu />
								</div>
							</div>
						</>
					)}
					<Sidebar close={[openSidebar, setOpenSidebar]} />
				</div>
			</div>
			{/* Searchbar in mobile */}
			<div className="w-full flex md:hidden justify-center max-md:px-1 py-1.5">
				{!search ? (
					<SearchBar setSearch={setSearch} />
				) : (
					<SearchMain
						setSearch={setSearch}
						searchTextState={[searchText, setSearchText]}
					/>
				)}
			</div>
		</header>
	);
};

export default Header;
