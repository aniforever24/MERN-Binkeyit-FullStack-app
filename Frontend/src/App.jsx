import React, { useRef, lazy, Suspense } from "react";
import {
	createBrowserRouter,
	Navigate,
	RouterProvider,
} from "react-router-dom";
import Root from "./pages/Root";
const Home = lazy(() => import("./pages/Home"));
import ErrorPage from "./components/ErrorPage";
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/dashboard/Dashboard";
const Profile = lazy(() => import("./pages/dashboard/Profile"));
import ChangeAvatar from "./pages/dashboard/ChangeAvatar";
const EditUserDetails = lazy(() => import("./pages/dashboard/EditUserDetails"));
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import SearchPage from "./pages/SearchPage";
import ResetPassword from "./pages/ResetPassword";
import MobileMenu from "./components/MobileMenu";
const Categories = lazy(() => import("./pages/dashboard/Categories"));
const SubCategories = lazy(() => import("./pages/dashboard/SubCategories"));
const UploadProducts = lazy(() => import("./pages/dashboard/UploadProducts"));
const MyProducts = lazy(() => import("./pages/dashboard/MyProducts"));
const MyOrders = lazy(() => import("./pages/dashboard/MyOrders"));
const EditProduct = lazy(() => import("./components/EditProduct"));
import AdminRoute from "./components/AdminRoute";
import Loading from "./components/Loading";
import SubCategoryWiseProductsPage from "./pages/SubCategoryWiseProductsPage";
import HomePage from "./pages/HomePage";
import ProductDisplay from "./pages/ProductDisplay";
import SubCategoryWiseProducts from "./components/SubCategoryWiseProducts";
import OrderCancelled from "./components/OrderCancelled";
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const NewOrderSuccess = lazy(()=> import("./components/NewOrderSuccess"));
const NewOrderFailure = lazy(()=> import("./components/NewOrderFaiilure"));

const App = () => {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Root />,
			errorElement: <ErrorPage />,
			children: [
				{
					index: true,
					element: (
						<Suspense fallback={<Loading />}>
							<Home />
						</Suspense>
					),
				},
				{
					path: "/home",
					element: <HomePage />,
					children: [
						{
							index: true,
							element: (
								<Suspense fallback={<Loading />}>
									<Home />
								</Suspense>
							),
						},
					],
				},
				{
					path: "/error",
					element: <ErrorPage />,
				},
				{
					path: "/login",
					element: (
						<Suspense fallback={<Loading />}>
							<Login />
						</Suspense>
					),
				},
				{
					path: "/user/login",
					element: (
						<Suspense fallback={<Loading />}>
							<Login />
						</Suspense>
					),
				},
				{
					path: "/signup",
					element: (
						<Suspense fallback={<Loading />}>
							<Signup />
						</Suspense>
					),
				},
				{
					path: "/search",
					element: <SearchPage />,
				},
				{
					path: "/forgot-password",
					element: <ForgotPassword />,
				},
				{
					path: "/verify-otp/:userId",
					element: <VerifyOTP />,
				},
				{
					path: "/reset-password",
					element: <ResetPassword />,
				},
				{
					path: "/user/menu",
					element: <MobileMenu />,
				},
				{
					path: "/user/dashboard",
					element: (
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					),
					children: [
						{
							path: "",
							element: <Navigate to="profile" replace={true} />,
						},
						{
							path: "profile",
							element: (
								<Suspense fallback={<Loading />}>
									<Profile />
								</Suspense>
							),
						},
						{
							path: "change-avatar",
							element: <ChangeAvatar />,
						},
						{
							path: "edit-details",
							element: (
								<Suspense fallback={<Loading />}>
									<EditUserDetails />
								</Suspense>
							),
						},
						{
							path: "orders",
							element: (
								<Suspense fallback={<Loading />}>
									<MyOrders />
								</Suspense>
							),
						},
						{
							path: "categories",
							element: (
								<AdminRoute>
									<Suspense fallback={<Loading />}>
										<Categories />
									</Suspense>
								</AdminRoute>
							),
						},
						{
							path: "sub-categories",
							element: (
								<AdminRoute>
									<Suspense fallback={<Loading />}>
										<SubCategories />
									</Suspense>
								</AdminRoute>
							),
						},
						{
							path: "upload-products",
							element: (
								<AdminRoute>
									<Suspense fallback={<Loading />}>
										<UploadProducts />
									</Suspense>
								</AdminRoute>
							),
						},
						{
							path: "products",
							element: (
								<AdminRoute>
									<Suspense fallback={<Loading />}>
										<MyProducts />
									</Suspense>
								</AdminRoute>
							),
						},
						{
							path: "products/edit/:productId",
							element: (
								<Suspense fallback={<Loading />}>
									<EditProduct />
								</Suspense>
							),
						},
					],
				},
				{
					path: ":category",
					element: <SubCategoryWiseProductsPage />,
					children: [
						{
							path: ":subCategory",
							index: true,
							element: <SubCategoryWiseProducts />,
						},
					],
				},
				{
					path: "product/:productId",
					element: <ProductDisplay />,
				},
				{
					path: "cart",
					element: (
						<Suspense fallback={<Loading />}>
							<ProtectedRoute>
								<Cart />
							</ProtectedRoute>
						</Suspense>
					),
				},
				{
					path: "checkout",
					element: (
						<Suspense fallback={<Loading />}>
							<ProtectedRoute>
								<Checkout />
							</ProtectedRoute>
						</Suspense>
					),
				},
				{
					path: "new-order/success/:orderId",
					element: (
						<Suspense fallback={<Loading />}>
							<ProtectedRoute>
								<NewOrderSuccess />
							</ProtectedRoute>
						</Suspense>
					)
				},
				{
					path: "new-order/failure",
					element: (
						<Suspense fallback={<Loading />}>
							<ProtectedRoute>
								<NewOrderFailure />
							</ProtectedRoute>
						</Suspense>
					)
				},
				{
					path: "new-order/cancelled",
					element: (
						<Suspense fallback={<Loading />}>
							<ProtectedRoute>
								<OrderCancelled />
							</ProtectedRoute>
						</Suspense>
					)
				},
			],
		},
	]);
	return <RouterProvider router={router} />;
};

export default App;
