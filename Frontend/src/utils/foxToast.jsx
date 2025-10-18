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
			duration:3000,
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
			duration:3000,
		}
	);
};
