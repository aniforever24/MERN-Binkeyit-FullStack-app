import { toast } from "react-fox-toast";

export const notifySuccess = (msg, msg2) => {
	return toast.success(
		<>
			{msg && <div>{msg}</div>}
			{msg2 && <div>{msg2}</div>}
		</>,
		{
			position: "top-center",
			duration: 3000,
		}
	);
};

export const notifyError = (msg, msg2) => {
	return toast.error(
		<>
			{msg && <div>{msg}</div>}
			{msg2 && <div>{msg2}</div>}
		</>,
		{
			position: "top-center",
			duration: 3000,
		}
	);
};

export const notifyWarning = (msg, msg2) => {
	return toast.warning(
		<>
			{msg && <div>{msg}</div>}
			{msg2 && <div>{msg2}</div>}
		</>,
		{
			position: "top-center",
			duration: 3000,
		}
	);
};

// user_api = promise, dealy of 1min will work only when user_api is missing
export const toastLoading = ({delay = 60000, user_api, onSuccess= "", onError=""} = {}) => {
	if (!user_api) {
		user_api = new Promise((resolve, reject) => setTimeout(() => resolve("success"), delay));
	}

	return toast.promise(user_api, {
		loading: "Loading...",
		success: onSuccess,
		error: onError,
		position: "top-center",
	});
};