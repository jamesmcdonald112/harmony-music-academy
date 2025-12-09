import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";

import ErrorSummary from "../../../../src/features/InfoPack/components/ErrorSummary";

test("renders nothing when there are no field errors", async () => {
	const html = renderToStaticMarkup(<ErrorSummary fieldErrors={{}} />);

	expect(html.trim()).toBe("");
});

test("renders list of field errors with links", async () => {
	const html = renderToStaticMarkup(
		<ErrorSummary
			fieldErrors={{
				fullName: ["Full name is required"],
				email: ["Email is invalid"],
				phone: undefined,
			}}
		/>,
	);

	expect(html).toContain('aria-live="polite"');
	expect(html).toContain("Please correct the errors below:");
	expect(html).toContain('href="#fullName"');
	expect(html).toContain("Full name: Full name is required");
	expect(html).toContain('href="#email"');
	expect(html).toContain("Email: Email is invalid");
	expect(html).not.toContain("Phone number");
});
