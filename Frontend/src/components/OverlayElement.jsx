import React from "react";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin6Fill } from "react-icons/ri";
import Tooltip from "./Tooltip";

const OverlayElement = ({handleEdit, handleDelete}) => {
	return (
		<div className="_overlay w-full h-full absolute flex justify-center items-center bg-neutral-800/50">
			<div className="text-white font-semibold text-sm flex justify-center items-center gap-4 ">
				<div>
					<Tooltip text={"Edit"}>
						<LiaEditSolid
							size={35}
							className="shadow-lg text-green-500 hover:text-green-700 border-2 border-green-400 rounded-lg bg-white"
							onClick={handleEdit}
						/>
					</Tooltip>
				</div>
				<div>
					<Tooltip text={'Delete'}>
						<RiDeleteBin6Fill
							size={35}
							className="shadow-lg text-red-300 hover:text-red-500 border-2 border-red-400 rounded-lg bg-white"
							onClick={handleDelete}
						/>
					</Tooltip>
				</div>
			</div>
		</div>
	);
};

export default OverlayElement;
