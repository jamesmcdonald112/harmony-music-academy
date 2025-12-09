import { ActionError, defineAction } from "astro:actions";
import * as Sentry from "@sentry/astro";
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

			const message =
				err instanceof Error ? err.message : "Failed to send email";

			throw new ActionError({
				code: "INTERNAL_SERVER_ERROR",
				message,
			});
		}
	},
});
