import { FORM_LIMITS } from "./form-limits";

const {
	fullName: FULL_NAME,
	email: EMAIL,
	studentAge: STUDENT_AGE,
	message: MESSAGE,
} = FORM_LIMITS;

export const INFO_PACK_ERRORS = {
	fullName: {
		min: `Name must be at least ${FULL_NAME.min} characters`,
		max: `Name cannot be more than ${FULL_NAME.max} characters`,
	},
	email: {
		invalid: "Enter a valid email",
		max: `Email must be less than ${EMAIL.max} characters`,
	},
	phone: {
		invalid: "Enter a valid phone number",
	},
	studentAge: {
		invalid: "Age must be a number",
		integer: "Age must be a whole number",
		min: `Age must be at least ${STUDENT_AGE.min}`,
		max: `Age must be less than ${STUDENT_AGE.max}`,
	},
	message: {
		max: `Message must be less than ${MESSAGE.max} characters`,
	},
	action: {
		emailFailed: "We couldn’t send your request. Please try again.",
		forbidden: "Request blocked.",
		internalServerError: "Something went wrong. Please try again later.",
		unknown: "Unexpected error",
	},
};
