import type React from "react";
import { FORM_LIMITS } from "../config/form-limits";
import ErrorSummary from "./ErrorSummary";
import EmailInput from "./inputs/EmailInput";
import FullNameInput from "./inputs/FullNameInput";
import MessageInput from "./inputs/MessageInput";
import PhoneInput from "./inputs/PhoneInput";
import StudentAgeInput from "./inputs/StudentAgeInput";
import SubmitButton from "./SubmitButton";

interface InfoPackFormReactProps {
	errors?: Record<string, string[]>;
	loading?: boolean;
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function InfoPackFormReact({
	errors = {},
	loading = false,
	onSubmit,
}: InfoPackFormReactProps) {
	const MESSAGE_MAX = FORM_LIMITS.message.max;

	return (
		<div className="isolate bg-background px-6 py-24 sm:py-32 lg:px-8">
			<div
				aria-hidden="true"
				className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
			/>

			<div className="mx-auto max-w-2xl text-center">
				<h2 className="text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
					Get Your Lesson Info Pack
				</h2>
				<p className="mt-2 text-lg/8 text-muted-foreground">
					Instant guide with pricing, timetable and next steps.
				</p>
			</div>

			{/* ★ NOW VALID: onSubmit handler in React */}
			<form onSubmit={onSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
				<div className="flex flex-col gap-6">
					<ErrorSummary fieldErrors={errors} />

					<FullNameInput error={errors.fullName?.[0]} />
					<EmailInput error={errors.email?.[0]} />
					<PhoneInput error={errors.phone?.[0]} />
					<StudentAgeInput error={errors.studentAge?.[0]} />
					<MessageInput maxLength={MESSAGE_MAX} error={errors.message?.[0]} />
				</div>

				<div className="mt-10">
					<SubmitButton loading={loading} label="Send Info Pack" />
				</div>
			</form>
		</div>
	);
}
