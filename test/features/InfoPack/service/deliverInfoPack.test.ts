import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const sendMock = vi.hoisted(() => vi.fn());

vi.mock("resend", () => {
	const Resend = vi.fn().mockImplementation(() => ({
		emails: { send: sendMock },
	}));
	return { Resend };
});

const baseInput = {
	fullName: "Ada Lovelace",
	email: "ada@example.com",
	phone: "+12345",
	studentAge: 10,
	message: "Hello there",
};

const originalEnv = { ...import.meta.env };

function setEnv(env: Record<string, string | undefined>) {
	const merged = { ...originalEnv, ...env };
	Object.defineProperty(import.meta, "env", {
		get() {
			return merged;
		},
		configurable: true,
	});
	for (const [key, value] of Object.entries(env)) {
		if (value === undefined) {
			delete (process.env as Record<string, string | undefined>)[key];
		} else {
			(process.env as Record<string, string | undefined>)[key] = value;
		}
	}
}

async function loadDeliverInfoPack() {
	vi.resetModules();
	return (
		await import("../../../../src/features/InfoPack/service/deliverInfoPack")
	).deliverInfoPack;
}

describe("deliverInfoPack", () => {
	beforeEach(() => {
		sendMock.mockReset();
		sendMock.mockResolvedValue({ error: null });
		setEnv(originalEnv);
	});

	afterEach(() => {
		setEnv(originalEnv);
	});

	test("sends email with correct fields and escapes user input", async () => {
		setEnv({
			RESEND_API_KEY: "key",
			INFO_PACK_TO_EMAIL: "to1@example.com, to2@example.com",
			INFO_PACK_FROM: "From Name <from@example.com>",
		});

		expect(import.meta.env.RESEND_API_KEY).toBe("key");

		const deliverInfoPack = await loadDeliverInfoPack();
		const input = {
			...baseInput,
			fullName: "Eve <script>",
			email: "eve@example.com",
			phone: "<b>123</b>",
			message: 'Click <script>alert("x")</script>',
		};

		await deliverInfoPack(input);

		expect(sendMock).toHaveBeenCalledOnce();
		const payload = sendMock.mock.calls[0][0];
		expect(payload.to).toEqual(["to1@example.com", "to2@example.com"]);
		expect(payload.from).toBe("From Name <from@example.com>");
		expect(payload.replyTo).toBe("eve@example.com");
		expect(payload.subject).toBe("Info Pack Request — Eve <script>");
		expect(payload.html).not.toContain("<script>");
		expect(payload.html).toContain("&lt;script&gt;");
		expect(payload.html).toContain("&lt;b&gt;");
	});

	test("throws if RESEND_API_KEY is missing", async () => {
		setEnv({
			RESEND_API_KEY: "",
			INFO_PACK_TO_EMAIL: "to@example.com",
		});

		const deliverInfoPack = await loadDeliverInfoPack();

		await expect(deliverInfoPack(baseInput)).rejects.toThrow(
			"Missing RESEND_API_KEY",
		);
		expect(sendMock).not.toHaveBeenCalled();
	});

	test("throws if INFO_PACK_TO_EMAIL is missing", async () => {
		setEnv({
			RESEND_API_KEY: "key",
			INFO_PACK_TO_EMAIL: "",
		});

		const deliverInfoPack = await loadDeliverInfoPack();

		await expect(deliverInfoPack(baseInput)).rejects.toThrow(
			"Missing INFO_PACK_TO_EMAIL",
		);
		expect(sendMock).not.toHaveBeenCalled();
	});

	test("falls back to INFO_PACK_REPLY_TO when input email is empty", async () => {
		setEnv({
			RESEND_API_KEY: "key",
			INFO_PACK_TO_EMAIL: "to@example.com",
			INFO_PACK_FROM: "From <from@example.com>",
			INFO_PACK_REPLY_TO: "fallback@example.com",
		});

		const deliverInfoPack = await loadDeliverInfoPack();

		await deliverInfoPack({ ...baseInput, email: "" });

		expect(sendMock).toHaveBeenCalledOnce();
		expect(sendMock.mock.calls[0][0].replyTo).toBe("fallback@example.com");
	});

	test("strips newlines from subject to prevent header injection", async () => {
		setEnv({
			RESEND_API_KEY: "key",
			INFO_PACK_TO_EMAIL: "to@example.com",
			INFO_PACK_FROM: "From <from@example.com>",
		});

		const deliverInfoPack = await loadDeliverInfoPack();

		await deliverInfoPack({ ...baseInput, fullName: "Alice\nBob" });

		expect(sendMock).toHaveBeenCalledOnce();
		const subject = sendMock.mock.calls[0][0].subject as string;
		expect(subject).toBe("Info Pack Request — Alice Bob");
		expect(subject).not.toContain("\n");
	});
});
