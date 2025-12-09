import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";

import MessageInput from "../../../../../src/features/InfoPack/components/inputs/MessageInput";
import { FORM_LIMITS } from "../../../../../src/features/InfoPack/config/form-limits";

test("renders message textarea without error styling", async () => {
	const html = renderToStaticMarkup(
		<MessageInput maxLength={FORM_LIMITS.message.max} error={undefined} />,
	);

	expect(html).toContain('id="message"');
	expect(html).toContain('name="message"');
	expect(html).toContain('rows="4"');
	expect(html).toContain(`maxLength="${FORM_LIMITS.message.max}"`);
	expect(html).toContain(
		'placeholder="My son is interested in piano lessons, what options are available?"',
	);

	expect(html).not.toContain("form-input-error");
	expect(html).toContain('aria-invalid="false"');
	expect(html).not.toContain('aria-describedby="message-error"');
	expect(html).toContain('id="message-error"');
});

test("renders message textarea with error styling and message", async () => {
	const html = renderToStaticMarkup(
		<MessageInput
			maxLength={FORM_LIMITS.message.max}
			error="Message is too long"
		/>,
	);

	expect(html).toContain("form-input-error");
	expect(html).toContain('aria-invalid="true"');
	expect(html).toContain('aria-describedby="message-error"');
	expect(html).toContain("Message is too long");
});
