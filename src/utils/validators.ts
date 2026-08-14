/**
 * Defensive Data Structure Validators and Null-Safe Accessors
 * Prevents runtime "Cannot read properties of undefined / null" across the entire application.
 */

import { sanitizeTextInput, sanitizeThesisTitle } from './sanitizer';

/**
 * Safely access nested properties without throwing TypeError.
 * Example: safeGet(project, 'chapters.0.content', '')
 */
export function safeGet<T>(obj: any, path: string, fallback: T): T {
  if (obj === null || obj === undefined) return fallback;

  const keys = path.split('.');
  let current: any = obj;

  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return fallback;
    }
    current = current[key];
  }

  return current !== undefined && current !== null ? (current as T) : fallback;
}

/**
 * Guarantees that value is a valid array, otherwise returns fallback.
 */
export function ensureArray<T>(val: any, fallback: T[] = []): T[] {
  if (Array.isArray(val)) {
    return val;
  }
  return fallback;
}

/**
 * Guarantees that value is a non-null string, trimmed if requested.
 */
export function ensureString(val: any, fallback = ''): string {
  if (typeof val === 'string') {
    return val;
  }
  if (val !== null && val !== undefined && typeof val.toString === 'function') {
    return val.toString();
  }
  return fallback;
}

/**
 * Guarantees that value is a finite number, otherwise returns fallback.
 */
export function ensureNumber(val: any, fallback = 0): number {
  if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
    return val;
  }
  if (typeof val === 'string') {
    const parsed = Number(val);
    if (!isNaN(parsed) && isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

/**
 * Guarantees that value is a valid object and not null or array.
 */
export function ensureObject<T extends Record<string, any>>(val: any, fallback: T = {} as T): T {
  if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
    return val as T;
  }
  return fallback;
}

/**
 * Guarantees that value is a valid boolean.
 */
export function ensureBoolean(val: any, fallback = false): boolean {
  if (typeof val === 'boolean') {
    return val;
  }
  if (val === 'true' || val === 1 || val === '1') return true;
  if (val === 'false' || val === 0 || val === '0') return false;
  return fallback;
}

// -------------------------------------------------------------
// SCHEMAS & ENTITY VALIDATORS
// -------------------------------------------------------------

export interface ValidatedUserProject {
  id: string;
  title: string;
  universityName: string;
  facultyName: string;
  studyProgram: string;
  documentType: string;
  status: string;
  progress: number;
  updatedAt: string;
  createdAt: string;
  userEmail: string;
  chapters: Array<{ id: string; title: string; content: string }>;
  citations: any[];
}

/**
 * Validates and sanitizes a User Project object
 */
export function validateUserProject(input: any): ValidatedUserProject {
  const safeObj = ensureObject(input);
  const now = new Date().toISOString();

  return {
    id: ensureString(safeObj.id, 'proj_' + Math.random().toString(36).substring(2, 9)),
    title: sanitizeThesisTitle(ensureString(safeObj.title, 'Draf Skripsi Tanpa Judul')),
    universityName: sanitizeTextInput(ensureString(safeObj.universityName, 'Universitas Indonesia'), { maxLength: 150 }),
    facultyName: sanitizeTextInput(ensureString(safeObj.facultyName, 'Fakultas Ilmu Komputer'), { maxLength: 150 }),
    studyProgram: sanitizeTextInput(ensureString(safeObj.studyProgram, 'Teknik Informatika'), { maxLength: 150 }),
    documentType: ensureString(safeObj.documentType, 'Skripsi (S1)'),
    status: ensureString(safeObj.status, 'Draf Bab'),
    progress: Math.min(100, Math.max(0, ensureNumber(safeObj.progress, 15))),
    updatedAt: ensureString(safeObj.updatedAt, now),
    createdAt: ensureString(safeObj.createdAt, now),
    userEmail: ensureString(safeObj.userEmail, 'user@example.com'),
    chapters: ensureArray(safeObj.chapters).map((ch: any, idx: number) => ({
      id: ensureString(ch?.id, `chap_${idx + 1}`),
      title: ensureString(ch?.title, `Bab ${idx + 1}`),
      content: ensureString(ch?.content, ''),
    })),
    citations: ensureArray(safeObj.citations),
  };
}

/**
 * Validates Citation Items
 */
export function validateCitation(input: any) {
  const obj = ensureObject(input);
  return {
    id: ensureString(obj.id, 'cit_' + Math.random().toString(36).substring(2, 9)),
    title: sanitizeTextInput(ensureString(obj.title, 'Judul Referensi'), { maxLength: 300 }),
    authors: ensureArray(obj.authors).map(a => ensureString(a)),
    authorString: ensureString(obj.authorString, 'Penulis Akademik'),
    year: ensureNumber(obj.year, new Date().getFullYear()),
    source: ensureString(obj.source, 'Jurnal Ilmiah'),
    doi: ensureString(obj.doi, ''),
    url: ensureString(obj.url, ''),
    abstract: ensureString(obj.abstract, ''),
    isOpenAccess: ensureBoolean(obj.isOpenAccess, false),
  };
}

/**
 * Generic validator helper export
 */
export const validateInput = (input: any): boolean => {
  return input !== null && input !== undefined && String(input).trim().length > 0;
};
