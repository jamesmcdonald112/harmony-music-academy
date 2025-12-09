import FormError from "./FormError";

interface FullNameInputProps {
	error?: string;
}

export default function FullNameInput({ error }: FullNameInputProps) {
	const inputClass = `form-input${error ? " form-input-error" : ""}`;

	return (
		<div>
			<label htmlFor="fullName" className="form-label">
				Full name
			</label>
			<div className="form-field">
				<input
					className={inputClass}
					id="fullName"
					name="fullName"
					type="text"
					required
					autoComplete="name"
					placeholder="John Doe"
					aria-invalid={!!error}
					aria-describedby={error ? "fullName-error" : undefined}
				/>
			</div>

			<FormError id="fullName-error" error={error} />
		</div>
	);
}
