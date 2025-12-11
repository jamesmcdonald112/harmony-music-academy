import { ActionError, defineAction } from "astro:actions";
import * as Sentry from "@sentry/astro";
import { INFO_PACK_ERRORS } from "../config/error-messages";
import { infoPackSchema } from "../schemas/infoPack.schema";

export const sendInfoPack = defineAction({
	accept: "form",
	input: infoPackSchema,
	handler: async (input) => {
		console.log("HANDLER RAN with input:", input);
		try {
			// TODO: send email here (Resend, SMTP, etc.)
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
	},
});
