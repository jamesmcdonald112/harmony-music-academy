import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";

import PhoneInput from "../../../../../src/features/InfoPack/components/inputs/PhoneInput";
import { INFO_PACK_PLACEHOLDERS } from "../../../../../src/features/InfoPack/config/placeholders";

test("renders phone input without error styling", async () => {
	const html = renderToStaticMarkup(<PhoneInput error={undefined} />);

	expect(html).toContain('id="phone"');
	expect(html).toContain('name="phone"');
	expect(html).toContain('type="tel"');
	expect(html).toContain('inputMode="tel"');
	expect(html).toContain("required");
	expect(html).toContain(`placeholder="${INFO_PACK_PLACEHOLDERS.phone}"`);

	expect(html).not.toContain("form-input-error");
	expect(html).toContain('aria-invalid="false"');
	expect(html).not.toContain('aria-describedby="phone-error"');
	expect(html).toContain('id="phone-error"');
});

test("renders phone input with error styling and message", async () => {
	const html = renderToStaticMarkup(
		<PhoneInput error="Invalid phone number" />,
	);

	expect(html).toContain("form-input-error");
	expect(html).toContain('aria-invalid="true"');
	expect(html).toContain('aria-describedby="phone-error"');
	expect(html).toContain("Invalid phone number");
});
