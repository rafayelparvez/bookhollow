export const MIN_PASSWORD_LENGTH = 6;

/** Register rules: min length + one uppercase + one lowercase letter. */
export function getPasswordError(value: string): string {
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
  }
  if (!/[A-Z]/.test(value)) {
    return "Password must include at least one uppercase letter.";
  }
  if (!/[a-z]/.test(value)) {
    return "Password must include at least one lowercase letter.";
  }
  return "";
}
