import { Input } from "@/components/ui/Input";
import { INFO_PACK_PLACEHOLDERS } from "../../config/placeholders";
import FormError from "./FormError";

interface PhoneInputProps {
	error?: string;
}

export default function PhoneInput({ error }: PhoneInputProps) {
	return (
		<div>
			<label htmlFor="phone" className="form-label">
				Phone
			</label>
			<div className="form-field">
				<Input
					id="phone"
					name="phone"
					type="tel"
					inputMode="tel"
					required
					autoComplete="tel"
					placeholder={INFO_PACK_PLACEHOLDERS.phone}
					error={!!error}
					aria-invalid={!!error}
					aria-describedby={error ? "phone-error" : undefined}
				/>
			</div>

			<FormError id="phone-error" error={error} />
		</div>
	);
}
