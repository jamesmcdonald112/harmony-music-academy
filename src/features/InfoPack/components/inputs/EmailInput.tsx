import { Input } from "@/components/ui/Input";
import { INFO_PACK_PLACEHOLDERS } from "../../config/placeholders";
import FormError from "./FormError";

interface EmailInputProps {
	error?: string;
}

export default function EmailInput({ error }: EmailInputProps) {
	return (
		<div>
			<label htmlFor="email" className="form-label">
				Email
			</label>

			<div className="form-field">
				<Input
					id="email"
					name="email"
					type="email"
					inputMode="email"
					autoComplete="email"
					required
					placeholder={INFO_PACK_PLACEHOLDERS.email}
					error={!!error}
					aria-invalid={!!error}
					aria-describedby={error ? "email-error" : undefined}
				/>
			</div>

			<FormError id="email-error" error={error} />
		</div>
	);
}
