import { Textarea } from "@/components/ui/Textarea";
import { INFO_PACK_PLACEHOLDERS } from "../../config/placeholders";
import FormError from "./FormError";

interface MessageInputProps {
	maxLength: number;
	error?: string;
}

export default function MessageInput({ maxLength, error }: MessageInputProps) {
	return (
		<div>
			<label htmlFor="message" className="form-label">
				Any questions? (optional)
			</label>
			<div className="form-field">
				<Textarea
					id="message"
					name="message"
					rows={4}
					maxLength={maxLength}
					placeholder={INFO_PACK_PLACEHOLDERS.message}
					error={!!error}
					aria-invalid={!!error}
					aria-describedby={error ? "message-error" : undefined}
				/>
			</div>

			<FormError id="message-error" error={error} />
		</div>
	);
}
