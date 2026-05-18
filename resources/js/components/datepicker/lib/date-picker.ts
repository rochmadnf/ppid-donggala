// lib/date-picker.utils.ts

import dayjs, { type Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isToday from 'dayjs/plugin/isToday';
import localeData from 'dayjs/plugin/localeData';

// Register plugins once at module level
dayjs.extend(customParseFormat);
dayjs.extend(isToday);
dayjs.extend(localeData);

// ─── Constants ────────────────────────────────────────────────────────────────

/** Default display/parse format */
export const DEFAULT_FORMAT = 'DD-MM-YYYY';

/**
 * Formats that are attempted as fallback when strict parsing fails.
 * Ordered from most-specific to least.
 */
const FALLBACK_FORMATS = [
  'DD-MM-YYYY',
  'YYYY-MM-DD',
  'DD/MM/YYYY',
  'MM/DD/YYYY',
  'MMMM D, YYYY',
  'D MMMM YYYY',
  'YYYY-MM-DDTHH:mm:ss',
  'YYYY-MM-DDTHH:mm:ssZ',
] as const;

// ─── Parsing ──────────────────────────────────────────────────────────────────

/**
 * Try to parse a string value using the primary format first,
 * then fallback formats. Returns null if none succeed or if the
 * parsed date is not a real calendar date (e.g. 31-02-2025).
 */
export function parseDate(
  raw: string | undefined | null,
  format: string = DEFAULT_FORMAT,
): Dayjs | null {
  if (!raw || raw.trim() === '') return null;

  const trimmed = raw.trim();

  // 1. Strict parse with the configured format
  const strict = dayjs(trimmed, format, true);
  if (strict.isValid()) return strict;

  // 2. Try fallback formats (strict)
  for (const fmt of FALLBACK_FORMATS) {
    if (fmt === format) continue; // already tried
    const attempt = dayjs(trimmed, fmt, true);
    if (attempt.isValid()) return attempt;
  }

  // 3. Native Date object string (ISO, etc.)
  const native = dayjs(trimmed);
  if (native.isValid()) return native;

  return null;
}

/**
 * Parse a value that may be a string OR native Date.
 */
export function parseDateValue(
  value: string | Date | undefined | null,
  format: string = DEFAULT_FORMAT,
): Dayjs | null {
  if (!value) return null;

  if (value instanceof Date) {
    const d = dayjs(value);
    return d.isValid() ? d : null;
  }

  return parseDate(value, format);
}

// ─── Formatting ───────────────────────────────────────────────────────────────

/**
 * Format a Day.js instance to string using the configured format.
 * Returns empty string if the value is null/invalid.
 */
export function formatDate(
  date: Dayjs | null | undefined,
  format: string = DEFAULT_FORMAT,
): string {
  if (!date || !date.isValid()) return '';
  return date.format(format);
}

// ─── Validation ───────────────────────────────────────────────────────────────

export type ValidationResult =
  | { valid: true }
  | { valid: false; reason: 'empty' | 'incomplete' | 'invalid_date' | 'impossible_date' | 'out_of_range' };

/**
 * Full validation pipeline for a raw input string.
 *
 * @param raw      - Raw text from the <input>
 * @param format   - Expected Day.js format
 * @param minDate  - Optional lower bound (inclusive)
 * @param maxDate  - Optional upper bound (inclusive)
 */
export function validateDateInput(
  raw: string,
  format: string = DEFAULT_FORMAT,
  minDate?: Date,
  maxDate?: Date,
): ValidationResult {
  if (!raw || raw.trim() === '') return { valid: false, reason: 'empty' };

  const trimmed = raw.trim();

  // Check if input looks "complete" by comparing length with the format
  // For textual formats like "MMMM D, YYYY" we skip length check
  const isNumericFormat = !format.includes('MMM');
  if (isNumericFormat) {
    const expectedLength = format.replace(/[^DMY]/g, '').length + (format.match(/[^DMY]/g)?.length ?? 0);
    if (trimmed.replace(/\s/g, '').length < expectedLength - 1) {
      return { valid: false, reason: 'incomplete' };
    }
  }

  const parsed = dayjs(trimmed, format, true); // strict

  if (!parsed.isValid()) {
    return { valid: false, reason: 'invalid_date' };
  }

  // Impossible date check: Day.js in strict mode already rejects these,
  // but double-check month/day overflow just in case.
  const isImpossible =
    parsed.month() !== dayjs(trimmed, format, false).month() ||
    parsed.date() !== dayjs(trimmed, format, false).date();

  if (isImpossible) {
    return { valid: false, reason: 'impossible_date' };
  }

  // Range check
  if (minDate) {
    const min = dayjs(minDate).startOf('day');
    if (parsed.isBefore(min)) {
      return { valid: false, reason: 'out_of_range' };
    }
  }

  if (maxDate) {
    const max = dayjs(maxDate).endOf('day');
    if (parsed.isAfter(max)) {
      return { valid: false, reason: 'out_of_range' };
    }
  }

  return { valid: true };
}

/**
 * Human-readable error message from a ValidationResult reason.
 */
export function getValidationMessage(
  result: ValidationResult,
  format: string = DEFAULT_FORMAT,
): string {
  if (result.valid) return '';

  switch (result.reason) {
    case 'empty':
      return 'Tanggal wajib diisi.';
    case 'incomplete':
      return `Format tidak lengkap. Gunakan: ${format}`;
    case 'invalid_date':
      return `Tanggal tidak valid. Format yang benar: ${format}`;
    case 'impossible_date':
      return 'Tanggal tidak ada dalam kalender (misal: 31 Februari).';
    case 'out_of_range':
      return 'Tanggal di luar rentang yang diizinkan.';
    default:
      return 'Tanggal tidak valid.';
  }
}

// ─── Output helpers ───────────────────────────────────────────────────────────

/**
 * Build the value passed to `onChange` based on `returnType`.
 */
export function buildOutputValue(
  date: Dayjs | null,
  format: string,
  returnType: 'string' | 'date',
): string | Date | undefined {
  if (!date) return undefined;

  if (returnType === 'date') return date.toDate();
  return date.format(format);
}

// ─── Date range helpers ───────────────────────────────────────────────────────

export function isDateDisabled(
  date: Dayjs,
  minDate?: Date,
  maxDate?: Date,
): boolean {
  if (minDate && date.isBefore(dayjs(minDate).startOf('day'))) return true;
  if (maxDate && date.isAfter(dayjs(maxDate).endOf('day'))) return true;
  return false;
}
