import { ActionError, defineAction } from "astro:actions";
import * as Sentry from "@sentry/astro";
import type { z } from "zod";
import { getAllowedOrigins } from "../config/allowed-origins";
import { INFO_PACK_ERRORS } from "../config/error-messages";
import { infoPackSchema } from "../schemas/infoPack.schema";
import { deliverInfoPack } from "../service/deliverInfoPack";

type InfoPackInput = z.infer<typeof infoPackSchema>;

export async function sendInfoPackHandler(
	input: InfoPackInput,
	context?: { request: Request },
) {
	console.log("HANDLER RAN with input:", input);

	const allowedOrigins = getAllowedOrigins();
	if (allowedOrigins.size > 0) {
		const origin = context?.request.headers.get("origin");
		if (!origin || !allowedOrigins.has(origin)) {
			throw new ActionError({
				code: "FORBIDDEN",
				message: INFO_PACK_ERRORS.action.forbidden,
			});
		}
	}

	// Honeypot: humans won’t fill `website`. If it has a value, treat as bot.
	// Return success to avoid tipping off spam scripts (don’t send email, don’t log).
	if (input.website?.trim()) {
		console.log("HONEYPOT TRIGGERED");
		return { success: true, message: "OK" };
	}

	try {
		await deliverInfoPack(input);
		return {
			success: true,
			message: "Info pack emailed successfully",
		};
	} catch (err: unknown) {
		Sentry.captureException(err);

		// If it's already an ActionError, rethrow to parent so it can be displayed in toast error message.
		if (err instanceof ActionError) {
			throw err;
		}

		throw new ActionError({
			code: "INTERNAL_SERVER_ERROR",
			message: INFO_PACK_ERRORS.action.internalServerError,
		});
	}
}

export const sendInfoPack = defineAction({
	accept: "form",
	input: infoPackSchema,
	handler: (input, context) => sendInfoPackHandler(input, context),
});
