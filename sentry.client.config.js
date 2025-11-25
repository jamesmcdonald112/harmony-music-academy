import * as Sentry from "@sentry/astro";

Sentry.init({
	dsn: "https://e7f574cecec4aef790910d5ec70f93cb@o4510425283231744.ingest.de.sentry.io/4510426322370640",
	// Adds request headers and IP for users, for more info visit:
	// https://docs.sentry.io/platforms/javascript/guides/astro/configuration/options/#sendDefaultPii
	sendDefaultPii: false,

	tracesSampleRate: 0, // disable tracing unless needed
	replaysSessionSampleRate: 0,
	replaysOnErrorSampleRate: 0,

	org: "james-mcdonald",
	project: "javascript-astro-7j",
	authToken: process.env.SENTRY_AUTH_TOKEN,
});
