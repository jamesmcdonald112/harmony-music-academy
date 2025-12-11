import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";

import FullNameInput from "../../../../../src/features/InfoPack/components/inputs/FullNameInput";
import { INFO_PACK_PLACEHOLDERS } from "../../../../../src/features/InfoPack/config/placeholders";

test("renders full name input without error styling", async () => {
	const html = renderToStaticMarkup(<FullNameInput error={undefined} />);

	expect(html).toContain('id="fullName"');
	expect(html).toContain('name="fullName"');
	expect(html).toContain('type="text"');
	expect(html).toContain("required");
	expect(html).toContain('autoComplete="name"');
	expect(html).toContain(`placeholder="${INFO_PACK_PLACEHOLDERS.fullName}"`);

	expect(html).not.toContain("form-input-error");
	expect(html).toContain('aria-invalid="false"');
	expect(html).not.toContain('aria-describedby="fullName-error"');
	expect(html).toContain('id="fullName-error"');
});

test("renders full name input with error styling and message", async () => {
	const html = renderToStaticMarkup(
		<FullNameInput error="Full name is required" />,
	);

	expect(html).toContain("form-input-error");
	expect(html).toContain('aria-invalid="true"');
	expect(html).toContain('aria-describedby="fullName-error"');
	expect(html).toContain("Full name is required");
});
