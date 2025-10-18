import React, { useEffect, useState, memo } from "react";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { twMerge } from "tailwind-merge";
import useMobile from "../hooks/useMobile";

const CartDataTable = ({ data, columns }) => {
	const [tableData, setTableData] = useState([]);
	const [mdWidth] = useMobile()

	const table = useReactTable({
		data,
		columns,
		columnResizeMode: "onChange",
		getCoreRowModel: getCoreRowModel(),
	});

	useEffect(() => {
		if (data.length) {
			setTableData([...data]);
			// console.log("data:", data);
		}
	}, [data]);
	useEffect(()=> {
		console.log(mdWidth)
	}, [mdWidth])
	return !tableData[0] ? null : (
		<div className={twMerge("p-2 max-w-[67vw] md:max-w-none max-h-[50vh] md:max-h-auto overflow-auto md:overflow-x-visible", mdWidth ? "scrollbar-hidden" : "scrollbar-narrow")}>
			<table className="md:w-full md:overflow-auto min-w-[550px]">
				<thead className="text-left uppercase text-gray-400 sticky -top-2 nd:top-0 backdrop-blur-xl z-8">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id} className="">
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									className="align-top pb-2.5 max-md:text-sm"
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
				<tbody className="text-gray-700 ">
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id} className="">
							{row.getVisibleCells().map((cell) => (
								<td
									key={cell.id}
									className="align-top pt-3"
									style={{ width: cell.column.getSize() }}
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
				{/* <tfoot>
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
				</tfoot> */}
			</table>
			<div className="h-4" />
		</div>
	);

	return null;
};

export default memo(CartDataTable);
