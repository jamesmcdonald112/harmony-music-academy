interface ErrorSummaryProps {
	fieldErrors: Record<string, string[] | undefined>;
}

const labels: Record<string, string> = {
	fullName: "Full name",
	email: "Email",
	phone: "Phone number",
	studentAge: "Student age",
	message: "Message",
};

export default function ErrorSummary({ fieldErrors }: ErrorSummaryProps) {
	const hasErrors = Object.values(fieldErrors).some(
		(err) => err && err.length > 0,
	);

	if (!hasErrors) return null;

	return (
		<div
			aria-live="polite"
			className="mb-4 rounded border border-red-200 bg-red-50 p-4"
		>
			<p className="font-semibold text-red-800">
				Please correct the errors below:
			</p>

			<ul className="mt-2 ml-5 list-disc text-red-700">
				{Object.entries(fieldErrors).map(([field, errs]) =>
					errs ? (
						<li key={field}>
							<a href={`#${field}`}>
								{labels[field] ?? field}: {errs[0]}
							</a>
						</li>
					) : null,
				)}
			</ul>
		</div>
	);
}
