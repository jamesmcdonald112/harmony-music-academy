interface FormErrorProps {
	id: string;
	error?: string;
}

export default function FormError({ id, error }: FormErrorProps) {
	return (
		<p id={id} className="form-error">
			<span className="sr-only">Error:</span>
			{error}
		</p>
	);
}
