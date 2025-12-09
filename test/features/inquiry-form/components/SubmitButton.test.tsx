import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";

import SubmitButton from "../../../../src/features/InfoPack/components/SubmitButton";

test("renders default submit button text", async () => {
	const html = renderToStaticMarkup(<SubmitButton loading={false} />);

	expect(html).toContain('type="submit"');
	expect(html).toContain("Send");
	expect(html).not.toContain("animate-spin");
	expect(html).not.toContain("disabled");
});

test("renders custom label when provided", async () => {
	const html = renderToStaticMarkup(
		<SubmitButton loading={false} label="Send Request" />,
	);

	expect(html).toContain("Send Request");
	expect(html).not.toContain("animate-spin");
});

test("renders loading state with spinner and disabled button", async () => {
	const html = renderToStaticMarkup(<SubmitButton loading={true} />);

	expect(html).toContain("animate-spin");
	expect(html).toContain("disabled");
});
