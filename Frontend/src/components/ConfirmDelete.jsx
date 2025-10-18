import React from "react";
import AnimatingDots from "./AnimatingDots";
import Spinner from "./Spinner";

const ConfirmDelete = ({ cancel, confirm, deleting, elName }) => {
	return (
		<>
			<div className="absolute top-0 bottom-0 left-0 right-0 w-full h-full bg-amber-50 rounded-xl"></div>

			<div className=" bg-radial from-red-100 from-10% to-red-400 absolute top-0 left-0 right-0 rounded-xl rounded-b-none w-full h-14"></div>

			<div className="max-w-md mx-auto pb-4 pt-2 px-4 grid gap-3 relative z-10">
				<h2 className="font-semibold text-lg text-center mb-3">
					Permanantly Delete
				</h2>
				<p className="text-justify">
					Are you sure you want to delete this {elName} permanently ? This cannot be
					undone!
				</p>
				{!deleting ? (
					<div className="_buttons flex gap-2.5 justify-end my-2">
						<button
							onClick={cancel}
							className="px-2 py-1 rounded-lg w-20 text-center bg-neutral-50 border border-green-600 text-green-600 hover:bg-green-600 hover:text-white cursor-pointer"
						>
							Cancel
						</button>
						<button
							onClick={confirm}
							className="px-2 py-1 rounded-lg w-20 text-center bg-neutral-50 border border-red-400 text-red-400 hover:bg-red-500 hover:text-white cursor-pointer"
						>
							Confirm
						</button>
					</div>
				) : (
					<div className="_buttons flex justify-center my-2">
						<Spinner borderClr={"border-red-400"} />
					</div>
				)}
			</div>
		</>
	);
};

export default ConfirmDelete;
