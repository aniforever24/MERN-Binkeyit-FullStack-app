import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchProducts,
	setProducts,
	setStatusIdle,
} from "../redux/products/productSlice";
import Product from "./Product";
import Spinner from "./Spinner";
import { createPortal } from "react-dom";
import { useLocation } from "react-router";

const InfiniteProducts = () => {
	const dispatch = useDispatch();
	const data = useSelector((state) => state.product.products);
	const status = useSelector((state) => state.product.status);
	const countAll = useSelector((state) => state.product.countAll);
	const productsSearchedStatus = useSelector(
		(state) => state.product.productsSearchedStatus
	);

	const [limit, setLimit] = useState(24);
	const [limitReached, setLimitReached] = useState(false);
	const [firstApiCallMade, setFirstApiCallMade] = useState(true);

	const lastElRef = useRef(null);
	const apiCallRef = useRef(null);

	const observerFn = (el) => {
		if (!el || status !== "success" || firstApiCallMade) return;

		const observer = new IntersectionObserver(
			([entry], observer) => {
				if (entry.isIntersecting) {
					const productsLeft = countAll - limit;
					apiCallRef.current = dispatch(fetchProducts({ limit }));
					// console.log("products left: ", productsLeft);
					// console.log('observer cb runs')
					if (productsLeft >= 12) {
						setLimit((prev) => (prev += 12));
					} else {
						setLimit((prev) => (prev += productsLeft));
					}
				}
			},
			{
				rootMargin: "200px 0px",
			}
		);
		observer.observe(el);

		return observer;
	};

	useEffect(() => {
		const apiCall = dispatch(
			fetchProducts({
				limit,
			})
		);
		apiCall.then((v) => setFirstApiCallMade(false));
		return () => {
			apiCall.abort();
			if (apiCallRef.current) {
				apiCallRef.current.abort();
			}
			dispatch(setProducts([]));
			setLimit(24);
			setLimitReached(false);
			sessionStorage.removeItem("infiniteProducts_limit");
		};
	}, []);
	useEffect(() => {
		// console.log("status:", status);
		// console.log("countAll: ", countAll);
	}, [status]);
	useEffect(() => {
		// console.log("data length & limit:", data.length, limit);
		let observer;
		if (lastElRef.current && !limitReached) {
			observer = observerFn(lastElRef.current);
			countAll === limit && setLimitReached(true);
		}
		return () => {
			if (lastElRef.current && observer) {
				observer.unobserve(lastElRef.current);
			}
		};
	}, [data]);
	useEffect(() => {
		sessionStorage.setItem("infiniteProducts_limit", limit);
		// console.log('limit Infinite:',limit)
	}, [limit]);

	return (
		<>
			{data[0] &&
				data.map((product, i) => {
					return <Product data={product} />;
				})}
			<div ref={lastElRef} className="h-1 self-end" />
		</>
	);
};

export default InfiniteProducts;
