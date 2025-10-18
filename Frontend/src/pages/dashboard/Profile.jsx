import React, { useState } from "react";
import ChangeAvatar from "./ChangeAvatar";
import EditUserDetails from "./EditUserDetails";
import Divider from "../../components/Divider";

const Profile = () => {
	const link = "/user/dashboard/edit-details";
	
	return (
		<div className="px-4 py-4 w-full">
			<div className="flex justify-center">
				<ChangeAvatar />
			</div>
			<div className="relative z-1 border border-amber-600 my-4">
				<Divider />
			</div>
			<EditUserDetails disabled={true} btnText={'Edit Details'} link={link}  />
		</div>
	);
};

export default Profile;
