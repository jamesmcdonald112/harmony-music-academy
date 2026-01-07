import { Resend } from "resend";
import { escapeHtml } from "@/lib/escapeHtml";
import { parseEmailList } from "@/lib/parseEmailList";

type DeliverInput = {
	fullName: string;
	email: string;
	phone: string;
	studentAge?: number;
	message?: string;
};

export async function deliverInfoPack(input: DeliverInput): Promise<void> {
	const env = { ...import.meta.env, ...process.env };
	const apiKey = env.RESEND_API_KEY;
	if (!apiKey) throw new Error("Missing RESEND_API_KEY");

	// Config (per site / per client)
	const rawToEmails = env.INFO_PACK_TO_EMAIL ?? "";
	const rawFromEmail =
		env.INFO_PACK_FROM ?? "Harmony Music Academy <info@harmonymusicacademy.ie>";
	const rawFallbackReplyTo = env.INFO_PACK_REPLY_TO ?? undefined;

	const toEmails = parseEmailList(rawToEmails);
	if (toEmails.length === 0) throw new Error("Missing INFO_PACK_TO_EMAIL");

	// When YOU receive the email, you want Reply on your email client to go to the lead.
	// So replyTo should be the submitter's email (fallback to your site inbox if needed).
	const replyToEmail = input.email?.trim() || rawFallbackReplyTo;
	if (!replyToEmail)
		throw new Error("Missing INFO_PACK_REPLY_TO (and input email was empty)");

	// Escape all user-controlled fields before injecting into HTML.
	const safeName = escapeHtml(input.fullName);
	const safeEmail = escapeHtml(input.email);
	const safePhone = escapeHtml(input.phone);
	const safeAge = escapeHtml(
		input.studentAge != null ? String(input.studentAge) : "N/A",
	);
	const safeMessageText = escapeHtml(input.message ?? "N/A");
	// Convert newlines AFTER escaping so <br/> stays real HTML.
	const safeMessageHtml = safeMessageText.replaceAll("\n", "<br/>");

	// Subjects are headers, not HTML. Strip newlines to avoid header injection.
	const subjectName = input.fullName.replace(/[\r\n]+/g, " ").trim();

	const resend = new Resend(apiKey);

	const { error } = await resend.emails.send({
		from: rawFromEmail,
		replyTo: replyToEmail,
		to: toEmails,
		subject: `Info Pack Request — ${subjectName}`,
		html: `
      <h2>New Info Pack request</h2>
      <p><b>Name:</b> ${safeName}</p>
      <p><b>Email:</b> ${safeEmail}</p>
      <p><b>Phone:</b> ${safePhone}</p>
      <p><b>Student age:</b> ${safeAge}</p>
      <p><b>Message:</b><br/>${safeMessageHtml}</p>
    `,
	});

	if (error) throw new Error(`Resend error: ${error.message}`);
}
