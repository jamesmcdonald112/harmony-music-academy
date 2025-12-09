import type { z } from "zod";
import type { infoPackSchema } from "../schemas/infoPack.schema";

export type InfoPackFormInput = z.infer<typeof infoPackSchema>;

export type InfoPackFormErrors = {
	fullName?: string[];
	email?: string[];
	phone?: string[];
	studentAge?: string[];
	message?: string[];
};
