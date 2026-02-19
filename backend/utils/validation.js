export function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>\"'`;]/g, '')
    .trim()
    .slice(0, 500);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
}

export function isValidPassword(password) {
  return PASSWORD_REGEX.test(password);
}

export function validateRegister({ username, email, name, password }) {
  const errors = [];
  const u = sanitize(username);
  const e = sanitize(email);
  const n = sanitize(name);

  if (!u || u.length < 3) errors.push('Username must be at least 3 characters');
  if (!e) errors.push('Email is required');
  else if (!isValidEmail(e)) errors.push('Invalid email format');
  if (!n || n.length < 2) errors.push('Full name must be at least 2 characters');
  if (!password || !isValidPassword(password))
    errors.push('Password must be 8+ chars with uppercase, number, and special character (@$!%*?&)');

  return { valid: errors.length === 0, errors, data: { username: u, email: e, name: n } };
}

export function validateLogin({ email, password }) {
  const errors = [];
  const e = sanitize(email);
  if (!e) errors.push('Email is required');
  else if (!isValidEmail(e)) errors.push('Invalid email format');
  if (!password || password.length < 1) errors.push('Password is required');
  return { valid: errors.length === 0, errors, data: { email: e } };
}
