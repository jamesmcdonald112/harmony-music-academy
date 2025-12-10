export const FORM_LIMITS = {
	fullName: {
		min: 2,
		max: 80,
	},
	email: {
		max: 254, // optional but realistic
	},
	phone: {
		regex: /^[0-9+\-\s()]{5,20}$/,
	},
	message: {
		max: 1000,
	},
	studentAge: {
		min: 1,
		max: 120,
	},
};
