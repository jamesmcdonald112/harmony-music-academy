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
			className="mb-4 rounded border border-destructive/20 bg-destructive/10 p-4"
		>
			<p className="font-semibold text-destructive">
				Please correct the errors below:
			</p>

			<ul className="mt-2 ml-5 list-disc text-destructive/90">
				{Object.entries(fieldErrors).map(([field, errs]) =>
					errs ? (
						<li key={field}>
							<a href={`#${field}`} className="text-destructive font-medium">
								{labels[field] ?? field}: {errs[0]}
							</a>
						</li>
					) : null,
				)}
			</ul>
		</div>
	);
}
