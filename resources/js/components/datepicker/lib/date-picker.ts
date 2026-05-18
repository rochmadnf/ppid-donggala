// lib/date-picker.ts

import dayjs, { type Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isToday from 'dayjs/plugin/isToday';
import localeData from 'dayjs/plugin/localeData';

dayjs.extend(customParseFormat);
dayjs.extend(isToday);
dayjs.extend(localeData);

// ─── Constants ────────────────────────────────────────────────────────────────

export const DEFAULT_FORMAT = 'DD-MM-YYYY';

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

export function parseDate(raw: string | undefined | null, format: string = DEFAULT_FORMAT): Dayjs | null {
    if (!raw || raw.trim() === '') return null;

    const trimmed = raw.trim();

    const strict = dayjs(trimmed, format, true);
    if (strict.isValid()) return strict;

    for (const fmt of FALLBACK_FORMATS) {
        if (fmt === format) continue;
        const attempt = dayjs(trimmed, fmt, true);
        if (attempt.isValid()) return attempt;
    }

    const native = dayjs(trimmed);
    if (native.isValid()) return native;

    return null;
}

export function parseDateValue(value: string | Date | undefined | null, format: string = DEFAULT_FORMAT): Dayjs | null {
    if (!value) return null;
    if (value instanceof Date) {
        const d = dayjs(value);
        return d.isValid() ? d : null;
    }
    return parseDate(value, format);
}

// ─── Formatting ───────────────────────────────────────────────────────────────

export function formatDate(date: Dayjs | null | undefined, format: string = DEFAULT_FORMAT): string {
    if (!date || !date.isValid()) return '';
    return date.format(format);
}

// ─── Validation ───────────────────────────────────────────────────────────────

export type ValidationResult =
    | { valid: true }
    | { valid: false; reason: 'empty' | 'incomplete' | 'invalid_date' | 'impossible_date' | 'out_of_range' };

export function validateDateInput(raw: string, format: string = DEFAULT_FORMAT, minDate?: Date, maxDate?: Date): ValidationResult {
    if (!raw || raw.trim() === '') return { valid: false, reason: 'empty' };

    const trimmed = raw.trim();

    // Untuk format numerik, cek apakah panjang sudah sesuai.
    // Jika masih ada '_' dari mask, otomatis incomplete.
    if (trimmed.includes('_')) {
        return { valid: false, reason: 'incomplete' };
    }

    const isNumericFormat = !format.includes('MMM');
    if (isNumericFormat) {
        const expectedLength = format.replace(/[^DMY]/g, '').length + (format.match(/[^DMY]/g)?.length ?? 0);
        if (trimmed.replace(/\s/g, '').length < expectedLength - 1) {
            return { valid: false, reason: 'incomplete' };
        }
    }

    const parsed = dayjs(trimmed, format, true);

    if (!parsed.isValid()) {
        return { valid: false, reason: 'invalid_date' };
    }

    // Impossible date check (misal 31-02): Day.js strict sudah menolak,
    // tapi double-check untuk keamanan.
    const loose = dayjs(trimmed, format, false);
    if (parsed.month() !== loose.month() || parsed.date() !== loose.date()) {
        return { valid: false, reason: 'impossible_date' };
    }

    if (minDate) {
        const min = dayjs(minDate).startOf('day');
        if (parsed.isBefore(min)) return { valid: false, reason: 'out_of_range' };
    }

    if (maxDate) {
        const max = dayjs(maxDate).endOf('day');
        if (parsed.isAfter(max)) return { valid: false, reason: 'out_of_range' };
    }

    return { valid: true };
}

export function getValidationMessage(result: ValidationResult, format: string = DEFAULT_FORMAT): string {
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

// ─── Output ───────────────────────────────────────────────────────────────────

export function buildOutputValue(date: Dayjs | null, format: string, returnType: 'string' | 'date'): string | Date | undefined {
    if (!date) return undefined;
    if (returnType === 'date') return date.toDate();
    return date.format(format);
}

// ─── Range ────────────────────────────────────────────────────────────────────

export function isDateDisabled(date: Dayjs, minDate?: Date, maxDate?: Date): boolean {
    if (minDate && date.isBefore(dayjs(minDate).startOf('day'))) return true;
    if (maxDate && date.isAfter(dayjs(maxDate).endOf('day'))) return true;
    return false;
}
