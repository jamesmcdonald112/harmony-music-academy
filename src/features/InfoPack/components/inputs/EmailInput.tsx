import FormError from "./FormError";

interface EmailInputProps {
	error?: string;
}

export default function EmailInput({ error }: EmailInputProps) {
	const inputClass = `form-input${error ? " form-input-error" : ""}`;

	return (
		<div>
			<label htmlFor="email" className="form-label">
				Email
			</label>
			<div className="form-field">
				<input
					className={inputClass}
					id="email"
					type="email"
					name="email"
					inputMode="email"
					required
					autoComplete="email"
					placeholder="john@example.com"
					aria-invalid={!!error}
					aria-describedby={error ? "email-error" : undefined}
				/>
			</div>

			<FormError id="email-error" error={error} />
		</div>
	);
}
