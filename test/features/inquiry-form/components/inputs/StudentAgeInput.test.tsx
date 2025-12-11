import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";

import StudentAgeInput from "../../../../../src/features/InfoPack/components/inputs/StudentAgeInput";
import { FORM_LIMITS } from "../../../../../src/features/InfoPack/config/form-limits";
import { INFO_PACK_PLACEHOLDERS } from "../../../../../src/features/InfoPack/config/placeholders";

test("renders student age input without error styling", async () => {
	const html = renderToStaticMarkup(<StudentAgeInput error={undefined} />);

	expect(html).toContain('id="studentAge"');
	expect(html).toContain('name="studentAge"');
	expect(html).toContain('type="number"');
	expect(html).toContain(`min="${FORM_LIMITS.studentAge.min}"`);
	expect(html).toContain(`max="${FORM_LIMITS.studentAge.max}"`);
	expect(html).toContain('inputMode="numeric"');
	expect(html).toContain('autoComplete="off"');
	expect(html).toContain(`placeholder="${INFO_PACK_PLACEHOLDERS.studentAge}"`);

	expect(html).not.toContain("form-input-error");
	expect(html).toContain('aria-invalid="false"');
	expect(html).not.toContain('aria-describedby="studentAge-error"');
	expect(html).toContain('id="studentAge-error"');
});

test("renders student age input with error styling and message", async () => {
	const html = renderToStaticMarkup(
		<StudentAgeInput
			error={`Age must be between ${FORM_LIMITS.studentAge.min} and ${FORM_LIMITS.studentAge.max}`}
		/>,
	);

	expect(html).toContain("form-input-error");
	expect(html).toContain('aria-invalid="true"');
	expect(html).toContain('aria-describedby="studentAge-error"');
	expect(html).toContain(
		`Age must be between ${FORM_LIMITS.studentAge.min} and ${FORM_LIMITS.studentAge.max}`,
	);
});
