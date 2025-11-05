/**
 * Password Generator Utility
 * Generates secure random passwords with customizable options
 */

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

/**
 * Generate a random password
 * @param {Object} options - Password generation options
 * @param {number} options.length - Length of the password (default: 16)
 * @param {boolean} options.uppercase - Include uppercase letters (default: true)
 * @param {boolean} options.lowercase - Include lowercase letters (default: true)
 * @param {boolean} options.numbers - Include numbers (default: true)
 * @param {boolean} options.symbols - Include symbols (default: true)
 * @returns {string} Generated password
 */
export const generatePassword = (options = {}) => {
  const {
    length = 16,
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = true,
  } = options;

  // Build character set based on options
  let charset = '';
  const requiredChars = [];

  if (lowercase) {
    charset += LOWERCASE;
    requiredChars.push(LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)]);
  }
  if (uppercase) {
    charset += UPPERCASE;
    requiredChars.push(UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)]);
  }
  if (numbers) {
    charset += NUMBERS;
    requiredChars.push(NUMBERS[Math.floor(Math.random() * NUMBERS.length)]);
  }
  if (symbols) {
    charset += SYMBOLS;
    requiredChars.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
  }

  // Ensure we have at least one character set
  if (charset === '') {
    charset = LOWERCASE + UPPERCASE + NUMBERS + SYMBOLS;
  }

  // Generate remaining characters
  const remainingLength = length - requiredChars.length;
  let password = '';

  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  // Add required characters
  password += requiredChars.join('');

  // Shuffle the password to randomize position of required characters
  password = password.split('').sort(() => Math.random() - 0.5).join('');

  return password;
};

/**
 * Calculate password strength
 * @param {string} password - Password to evaluate
 * @returns {Object} Strength info with score (0-4) and label
 */
export const calculatePasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'None', color: 'gray' };

  let score = 0;
  const length = password.length;

  // Length scoring
  if (length >= 8) score++;
  if (length >= 12) score++;
  if (length >= 16) score++;

  // Character variety scoring
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  // Cap at 4
  score = Math.min(score, 4);

  const strengthMap = {
    0: { label: 'Very Weak', color: 'red' },
    1: { label: 'Weak', color: 'orange' },
    2: { label: 'Fair', color: 'yellow' },
    3: { label: 'Good', color: 'green' },
    4: { label: 'Strong', color: 'green' },
  };

  return { score, ...strengthMap[score] };
};
