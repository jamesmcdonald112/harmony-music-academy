import z from "zod";
import { FORM_LIMITS } from "../config/form-limits";

const {
	fullName: FULL_NAME,
	email: EMAIL,
	phone: PHONE,
	message: MESSAGE,
	studentAge: STUDENT_AGE,
} = FORM_LIMITS;

export const infoPackSchema = z.object({
	fullName: z
		.string()
		.trim()
		.min(FULL_NAME.min, `Name must be at least ${FULL_NAME.min} characters`)
		.max(FULL_NAME.max, `Name cannot exceed ${FULL_NAME.max} characters`),
	email: z
		.string()
		.trim()
		.toLowerCase()
		.email("Enter a valid email")
		.max(EMAIL.max, "Email is too long"),
	phone: z.string().trim().regex(PHONE.regex, "Enter a valid phone number"),
	studentAge: z.coerce
		.number()
		.int("Age must be a whole number")
		.min(STUDENT_AGE.min, `Age must be more than ${STUDENT_AGE.min}`)
		.max(STUDENT_AGE.max, `Age must be less than ${STUDENT_AGE.max}`)
		.optional(),
	message: z.string().trim().max(MESSAGE.max, `Message must be less than ${MESSAGE.max} characters`).optional(),
});
