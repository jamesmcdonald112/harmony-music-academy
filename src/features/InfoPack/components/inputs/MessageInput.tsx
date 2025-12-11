import { INFO_PACK_PLACEHOLDERS } from "../../config/placeholders";
import FormError from "./FormError";

interface MessageInputProps {
	maxLength: number;
	error?: string;
}

export default function MessageInput({ maxLength, error }: MessageInputProps) {
	const textareaClass = `form-textarea${error ? " form-input-error" : ""}`;

	return (
		<div>
			<label htmlFor="message" className="form-label">
				Any questions? (optional)
			</label>
			<div className="form-field">
				<textarea
					className={textareaClass}
					id="message"
					name="message"
					rows={4}
					maxLength={maxLength}
					placeholder={INFO_PACK_PLACEHOLDERS.message}
					aria-invalid={!!error}
					aria-describedby={error ? "message-error" : undefined}
				/>
			</div>

			<FormError id="message-error" error={error} />
		</div>
	);
}
