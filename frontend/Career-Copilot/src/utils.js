// Utility functions for Career Copilot

/**
 * Convert a File object to base64 string (without data: prefix)
 * @param {File} file - The file to convert
 * @returns {Promise<string>} Base64 encoded string
 */
export const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the "data:image/...;base64," prefix
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * API base URL for all backend calls
 */
export const API_BASE = 'https://3thpmphful.execute-api.us-east-1.amazonaws.com/prod';
