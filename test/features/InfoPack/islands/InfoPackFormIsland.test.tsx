import { describe, expect, beforeEach, afterEach, test, vi } from "vitest";
import type React from "react";

const navigateMock = vi.fn();
const sendInfoPackMock = vi.fn();
const isInputErrorMock = vi.fn(
	(error: unknown) =>
		typeof error === "object" &&
		error !== null &&
		(error as { type?: string }).type === "AstroActionInputError",
);
const isActionErrorMock = vi.fn(
	(error: unknown) =>
		typeof error === "object" &&
		error !== null &&
		(error as { type?: string }).type === "AstroActionError",
);
const toastSuccessMock = vi.fn();
const toastErrorMock = vi.fn();
const InfoPackFormReactMock = vi.fn((props: any) => null);
let consoleErrorSpy: ReturnType<typeof vi.spyOn> | null = null;

vi.mock("astro/virtual-modules/transitions-router.js", () => ({
	navigate: navigateMock,
}));

vi.mock("astro:actions", () => ({
	actions: { sendInfoPack: sendInfoPackMock },
	isInputError: isInputErrorMock,
	isActionError: isActionErrorMock,
}));

vi.mock("sonner", () => ({
	toast: {
		success: toastSuccessMock,
		error: toastErrorMock,
	},
	Toaster: () => null,
}));

vi.mock("../../../../src/features/InfoPack/components/InfoPackFormReact", () => ({
	__esModule: true,
	default: InfoPackFormReactMock,
}));

const useStateMocks: Array<ReturnType<typeof vi.fn>> = [];

vi.mock("react", async () => {
	const actual = await vi.importActual<typeof import("react")>("react");
	return {
		...actual,
		useState: (initial: any) => {
			const setter = vi.fn();
			useStateMocks.push(setter);
			return [initial, setter] as [typeof initial, typeof setter];
		},
	};
});

class MockFormData {
	public target: unknown;
	constructor(target?: unknown) {
		this.target = target;
	}
}

const OriginalFormData = globalThis.FormData;

describe("InfoPackFormIsland", () => {
	beforeEach(() => {
		useStateMocks.length = 0;
		(globalThis as any).FormData = MockFormData as unknown as typeof FormData;
		navigateMock.mockClear();
		sendInfoPackMock.mockReset();
		isInputErrorMock.mockClear();
		isActionErrorMock.mockClear();
		toastSuccessMock.mockClear();
		toastErrorMock.mockClear();
		consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
	});

	afterEach(() => {
		(globalThis as any).FormData = OriginalFormData;
		consoleErrorSpy?.mockRestore();
	});

	async function renderIsland() {
		// Lazy import to ensure mocks are applied
		const { default: InfoPackFormIsland } = await import(
			"../../../../src/features/InfoPack/islands/InfoPackFormIsland"
		);
		const tree = InfoPackFormIsland() as any;
		const children = Array.isArray(tree?.props?.children)
			? tree.props.children
			: [tree?.props?.children];
		const infoPackChild = children.find(
			(child: any) => child?.type === InfoPackFormReactMock,
		);
		if (!infoPackChild) {
			throw new Error("InfoPackFormReact not rendered");
		}
		return infoPackChild.props as {
			onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
			errors: unknown;
			loading: boolean;
		};
	}

	test("submits successfully and navigates on success response", async () => {
		sendInfoPackMock.mockResolvedValue({
			data: { success: true, message: "Info sent" },
			error: null,
		});

		const props = await renderIsland();
		const [setLoadingMock, setErrorsMock] = useStateMocks;

		const fakeEvent = {
			preventDefault: vi.fn(),
			currentTarget: { id: "form" },
		} as unknown as React.FormEvent<HTMLFormElement>;

		await props.onSubmit(fakeEvent);

		expect(fakeEvent.preventDefault).toHaveBeenCalled();
		expect(setLoadingMock).toHaveBeenCalledWith(true);
		expect(setLoadingMock).toHaveBeenCalledWith(false);
		expect(setErrorsMock).toHaveBeenCalledWith({});
		expect(sendInfoPackMock).toHaveBeenCalledWith(expect.any(MockFormData));
		expect(toastSuccessMock).toHaveBeenCalledWith("Info sent");
		expect(navigateMock).toHaveBeenCalledWith("/thank-you");
	});

	test("captures input errors and stops on input validation failure", async () => {
		sendInfoPackMock.mockResolvedValue({
			data: null,
			error: {
				type: "AstroActionInputError",
				fields: { email: ["Invalid"] },
				message: "Invalid input",
			},
		});

		const props = await renderIsland();
		const [setLoadingMock, setErrorsMock] = useStateMocks;

		await props.onSubmit({
			preventDefault: vi.fn(),
			currentTarget: {},
		} as unknown as React.FormEvent<HTMLFormElement>);

		expect(isInputErrorMock).toHaveBeenCalled();
		expect(setErrorsMock).toHaveBeenCalledWith({});
		expect(setErrorsMock).toHaveBeenCalledWith({ email: ["Invalid"] });
		expect(setLoadingMock).toHaveBeenCalledWith(true);
		expect(setLoadingMock).toHaveBeenCalledWith(false);
		expect(toastErrorMock).not.toHaveBeenCalled();
		expect(navigateMock).not.toHaveBeenCalled();
	});

	test("shows server error toast when action error occurs", async () => {
		sendInfoPackMock.mockResolvedValue({
			data: null,
			error: {
				type: "AstroActionError",
				code: "INTERNAL_SERVER_ERROR",
				message: "Server error",
			},
		});

		const props = await renderIsland();
		const [setLoadingMock, setErrorsMock] = useStateMocks;

		await props.onSubmit({
			preventDefault: vi.fn(),
			currentTarget: {},
		} as unknown as React.FormEvent<HTMLFormElement>);

		expect(isActionErrorMock).toHaveBeenCalled();
		expect(toastErrorMock).toHaveBeenCalledWith("Server error");
		expect(setErrorsMock).toHaveBeenCalledWith({});
		expect(setLoadingMock).toHaveBeenCalledWith(true);
		expect(setLoadingMock).toHaveBeenCalledWith(false);
		expect(navigateMock).not.toHaveBeenCalled();
	});

	test("shows unexpected error toast when handler throws", async () => {
		sendInfoPackMock.mockRejectedValue(new Error("Boom"));

		const props = await renderIsland();
		const [setLoadingMock] = useStateMocks;

		await props.onSubmit({
			preventDefault: vi.fn(),
			currentTarget: {},
		} as unknown as React.FormEvent<HTMLFormElement>);

		expect(toastErrorMock).toHaveBeenCalledWith("Unexpected error");
		expect(setLoadingMock).toHaveBeenCalledWith(true);
		expect(setLoadingMock).toHaveBeenCalledWith(false);
		expect(navigateMock).not.toHaveBeenCalled();
	});
});
