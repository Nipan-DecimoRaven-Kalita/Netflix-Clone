export const nameRegex = /^[a-zA-Z\s]+$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
export const passwordRegex = {
  length: /.{8,}/,
  upper: /[A-Z]/,
  number: /[0-9]/,
  special: /[!@#$%^&*(),.?":{}|<>]/,
};

export function validateName(name) {
  if (!name || name.length < 2) return 'Name must be at least 2 characters';
  if (!nameRegex.test(name)) return 'Name must contain only letters';
  return null;
}

export function validateEmail(email) {
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Enter a valid email';
  return null;
}

export function validateUsername(username) {
  if (!username) return 'Username is required';
  if (username.length < 3 || username.length > 20) return 'Username must be 3-20 characters';
  if (/\s/.test(username)) return 'No spaces allowed';
  if (!usernameRegex.test(username)) return 'Use only letters, numbers, _ and -';
  return null;
}

export function getPasswordStrength(password) {
  if (!password) return { level: 0, label: '', tips: [] };
  const tips = [];
  if (password.length < 8) tips.push('At least 8 characters');
  if (!passwordRegex.upper.test(password)) tips.push('One uppercase letter');
  if (!passwordRegex.number.test(password)) tips.push('One number');
  if (!passwordRegex.special.test(password)) tips.push('One special character');
  const met = 4 - tips.length;
  let level = 0;
  let label = 'Weak';
  if (met === 4) {
    level = 100;
    label = 'Strong';
  } else if (met >= 3) {
    level = 66;
    label = 'Medium';
  } else if (met >= 1) {
    level = 33;
    label = 'Weak';
  }
  return { level, label, tips };
}

export function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be 8+ characters';
  if (!passwordRegex.upper.test(password)) return 'At least one uppercase letter';
  if (!passwordRegex.number.test(password)) return 'At least one number';
  if (!passwordRegex.special.test(password)) return 'At least one special character';
  return null;
}
