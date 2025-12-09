import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";

import PhoneInput from "../../../../../src/features/InfoPack/components/inputs/PhoneInput";

test("renders phone input without error styling", async () => {
	const html = renderToStaticMarkup(<PhoneInput error={undefined} />);

	expect(html).toContain('id="phone"');
	expect(html).toContain('name="phone"');
	expect(html).toContain('type="tel"');
	expect(html).toContain('inputMode="tel"');
	expect(html).toContain("required");
	expect(html).toContain('placeholder="087 123 4567"');

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
