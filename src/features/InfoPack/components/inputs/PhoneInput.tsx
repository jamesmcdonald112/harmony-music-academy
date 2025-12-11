import { INFO_PACK_PLACEHOLDERS } from "../../config/placeholders";
import FormError from "./FormError";

interface PhoneInputProps {
	error?: string;
}

export default function PhoneInput({ error }: PhoneInputProps) {
	const inputClass = `form-input${error ? " form-input-error" : ""}`;

	return (
		<div>
			<label htmlFor="phone" className="form-label">
				Phone
			</label>
			<div className="form-field">
				<input
					className={inputClass}
					id="phone"
					name="phone"
					type="tel"
					inputMode="tel"
					required
					autoComplete="tel"
					placeholder={INFO_PACK_PLACEHOLDERS.phone}
					aria-invalid={!!error}
					aria-describedby={error ? "phone-error" : undefined}
				/>
			</div>

			<FormError id="phone-error" error={error} />
		</div>
	);
}
