import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";

import FormError from "../../../../../src/features/InfoPack/components/inputs/FormError";

test("renders error message with sr-only label", async () => {
	const html = renderToStaticMarkup(
		<FormError id="sample-error" error="Something went wrong" />,
	);

	expect(html).toContain('id="sample-error"');
	expect(html).toContain('class="form-error"');
	expect(html).toContain('class="sr-only"');
	expect(html).toContain("Something went wrong");
});

test("renders empty error container when no message provided", async () => {
	const html = renderToStaticMarkup(
		<FormError id="empty-error" error={undefined} />,
	);

	expect(html).toContain('id="empty-error"');
	expect(html).toContain('class="form-error"');
	expect(html).toContain('class="sr-only"');
	expect(html).not.toContain("undefined");
});
