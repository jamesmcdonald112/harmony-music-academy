export const prerender = false;

import type { APIRoute } from "astro";
import { Resend } from "resend";

export const POST: APIRoute = async () => {
	const apiKey = import.meta.env.RESEND_API_KEY;
	if (!apiKey) return new Response("Missing RESEND_API_KEY", { status: 500 });

	const resend = new Resend(apiKey);

	const { error } = await resend.emails.send({
		from: "Music School Sites <info@musicschoolsites.com>", // must be a verified sender/domain in Resend
		to: ["jamesmcdonaldmusic112@gmail.com"], // put your test address here
		subject: "Resend test",
		html: "<strong>It works.</strong>",
	});

	if (error) return new Response(JSON.stringify(error), { status: 500 });
	return new Response("Sent", { status: 200 });
};
