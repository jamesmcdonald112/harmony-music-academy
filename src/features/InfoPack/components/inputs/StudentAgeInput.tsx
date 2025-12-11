import { FORM_LIMITS } from "../../config/form-limits";
import { INFO_PACK_PLACEHOLDERS } from "../../config/placeholders";
import FormError from "./FormError";

const { min, max } = FORM_LIMITS.studentAge;

interface StudentAgeInputProps {
	error?: string;
}

export default function StudentAgeInput({ error }: StudentAgeInputProps) {
	const inputClass = `form-input${error ? " form-input-error" : ""}`;

	return (
		<div>
			<label htmlFor="studentAge" className="form-label">
				Student age (optional)
			</label>
			<div className="form-field">
				<input
					className={inputClass}
					id="studentAge"
					name="studentAge"
					type="number"
					min={min}
					max={max}
					inputMode="numeric"
					autoComplete="off"
					placeholder={INFO_PACK_PLACEHOLDERS.studentAge}
					aria-invalid={!!error}
					aria-describedby={error ? "studentAge-error" : undefined}
				/>
			</div>

			<FormError id="studentAge-error" error={error} />
		</div>
	);
}
