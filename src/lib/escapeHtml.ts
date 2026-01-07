export function escapeHtml(value: string): string {
	// Minimal HTML escaping to prevent injected markup/scripts in email body.
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}
