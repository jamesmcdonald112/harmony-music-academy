export const prerender = false;

import * as Sentry from "@sentry/astro";
import type { APIRoute } from "astro";

// NOTE:
// In many setups Sentry is initialized in `sentry.server.config.ts`.
// This route is a self-contained test endpoint, so we ensure Sentry is initialized here.
const dsn = import.meta.env.PUBLIC_SENTRY_DSN;
const environment = import.meta.env.MODE;

if (dsn && !Sentry.getClient()) {
	Sentry.init({
		dsn,
		environment,
		// Helps when you're testing locally; safe to remove later.
		debug: false,
	});
}

export const GET: APIRoute = async ({ request }) => {
	const adminToken = import.meta.env.ADMIN_TEST_TOKEN?.trim();

	if (!dsn || !adminToken) {
		return new Response("Server misconfigured", { status: 500 });
	}

	// Admin-only test endpoint: requires x-admin-token header to prevent public abuse.
	const token = request.headers.get("x-admin-token")?.trim();
	if (!token) return new Response("Unauthorized", { status: 401 });
	if (token !== adminToken) return new Response("Forbidden", { status: 403 });

	try {
		throw new Error("This is a Sentry server test error");
	} catch (err: unknown) {
		Sentry.captureException(err);

		// IMPORTANT: in serverless, the runtime can stop immediately after you return a response.
		// flush(timeoutMs) does NOT "sleep" — it waits *up to* timeoutMs for queued events to send.
		await Sentry.flush(4000);

		return new Response("Captured test error (server).", {
			status: 200,
			headers: { "cache-control": "no-store" },
		});
	}
};
