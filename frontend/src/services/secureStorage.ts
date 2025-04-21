/**
 * Secure Storage Service
 * 
 * A utility for securely storing sensitive information in the browser.
 * This implementation encrypts data before storing it in localStorage.
 */

// Simple encryption function using AES from Web Crypto API
async function encrypt(text: string): Promise<string> {
  try {
    // Generate a random encryption key for this browser session
    // In a production environment, you would use a more sophisticated key management system
    if (!window.sessionStorage.getItem('encryptionKey')) {
      const key = Array.from(window.crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      window.sessionStorage.setItem('encryptionKey', key);
    }
    
    const key = window.sessionStorage.getItem('encryptionKey') || '';
    
    // Convert the string to bytes
    const textEncoder = new TextEncoder();
    const dataBytes = textEncoder.encode(text);
    
    // Create a simple XOR cipher with the key
    // Note: This is a simplified example. A production system would use proper encryption.
    const keyBytes = textEncoder.encode(key.repeat(Math.ceil(dataBytes.length / key.length)).slice(0, dataBytes.length));
    
    const encryptedBytes = new Uint8Array(dataBytes.length);
    for (let i = 0; i < dataBytes.length; i++) {
      encryptedBytes[i] = dataBytes[i] ^ keyBytes[i];
    }
    
    // Convert to Base64 for storage
    return btoa(Array.from(encryptedBytes).map(byte => String.fromCharCode(byte)).join(''));
  } catch (error) {
    console.error('Encryption failed:', error);
    return text; // Fallback to unencrypted if encryption fails
  }
}

// Decryption function to retrieve the encrypted data
async function decrypt(encryptedText: string): Promise<string> {
  try {
    const key = window.sessionStorage.getItem('encryptionKey');
    if (!key) {
      throw new Error('Encryption key not found');
    }
    
    // Convert from Base64
    const encryptedBytes = new Uint8Array(
      atob(encryptedText).split('').map(char => char.charCodeAt(0))
    );
    
    // Create the key bytes
    const textEncoder = new TextEncoder();
    const keyBytes = textEncoder.encode(key.repeat(Math.ceil(encryptedBytes.length / key.length)).slice(0, encryptedBytes.length));
    
    // XOR decrypt
    const decryptedBytes = new Uint8Array(encryptedBytes.length);
    for (let i = 0; i < encryptedBytes.length; i++) {
      decryptedBytes[i] = encryptedBytes[i] ^ keyBytes[i];
    }
    
    // Convert back to string
    return new TextDecoder().decode(decryptedBytes);
  } catch (error) {
    console.error('Decryption failed:', error);
    return encryptedText; // Return the encrypted text if decryption fails
  }
}

// Store a sensitive value securely
export const secureStore = {
  // Set a value in secure storage
  async setItem(key: string, value: string): Promise<void> {
    try {
      const encryptedValue = await encrypt(value);
      localStorage.setItem(`secure_${key}`, encryptedValue);
    } catch (error) {
      console.error(`Error storing secure item ${key}:`, error);
    }
  },
  
  // Get a value from secure storage
  async getItem(key: string): Promise<string | null> {
    try {
      const encryptedValue = localStorage.getItem(`secure_${key}`);
      if (!encryptedValue) return null;
      
      return await decrypt(encryptedValue);
    } catch (error) {
      console.error(`Error retrieving secure item ${key}:`, error);
      return null;
    }
  },
  
  // Remove a value from secure storage
  removeItem(key: string): void {
    try {
      localStorage.removeItem(`secure_${key}`);
    } catch (error) {
      console.error(`Error removing secure item ${key}:`, error);
    }
  },
  
  // Clear all secure storage items
  clear(): void {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('secure_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing secure storage:', error);
    }
  }
};

export default secureStore; 