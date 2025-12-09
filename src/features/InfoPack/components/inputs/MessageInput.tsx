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
				Any questions?
			</label>
			<div className="form-field">
				<textarea
					className={textareaClass}
					id="message"
					name="message"
					rows={4}
					maxLength={maxLength}
					placeholder="My son is interested in piano lessons, what options are available?"
					aria-invalid={!!error}
					aria-describedby={error ? "message-error" : undefined}
				/>
			</div>

			<FormError id="message-error" error={error} />
		</div>
	);
}
