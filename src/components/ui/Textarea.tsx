import type React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	error?: boolean;
}

export function Textarea({ error, className = "", ...props }: TextareaProps) {
	return (
		<textarea
			{...props}
			className={`form-textarea${error ? " form-input-error" : ""} ${className}`}
		/>
	);
}
