import { ActionError } from "astro:actions";
import { beforeEach, describe, expect, test, vi } from "vitest";

const { captureExceptionMock, deliverInfoPackMock } = vi.hoisted(() => ({
	captureExceptionMock: vi.fn(),
	deliverInfoPackMock: vi.fn(),
}));

vi.mock("@sentry/astro", () => ({
	captureException: captureExceptionMock,
}));

vi.mock("../../../../src/features/InfoPack/service/deliverInfoPack", () => ({
	deliverInfoPack: deliverInfoPackMock,
}));

import { sendInfoPackHandler } from "../../../../src/features/InfoPack/actions/sendInfoPack";

const baseInput = {
	fullName: "Ada Lovelace",
	email: "ada@example.com",
	phone: "+12345",
	website: "",
};

function makeContext(origin?: string | null) {
	const headers: Record<string, string> = origin ? { origin } : {};
	return {
		request: new Request("http://localhost", { headers }),
	};
}

describe("sendInfoPackHandler", () => {
	beforeEach(() => {
		captureExceptionMock.mockReset();
		deliverInfoPackMock.mockReset();
	});

	test("calls email service for human input", async () => {
		deliverInfoPackMock.mockResolvedValueOnce(undefined);

		const result = await sendInfoPackHandler(baseInput, makeContext());

		expect(deliverInfoPackMock).toHaveBeenCalledOnce();

		expect(deliverInfoPackMock).toHaveBeenCalledWith(baseInput);
		expect(result).toEqual({
			success: true,
			message: "Info pack emailed successfully",
		});
		expect(captureExceptionMock).not.toHaveBeenCalled();
	});

	test("skips email service when honeypot triggers", async () => {
		const result = await sendInfoPackHandler(
			{ ...baseInput, website: "x" },
			makeContext(),
		);

		expect(deliverInfoPackMock).not.toHaveBeenCalled();
		expect(result).toEqual({ success: true, message: "OK" });
		expect(captureExceptionMock).not.toHaveBeenCalled();
	});

	test("rejects disallowed origin", async () => {
		const originalAllowed = process.env.ALLOWED_ORIGINS;
		process.env.ALLOWED_ORIGINS = "https://good.example";

		let thrown: unknown;
		try {
			await sendInfoPackHandler(baseInput, makeContext("https://bad.example"));
		} catch (err) {
			thrown = err;
		} finally {
			process.env.ALLOWED_ORIGINS = originalAllowed;
		}

		expect(deliverInfoPackMock).not.toHaveBeenCalled();
		expect(thrown).toBeInstanceOf(ActionError);
		expect((thrown as ActionError).code).toBe("FORBIDDEN");
	});

	test("wraps email errors in ActionError and captures", async () => {
		const originalAllowed = process.env.ALLOWED_ORIGINS;
		process.env.ALLOWED_ORIGINS = "";

		const emailError = new Error("fail");
		deliverInfoPackMock.mockRejectedValueOnce(emailError);

		let thrown: unknown;
		try {
			await sendInfoPackHandler(baseInput, makeContext());
		} catch (err) {
			thrown = err;
		} finally {
			process.env.ALLOWED_ORIGINS = originalAllowed;
		}

		expect(deliverInfoPackMock).toHaveBeenCalledOnce();
		expect(thrown).toBeInstanceOf(ActionError);
		expect((thrown as ActionError).code).toBe("INTERNAL_SERVER_ERROR");
		expect(captureExceptionMock).toHaveBeenCalledWith(emailError);
	});
});
