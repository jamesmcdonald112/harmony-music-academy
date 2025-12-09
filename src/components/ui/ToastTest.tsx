"use client";

import { toast } from "sonner";

export default function ToastTest() {
	return (
		<button
			type="button"
			onClick={() => toast("Toast is working!")}
			className="rounded border px-4 py-2"
		>
			Show Test Toast
		</button>
	);
}
