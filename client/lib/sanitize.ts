/**
 * Sanitize HTML to prevent XSS attacks
 * Removes dangerous HTML tags and attributes
 */
export function sanitizeHtml(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Sanitize plain text input
 * Removes potentially dangerous characters while preserving basic text
 */
export function sanitizeText(input: string): string {
  // Remove null bytes
  let sanitized = input.replace(/\0/g, '');

  // Remove control characters except newlines and tabs
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * Sanitize URL to prevent javascript: and data: protocols
 */
export function sanitizeUrl(input: string): string {
  try {
    const url = new URL(input);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      return '';
    }
    return url.toString();
  } catch {
    // If it's not a valid URL, return empty string
    return '';
  }
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(input: string): string {
  const sanitized = sanitizeText(input).toLowerCase();
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized) ? sanitized : '';
}

/**
 * Sanitize filename to prevent directory traversal attacks
 */
export function sanitizeFilename(input: string): string {
  // Remove path separators and null bytes
  let sanitized = input.replace(/[\/\\:\*\?"<>\|]/g, '_');
  sanitized = sanitized.replace(/\0/g, '');

  // Remove leading/trailing dots and spaces
  sanitized = sanitized.replace(/^[\s.]+|[\s.]+$/g, '');

  // Limit length
  if (sanitized.length > 255) {
    sanitized = sanitized.substring(0, 255);
  }

  return sanitized || 'file';
}

/**
 * Validate and sanitize JSON input
 */
export function sanitizeJSON(input: string): Record<string, any> | null {
  try {
    // Try to parse the JSON
    const parsed = JSON.parse(input);

    // Ensure it's an object
    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Sanitize a complete job application object
 */
export function sanitizeJobApplication(app: Record<string, any>) {
  return {
    company: sanitizeText(app.company || ''),
    jobRole: sanitizeText(app.jobRole || ''),
    status: app.status, // Already validated by schema
    notes: sanitizeText(app.notes || ''),
    salary: sanitizeText(app.salary || ''),
    jobUrl: sanitizeUrl(app.jobUrl || ''),
    applicationDate: app.applicationDate, // Already validated by schema
    lastUpdated: app.lastUpdated, // Already validated by schema
    interviewDate: app.interviewDate, // Already validated by schema
    resumeId: app.resumeId, // Already validated
  };
}

/**
 * Sanitize search input
 */
export function sanitizeSearchInput(input: string): string {
  // Remove special characters that could be used in attacks
  let sanitized = input.replace(/[<>:"/\\|?*]/g, '');
  sanitized = sanitizeText(sanitized);
  // Limit length
  return sanitized.substring(0, 100);
}
