import { actions, isActionError, isInputError } from "astro:actions";
import { navigate } from "astro/virtual-modules/transitions-router.js";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import type { FieldErrors } from "@/types/forms";
import InfoPackFormReact from "../components/InfoPackFormReact";

export default function InfoPackFormIsland() {
	const [loading, setLoading] = useState<boolean>(false);
	const [errors, setErrors] = useState<FieldErrors>({});

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setLoading(true);
		setErrors({});

		const formData = new FormData(e.currentTarget);

		try {
			const { data, error } = await actions.sendInfoPack(formData);

			// Handle errors
			if (error) {
				if (isInputError(error)) {
					setErrors(error.fields);
					return;
				}

				if (isActionError(error)) {
					console.error("Action failed:", error.code);
					toast.error(error.message || "Server error");
					return;
				}
			}
			// Success
			if (!error && data?.success) {
				navigate("/thank-you");
				return;
			}
		} catch (err: unknown) {
			console.error("UNEXPECTED ERROR:", err);
			toast.error("Unexpected error");
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<Toaster
				richColors
				position="top-right"
				toastOptions={{ duration: 3000 }}
			/>
			<InfoPackFormReact
				errors={errors}
				loading={loading}
				onSubmit={handleSubmit}
			/>
		</>
	);
}
