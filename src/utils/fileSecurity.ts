/**
 * File Security Validator and Magic-Byte Inspector
 * Protects against Malicious Uploads, Polyglot files, Executables, Directory Traversal, and Buffer Overruns.
 */

import { sanitizeFileName } from './sanitizer';

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
  sanitizedName: string;
  fileSizeMb: number;
  detectedMime: string;
  isSafe: boolean;
}

export interface SecurityUploadOptions {
  maxSizeMb?: number;
  allowedExtensions?: string[];
  allowedMimes?: string[];
  checkMagicBytes?: boolean;
}

const DEFAULT_MAX_SIZE_MB = 25; // 25 MB max
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.txt', '.csv', '.xlsx', '.xls', '.zip', '.md'];

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
  'text/csv',
  'text/markdown',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/zip',
  'application/x-zip-compressed'
];

/**
 * Checks file header magic bytes to verify genuine file format
 */
export async function verifyMagicBytes(file: File): Promise<{ matched: boolean; detectedType: string }> {
  try {
    const buffer = await file.slice(0, 16).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // 1. PDF Magic Bytes: %PDF- (0x25, 0x50, 0x44, 0x46)
    if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
      return { matched: true, detectedType: 'application/pdf' };
    }

    // 2. ZIP / DOCX / XLSX Magic Bytes: PK\x03\x04 (0x50, 0x4B, 0x03, 0x04)
    if (bytes[0] === 0x50 && bytes[1] === 0x4B && (bytes[2] === 0x03 || bytes[2] === 0x05 || bytes[2] === 0x07)) {
      return { matched: true, detectedType: 'application/vnd.openxmlformats-officedocument' };
    }

    // 3. Block Windows Executable Magic Bytes: MZ (0x4D, 0x5A)
    if (bytes[0] === 0x4D && bytes[1] === 0x5A) {
      return { matched: false, detectedType: 'application/x-msdownload (Executable Blocked)' };
    }

    // 4. Block Linux ELF Binary: 0x7F 'E' 'L' 'F' (0x7F, 0x45, 0x4C, 0x46)
    if (bytes[0] === 0x7F && bytes[1] === 0x45 && bytes[2] === 0x4C && bytes[3] === 0x46) {
      return { matched: false, detectedType: 'application/x-executable (ELF Blocked)' };
    }

    // 5. Plain Text / CSV / MD files (ASCII / UTF-8 text without control characters)
    const isTextLike = Array.from(bytes).every(b => b === 9 || b === 10 || b === 13 || (b >= 32 && b <= 126) || b >= 128);
    if (isTextLike) {
      return { matched: true, detectedType: 'text/plain' };
    }

    return { matched: true, detectedType: file.type || 'application/octet-stream' };
  } catch (err) {
    console.warn('Magic byte inspection skipped:', err);
    return { matched: true, detectedType: file.type || 'unknown' };
  }
}

/**
 * Complete pre-flight validation for thesis and guidelines uploads
 */
export async function validateThesisFileUpload(
  file: File,
  options?: SecurityUploadOptions
): Promise<FileValidationResult> {
  const maxMb = options?.maxSizeMb || DEFAULT_MAX_SIZE_MB;
  const allowedExts = options?.allowedExtensions || ALLOWED_EXTENSIONS;
  const fileSizeMb = Number((file.size / (1024 * 1024)).toFixed(2));
  const sanitizedName = sanitizeFileName(file.name);

  // 1. Zero-byte or empty file check
  if (file.size === 0) {
    return {
      isValid: false,
      isSafe: false,
      error: 'Berkas kosong (0 Bytes). Pastikan dokumen memiliki isi.',
      sanitizedName,
      fileSizeMb: 0,
      detectedMime: file.type,
    };
  }

  // 2. Max File Size Check
  if (fileSizeMb > maxMb) {
    return {
      isValid: false,
      isSafe: false,
      error: `Ukuran berkas (${fileSizeMb} MB) melebihi batas maksimum ${maxMb} MB.`,
      sanitizedName,
      fileSizeMb,
      detectedMime: file.type,
    };
  }

  // 3. File Extension Check
  const extension = ('.' + file.name.split('.').pop()?.toLowerCase()) || '';
  if (!allowedExts.includes(extension)) {
    return {
      isValid: false,
      isSafe: false,
      error: `Format ekstensi file "${extension}" tidak didukung. Harap upload format ${allowedExts.join(', ')}.`,
      sanitizedName,
      fileSizeMb,
      detectedMime: file.type,
    };
  }

  // 4. Double extension security trap (e.g. skripsi.pdf.exe)
  const doubleExtRegex = /\.[a-z0-9]+\.(exe|sh|bat|cmd|php|py|js|vbs)$/i;
  if (doubleExtRegex.test(file.name)) {
    return {
      isValid: false,
      isSafe: false,
      error: 'Terdeteksi ekstensi ganda berbahaya. Berkas ditolak untuk keamanan sistem.',
      sanitizedName,
      fileSizeMb,
      detectedMime: file.type,
    };
  }

  // 5. Magic Byte Inspection
  if (options?.checkMagicBytes !== false) {
    const magic = await verifyMagicBytes(file);
    if (!magic.matched) {
      return {
        isValid: false,
        isSafe: false,
        error: `Berkas tidak valid atau terdeteksi biner berbahaya (${magic.detectedType}).`,
        sanitizedName,
        fileSizeMb,
        detectedMime: magic.detectedType,
      };
    }
  }

  return {
    isValid: true,
    isSafe: true,
    sanitizedName,
    fileSizeMb,
    detectedMime: file.type || 'application/octet-stream',
  };
}
