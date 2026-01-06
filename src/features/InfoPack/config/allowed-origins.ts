export function getAllowedOrigins(): Set<string> {
	const rawAllowedOrigins =
		import.meta.env.ALLOWED_ORIGINS ?? process.env.ALLOWED_ORIGINS ?? "";
	return new Set(
		rawAllowedOrigins
			.split(",")
			.map((s: string) => s.trim())
			.filter(Boolean),
	);
}

export function hasAllowedOriginsConfigured(): boolean {
	return getAllowedOrigins().size > 0;
}

export function isAllowedOrigin(origin: string | null): boolean {
	if (!origin) return false;
	return getAllowedOrigins().has(origin);
}
