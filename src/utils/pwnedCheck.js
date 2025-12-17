/**
 * Check if a password has been exposed in data breaches using HaveIBeenPwned API
 * @param {string} password - The password to check
 * @returns {Promise<{isPwned: boolean, count: number}>} - Result object
 */
export const checkPasswordPwned = async (password) => {
  try {
    // Don't check empty passwords
    if (!password || password.trim() === '') {
      return { isPwned: false, count: 0 };
    }

    // Hash the password with SHA-1 using Web Crypto API
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', passwordData);
    
    // Convert buffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const sha1Hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    
    // Use k-Anonymity: Send only first 5 characters of hash
    const hashPrefix = sha1Hash.substring(0, 5);
    const hashSuffix = sha1Hash.substring(5);
    
    // Query HaveIBeenPwned API
    const response = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`, {
      method: 'GET',
      headers: {
        'Add-Padding': 'true', // Add padding for additional privacy
      },
    });
    
    if (!response.ok) {
      return { isPwned: false, count: 0, error: true };
    }
    
    const responseText = await response.text();
    
    // Parse response - each line is "SUFFIX:COUNT"
    const lines = responseText.split('\n');
    for (const line of lines) {
      const [suffix, count] = line.split(':');
      if (suffix === hashSuffix) {
        return { 
          isPwned: true, 
          count: parseInt(count, 10),
          severity: getSeverity(parseInt(count, 10))
        };
      }
    }
    
    // Password not found in breaches
    return { isPwned: false, count: 0 };
  } catch (error) {
    return { isPwned: false, count: 0, error: true };
  }
};

/**
 * Get severity level based on breach count
 * @param {number} count - Number of times password was seen in breaches
 * @returns {string} - Severity level
 */
const getSeverity = (count) => {
  if (count > 100000) return 'critical';
  if (count > 10000) return 'high';
  if (count > 1000) return 'medium';
  return 'low';
};

/**
 * Format breach count for display
 * @param {number} count - Number of times password was seen
 * @returns {string} - Formatted string
 */
export const formatBreachCount = (count) => {
  if (count > 1000000) {
    return `${(count / 1000000).toFixed(1)}M+ times`;
  }
  if (count > 1000) {
    return `${(count / 1000).toFixed(1)}K+ times`;
  }
  return `${count} times`;
};
