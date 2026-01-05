import { describe, expect, test } from "vitest";
import type { z } from "zod";
import { FORM_LIMITS } from "../../../../src/features/InfoPack/config/form-limits";
import { infoPackSchema } from "../../../../src/features/InfoPack/schemas/infoPack.schema";

type InfoPackInput = z.input<typeof infoPackSchema>;

function makeValidInput(overrides: Partial<InfoPackInput> = {}): InfoPackInput {
	return {
		fullName: "Jane Doe",
		email: "jane@example.com",
		phone: "+1 234-567",
		studentAge: 10,
		message: "Hello",
		website: "",
		...overrides,
	};
}

const {
	fullName: FULL_NAME_LIMITS,
	email: EMAIL_LIMITS,
	message: MESSAGE_LIMITS,
	studentAge: STUDENT_AGE_LIMITS,
} = FORM_LIMITS;

describe("infoPackSchema happy path", () => {
	test("parses a fully valid input", () => {
		const data = infoPackSchema.parse(
			makeValidInput({
				fullName: " Jane Doe ",
				email: " JANE@Example.com ",
				message: " Hello ",
				website: " ",
			}),
		);

		expect(data).toEqual({
			fullName: "Jane Doe",
			email: "jane@example.com",
			phone: "+1 234-567",
			studentAge: 10,
			message: "Hello",
			website: "",
		});
	});
});

describe("infoPackSchema fullName", () => {
	test("trims whitespace", () => {
		const data = infoPackSchema.parse(
			makeValidInput({ fullName: "  Jane Doe  " }),
		);
		expect(data.fullName).toBe("Jane Doe");
	});

	test("fails when shorter than min", () => {
		const shortName = "a".repeat(FULL_NAME_LIMITS.min - 1);
		expect(() =>
			infoPackSchema.parse(makeValidInput({ fullName: shortName })),
		).toThrow();
	});

	test("fails when longer than max", () => {
		const longName = "a".repeat(FULL_NAME_LIMITS.max + 1);
		expect(() =>
			infoPackSchema.parse(makeValidInput({ fullName: longName })),
		).toThrow();
	});
});

describe("infoPackSchema email", () => {
	test("trims and lowercases", () => {
		const data = infoPackSchema.parse(
			makeValidInput({ email: "  TEST@EXAMPLE.COM " }),
		);
		expect(data.email).toBe("test@example.com");
	});

	test("fails invalid email", () => {
		expect(() =>
			infoPackSchema.parse(makeValidInput({ email: "abc" })),
		).toThrow();
	});

	test("fails when longer than max", () => {
		const domain = "@example.com";
		const longEmail = `${"a".repeat(EMAIL_LIMITS.max - domain.length + 1)}${domain}`;
		expect(() =>
			infoPackSchema.parse(makeValidInput({ email: longEmail })),
		).toThrow();
	});
});

describe("infoPackSchema phone", () => {
	test("accepts known good phone", () => {
		const input = makeValidInput();
		const data = infoPackSchema.parse(input);
		expect(data.phone).toBe(input.phone.trim());
	});

	test("rejects invalid phone", () => {
		expect(() =>
			infoPackSchema.parse(makeValidInput({ phone: "abc" })),
		).toThrow();
	});
});

describe("infoPackSchema studentAge", () => {
	test("accepts valid input", () => {
		const data = infoPackSchema.parse(makeValidInput({ studentAge: 8 }));
		expect(data.studentAge).toBe(8);
	});

	test("accepts numeric string input", () => {
		const rawInput = { ...makeValidInput(), studentAge: "8" } as unknown;
		const data = infoPackSchema.parse(rawInput);

		expect(data.studentAge).toBe(8);
	});

	test("rejects decimal values", () => {
		expect(() =>
			infoPackSchema.parse(makeValidInput({ studentAge: 8.5 })),
		).toThrow();
	});

	test("rejects decimal string", () => {
		const rawInput = { ...makeValidInput(), studentAge: "8.5" } as unknown;

		expect(() => infoPackSchema.parse(rawInput)).toThrow();
	});

	test("rejects below min", () => {
		expect(() =>
			infoPackSchema.parse(
				makeValidInput({ studentAge: STUDENT_AGE_LIMITS.min - 1 }),
			),
		).toThrow();
	});

	test("rejects above max", () => {
		expect(() =>
			infoPackSchema.parse(
				makeValidInput({ studentAge: STUDENT_AGE_LIMITS.max + 1 }),
			),
		).toThrow();
	});

	test("accepts missing studentAge", () => {
		const data = infoPackSchema.parse(
			makeValidInput({ studentAge: undefined }),
		);
		expect(data.studentAge).toBeUndefined();
	});
});

describe("infoPackSchema message", () => {
	test("accepts missing message", () => {
		const data = infoPackSchema.parse(makeValidInput({ message: undefined }));
		expect(data.message).toBeUndefined();
	});

	test("accepts whitespace-only message and trims to empty string", () => {
		const data = infoPackSchema.parse(makeValidInput({ message: "   " }));
		expect(data.message).toBe("");
	});

	test("rejects message exceeding max length", () => {
		const longMessage = "a".repeat(MESSAGE_LIMITS.max + 1);
		expect(() =>
			infoPackSchema.parse(makeValidInput({ message: longMessage })),
		).toThrow();
	});
});

describe("infoPackSchema website transform", () => {
	test("missing website becomes empty string", () => {
		const data = infoPackSchema.parse(makeValidInput({ website: undefined }));
		expect(data.website).toBe("");
	});

	test("null website becomes empty string", () => {
		const data = infoPackSchema.parse(makeValidInput({ website: null }));
		expect(data.website).toBe("");
	});

	test("whitespace website becomes empty string", () => {
		const data = infoPackSchema.parse(makeValidInput({ website: "   " }));
		expect(data.website).toBe("");
	});

	test("non-empty website keeps trimmed value", () => {
		const data = infoPackSchema.parse(
			makeValidInput({ website: "  bot value  " }),
		);
		expect(data.website).toBe("bot value");
	});
});
