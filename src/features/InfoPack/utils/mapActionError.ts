import { INFO_PACK_ERRORS } from "../config/error-messages";

const ACTION_ERROR_MESSAGES: Record<string, string> = {
	EMAIL_FAILED: INFO_PACK_ERRORS.action.emailFailed,
	INTERNAL_SERVER_ERROR: INFO_PACK_ERRORS.action.internalServerError,
};

export function mapActionError(code: string): string {
	return ACTION_ERROR_MESSAGES[code] ?? INFO_PACK_ERRORS.action.unknown;
}
