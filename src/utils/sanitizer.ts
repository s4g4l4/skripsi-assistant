/**
 * Document Text Sanitizer and Input Boundary Guard
 * Protects against XSS, Null-Byte injections, Buffer overruns, and Malformed text.
 */

export interface SanitizeOptions {
  maxLength?: number;
  allowNewlines?: boolean;
  stripHtml?: boolean;
  normalizeWhitespace?: boolean;
  trim?: boolean;
}

const DEFAULT_SANITIZE_OPTIONS: SanitizeOptions = {
  maxLength: 100000, // 100k chars max
  allowNewlines: true,
  stripHtml: true,
  normalizeWhitespace: false,
  trim: true,
};

/**
 * Sanitizes arbitrary text inputs (prompts, thesis chapters, titles, comments).
 */
export function sanitizeTextInput(input: unknown, options?: SanitizeOptions): string {
  if (input === null || input === undefined) return '';
  let text = typeof input === 'string' ? input : String(input);

  const opts = { ...DEFAULT_SANITIZE_OPTIONS, ...options };

  // 1. Remove Null Bytes and dangerous control characters (keep \r, \n, \t)
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 2. Strip HTML tags and dangerous script handlers if requested
  if (opts.stripHtml) {
    // Remove script / style tags and their inner content
    text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    text = text.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
    
    // Remove remaining HTML tags
    text = text.replace(/<[^>]+>/g, '');
  }

  // 3. Remove inline javascript/data URI protocol strings
  text = text.replace(/javascript\s*:/gi, '');
  text = text.replace(/data\s*:\s*text\/html/gi, '');

  // 4. Normalize Whitespace & Consecutive Newlines
  if (opts.normalizeWhitespace) {
    text = text.replace(/[ \t]+/g, ' ');
  }
  
  if (opts.allowNewlines) {
    // Limit to max 3 consecutive newlines
    text = text.replace(/\n{4,}/g, '\n\n\n');
  } else {
    text = text.replace(/[\r\n]+/g, ' ');
  }

  // 5. Trim leading and trailing whitespace
  if (opts.trim) {
    text = text.trim();
  }

  // 6. Max Length boundary protection
  if (opts.maxLength && opts.maxLength > 0 && text.length > opts.maxLength) {
    text = text.slice(0, opts.maxLength);
  }

  return text;
}

/**
 * Title specific sanitizer (Max 400 chars, no newlines)
 */
export function sanitizeThesisTitle(title: unknown): string {
  return sanitizeTextInput(title, {
    maxLength: 400,
    allowNewlines: false,
    stripHtml: true,
    normalizeWhitespace: true,
    trim: true,
  });
}

/**
 * Abstract specific sanitizer (Max 5,000 chars)
 */
export function sanitizeAbstractText(abstractText: unknown): string {
  return sanitizeTextInput(abstractText, {
    maxLength: 5000,
    allowNewlines: true,
    stripHtml: true,
    normalizeWhitespace: false,
    trim: true,
  });
}

/**
 * Chapter draft specific sanitizer (Max 120,000 chars)
 */
export function sanitizeChapterContent(content: unknown): string {
  return sanitizeTextInput(content, {
    maxLength: 120000,
    allowNewlines: true,
    stripHtml: false, // Keep markdown formatting
    normalizeWhitespace: false,
    trim: true,
  });
}

/**
 * File Name Sanitizer:
 * Removes directory traversal ('../'), dangerous extensions, and invalid chars.
 */
export function sanitizeFileName(fileName: unknown): string {
  if (!fileName || typeof fileName !== 'string') return 'dokumen_skripsi.txt';

  let clean = fileName;

  // 1. Remove path traversal
  clean = clean.replace(/(\.\.[\/\\])+/g, '');
  clean = clean.replace(/[\/\\]+/g, '_');

  // 2. Remove dangerous special characters
  clean = clean.replace(/[:*?"<>|;&$!`]/g, '');

  // 3. Remove illegal control characters
  clean = clean.replace(/[\x00-\x1F\x7F]/g, '');

  // 4. Block executable extensions by appending .txt
  const dangerousExts = /\.(exe|bat|cmd|sh|php|phtml|py|pl|cgi|vbs|msi|bin|jar|com|scr|dll)$/i;
  if (dangerousExts.test(clean)) {
    clean = clean.replace(dangerousExts, '.txt');
  }

  // 5. Trim and cap length
  clean = clean.trim().slice(0, 150);

  return clean || 'dokumen_skripsi.txt';
}

/**
 * Recursively sanitize deep objects / arrays
 */
export function sanitizeDeepPayload<T = any>(data: T): T {
  if (data === null || data === undefined) return data;

  if (typeof data === 'string') {
    return sanitizeTextInput(data) as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeDeepPayload(item)) as unknown as T;
  }

  if (typeof data === 'object') {
    const sanitizedObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      const cleanKey = sanitizeTextInput(key, { maxLength: 100, allowNewlines: false });
      sanitizedObj[cleanKey] = sanitizeDeepPayload(value);
    }
    return sanitizedObj as T;
  }

  return data;
}
