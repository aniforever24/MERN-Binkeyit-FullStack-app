import React, { memo, useEffect, useReducer } from "react";
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubCategories } from "../redux/category/categorySlice";

const DataTable = ({ data, columns, pagination, setPagination, sort, allDataCount }) => {
	// const rerender = useReducer(() => ({}), {})[1];
	const dispatch = useDispatch();
	const lastRef = useRef(null);

	const newObserver = (el, page, limit) => {
		// console.log("data length from table: ",data.length)
		const total = allDataCount;
		const newObserver = new IntersectionObserver(
			([entry], observer) => {
				if (entry.isIntersecting) {
					dispatch(
						fetchSubCategories({
							page,
							limit,
							sort: sort.flag ? (!sort.sortUp ? { name: -1 } : { name: 1 }) : { createdAt: -1 },
						})
					)
					observer.unobserve(el);
					if (limit <= total) {
						setPagination((prev) => {
							return {
								...prev,
								limit: limit + 10,
							};
						});
					} else {
						setPagination((prev) => {
							return {
								...prev,
								limit: limit + (total % limit),
							};
						});
					}
				}
			},
			{
				// threshold: 1,
				rootMargin: "140px 0px",
			}
		);
		newObserver.observe(el);
		return newObserver;
	};
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});
	useEffect(() => {
		let observer;
		if (data[0] && data.length < allDataCount) {
			observer = newObserver(lastRef.current, pagination.page, pagination.limit);
		}
	 return ()=> {
		if(observer) observer.disconnect();
	 }
	}, [data]);
	return (
		<div className="sm:p-2">
			<table className="w-full border border-collapse border-neutral-200 max-sm:text-xs">
				<thead className="bg-black text-white w-full">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id} className="">
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									className="border border-white sm:px-2"
									style={{ width: header.getSize() }}
								>
									{header.isPlaceholder
										? null
										: flexRender(header.column.columnDef.header, header.getContext())}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row, i, a) => {
						return (
							<tr key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<td
										key={cell.id}
										style={{ width: cell.column.getSize() }}
										className="sm:px-4 px-1 py-1 pb-3 border border-neutral-200 bg-white"
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						);
					})}
				</tbody>
				<tfoot>
					{table.getFooterGroups().map((footerGroup) => (
						<tr key={footerGroup.id}>
							{footerGroup.headers.map((header) => (
								<th key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(header.column.columnDef.footer, header.getContext())}
								</th>
							))}
						</tr>
					))}
				</tfoot>
			</table>
			<div ref={lastRef} className="h-4" />
		</div>
	);
};

export default memo(DataTable)
