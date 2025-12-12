import type React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: boolean;
}

export function Input({ error, className = "", ...props }: InputProps) {
	return (
		<input
			{...props}
			className={`form-input${error ? " form-input-error" : ""} ${className}`}
		/>
	);
}
