/**
 * Format date string into human-readable format (e.g., Jun 17, 2026)
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Split a comma-separated string of technologies into an array of trimmed strings
 */
export const parseTechStack = (techStackStr) => {
  if (!techStackStr) return [];
  return techStackStr
    .split(',')
    .map(tech => tech.trim())
    .filter(tech => tech.length > 0);
};

/**
 * Validate image files for format and size
 */
export const validateImageFile = (file, maxSizeMB = 5) => {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return 'Invalid file type. Please upload a PNG, JPG, or WebP image.';
  }
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `File size is too large. Max allowed size is ${maxSizeMB}MB.`;
  }
  return null;
};
