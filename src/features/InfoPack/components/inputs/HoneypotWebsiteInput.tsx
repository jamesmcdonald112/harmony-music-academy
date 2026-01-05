import { Input } from "@/components/ui/Input";

export default function HoneypotWebsiteInput() {
	return (
		<div
			aria-hidden="true"
			className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
		>
			<div className="form-field">
				<Input
					id="website"
					name="website"
					type="text"
					tabIndex={-1}
					autoComplete="new-password"
				/>
			</div>
		</div>
	);
}
