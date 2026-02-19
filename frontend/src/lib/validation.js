const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export function isValidEmail(email) {
  return EMAIL_REGEX.test(email || '');
}

export function isValidPassword(password) {
  return PASSWORD_REGEX.test(password || '');
}

export function getPasswordErrors(password) {
  const errors = [];
  if (!password || password.length < 8) errors.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
  if (!/\d/.test(password)) errors.push('One number');
  if (!/[@$!%*?&]/.test(password)) errors.push('One special character (@$!%*?&)');
  return errors;
}
