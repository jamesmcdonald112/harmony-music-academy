import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";

import EmailInput from "../../../../../src/features/InfoPack/components/inputs/EmailInput";

test("renders email input without error styling", async () => {
	const html = renderToStaticMarkup(<EmailInput error={undefined} />);

	// Input is present
	expect(html).toContain('id="email"');
	expect(html).toContain('name="email"');
	expect(html).toContain('type="email"');
	expect(html).toContain("required");
	expect(html).toContain('inputMode="email"');
	expect(html).toContain('placeholder="john@example.com"');

	// No error class
	expect(html).not.toContain("form-input-error");

	// aria-invalid should be false when there is no error
	expect(html).toContain('aria-invalid="false"');

	// No aria-describedby reference
	expect(html).not.toContain('aria-describedby="email-error"');
	expect(html).toContain('id="email-error"');
});

test("renders email input with error styling and message", async () => {
	const html = renderToStaticMarkup(<EmailInput error="Invalid email" />);

	// Input shows error class
	expect(html).toContain("form-input-error");

	// aria-invalid should be true
	expect(html).toContain('aria-invalid="true"');

	// aria-describedby should point to the correct error ID
	expect(html).toContain('aria-describedby="email-error"');

	// The FormError component should output the error text
	expect(html).toContain("Invalid email");
});
