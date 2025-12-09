import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";

import InfoPackFormReact from "../../../../src/features/InfoPack/components/InfoPackFormReact";
import { FORM_LIMITS } from "../../../../src/features/InfoPack/config/form-limits";

test("renders info pack form with all fields and submit button", async () => {
	const html = renderToStaticMarkup(
		<InfoPackFormReact errors={{}} loading={false} onSubmit={() => {}} />,
	);

	expect(html).toContain("<form");

	// Fields are present
	expect(html).toContain('id="fullName"');
	expect(html).toContain('id="email"');
	expect(html).toContain('id="phone"');
	expect(html).toContain('id="studentAge"');
	expect(html).toContain('id="message"');
	expect(html).toContain(`maxLength="${FORM_LIMITS.message.max}"`);

	// Submit button
	expect(html).toContain('type="submit"');
	expect(html).toContain("Send Info Pack");
});

test("renders field errors when provided via props", async () => {
	const html = renderToStaticMarkup(
		<InfoPackFormReact
			errors={{
				fullName: ["Full name is required"],
				email: ["Email is invalid"],
			}}
			loading={false}
			onSubmit={() => {}}
		/>,
	);

	expect(html).toContain("Full name is required");
	expect(html).toContain('aria-describedby="fullName-error"');
	expect(html).toContain("form-input-error");
	expect(html).toContain("Email is invalid");
	expect(html).toContain('aria-describedby="email-error"');

	expect(html).toContain(`maxLength="${FORM_LIMITS.message.max}"`);
});
