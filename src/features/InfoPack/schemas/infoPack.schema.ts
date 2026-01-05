import z from "zod";
import { INFO_PACK_ERRORS } from "../config/error-messages";
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
		.min(FULL_NAME.min, INFO_PACK_ERRORS.fullName.min)
		.max(FULL_NAME.max, INFO_PACK_ERRORS.fullName.max),
	email: z
		.string()
		.trim()
		.toLowerCase()
		.email(INFO_PACK_ERRORS.email.invalid)
		.max(EMAIL.max, INFO_PACK_ERRORS.email.max),
	phone: z.string().trim().regex(PHONE.regex, INFO_PACK_ERRORS.phone.invalid),
	studentAge: z.coerce
		.number()
		.int(INFO_PACK_ERRORS.studentAge.integer)
		.min(STUDENT_AGE.min, INFO_PACK_ERRORS.studentAge.min)
		.max(STUDENT_AGE.max, INFO_PACK_ERRORS.studentAge.max)
		.optional(),
	message: z
		.string()
		.trim()
		.max(MESSAGE.max, INFO_PACK_ERRORS.message.max)
		.optional(),
	website: z
		.string()
		.trim()
		.nullable()
		.optional()
		.transform((v) => v ?? ""),
});
