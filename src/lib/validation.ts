/**
 * Validate email format
 */
export function validateEmail(email: string): string | null {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }
  return null;
}

/**
 * Validate password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one number
 */
export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!/\d/.test(password)) {
    return "Password must contain at least one number";
  }

  return null;
}

/**
 * Get password strength indicator
 * Returns 0-4 (weak to very strong)
 */
export function getPasswordStrength(password: string): number {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) strength++;

  return Math.min(strength, 4);
}

/**
 * Get password strength label
 */
export function getPasswordStrengthLabel(strength: number): string {
  const labels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
  return labels[strength] || "Weak";
}

/**
 * Validate name
 */
export function validateName(name: string): string | null {
  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return "Name is required";
  }

  if (trimmed.length < 2) {
    return "Name must be at least 2 characters";
  }

  if (trimmed.length > 50) {
    return "Name must be less than 50 characters";
  }

  if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
    return "Name can only contain letters, spaces, hyphens, and apostrophes";
  }

  return null;
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}

/**
 * Validate all signup inputs at once
 */
export function validateSignup(
  email: string,
  password: string,
  passwordConfirm: string,
  name: string
): Record<string, string> {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const nameError = validateName(name);
  if (nameError) errors.name = nameError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  if (password !== passwordConfirm) {
    errors.passwordConfirm = "Passwords do not match";
  }

  return errors;
}

/**
 * Validate login inputs
 */
export function validateLogin(
  email: string,
  password: string
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!email) {
    errors.email = "Email is required";
  } else {
    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
}
