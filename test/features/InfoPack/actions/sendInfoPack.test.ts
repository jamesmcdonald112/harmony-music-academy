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

describe("sendInfoPackHandler", () => {
	beforeEach(() => {
		captureExceptionMock.mockReset();
		deliverInfoPackMock.mockReset();
	});

	test("calls email service for human input", async () => {
		deliverInfoPackMock.mockResolvedValueOnce(undefined);

		const result = await sendInfoPackHandler(baseInput);

		expect(deliverInfoPackMock).toHaveBeenCalledOnce();

		expect(deliverInfoPackMock).toHaveBeenCalledWith(baseInput);
		expect(result).toEqual({
			success: true,
			message: "Info pack emailed successfully",
		});
		expect(captureExceptionMock).not.toHaveBeenCalled();
	});

	test("skips email service when honeypot triggers", async () => {
		const result = await sendInfoPackHandler({ ...baseInput, website: "x" });

		expect(deliverInfoPackMock).not.toHaveBeenCalled();
		expect(result).toEqual({ success: true, message: "OK" });
		expect(captureExceptionMock).not.toHaveBeenCalled();
	});

	test("wraps email errors in ActionError and captures", async () => {
		const emailError = new Error("fail");
		deliverInfoPackMock.mockRejectedValueOnce(emailError);

		let thrown: unknown;
		try {
			await sendInfoPackHandler(baseInput);
		} catch (err) {
			thrown = err;
		}

		expect(deliverInfoPackMock).toHaveBeenCalledOnce();
		expect(thrown).toBeInstanceOf(ActionError);
		expect((thrown as ActionError).code).toBe("INTERNAL_SERVER_ERROR");
		expect(captureExceptionMock).toHaveBeenCalledWith(emailError);
	});
});
