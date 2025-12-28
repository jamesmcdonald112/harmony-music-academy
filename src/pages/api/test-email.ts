export const prerender = false;

import type { APIRoute } from "astro";
import { Resend } from "resend";

export const POST: APIRoute = async ({ request }) => {
	const apiKey = import.meta.env.RESEND_API_KEY;
	const adminToken = import.meta.env.ADMIN_TEST_TOKEN;

	if (!apiKey || !adminToken) return new Response("Server misconfigured", { status: 500 });

	// Admin-only test endpoint: requires x-admin-token header to prevent public abuse.
	const token = request.headers.get("x-admin-token");
	if (!token) return new Response("Unauthorized", { status: 401 });
	if (token !== adminToken) return new Response("Forbidden", { status: 403 });

	try {
		const resend = new Resend(apiKey);
		const { error } = await resend.emails.send({
			from: "Music School Sites <info@musicschoolsites.com>", // must be a verified sender/domain in Resend
			replyTo: "info@musicschoolsites.com",
			to: ["jamesmcdonaldmusic112@gmail.com"], // put your test address here
			subject: "Resend test",
			html: "<strong>It works.</strong>",
		});

		if (error) return new Response("Email failed", { status: 500 });
		return new Response("OK", { status: 200 });
	} catch {
		return new Response("Email failed", { status: 500 });
	}
};

// Optional: reject other methods explicitly
export const GET: APIRoute = async () => {
	return new Response("Method Not Allowed", {
		status: 405,
		headers: { Allow: "POST" },
	});
};
