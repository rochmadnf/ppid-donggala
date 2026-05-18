// hooks/use-date-mask.ts
//
// Slot-based input masking untuk DatePicker.
//
// PENDEKATAN: Fixed-position slots
// Setiap digit punya posisi tetap dalam string output.
// Saat digit dihapus, posisi itu menjadi "_" (placeholder slot),
// bukan menggeser digit lain.
//
// Contoh "DD-MM-YYYY":
//   Template : _ _ - _ _ - _ _ _ _
//   Index    : 0 1   2 3   4 5 6 7   (digit slots)
//   Display  : 1 9 - 0 8 - 2 0 2 2
//
// FITUR BARU: Smart digit validation per-segmen
// Setiap digit divalidasi SEBELUM masuk ke slot berdasarkan posisinya:
//
//   DD (slot 0):  digit pertama hanya boleh 0-3
//   DD (slot 1):  max hari bergantung bulan & tahun (28/29/30/31)
//   MM (slot 0):  digit pertama hanya boleh 0-1
//   MM (slot 1):  jika digit pertama 0 → 1-9, jika 1 → 0-2
//   YYYY:         digit bebas 0-9

import * as React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SlotChar {
    /** true = slot digit user, false = separator fixed */
    isDigit: boolean;
    /** Nilai: '0'-'9', '_' jika kosong, atau karakter separator */
    value: string;
    /** Index digit global; -1 untuk separator */
    digitIndex: number;
    /**
     * Token Day.js yang menghasilkan slot ini.
     * Dibutuhkan untuk smart validation.
     */
    token: 'DD' | 'MM' | 'YYYY' | 'YY' | 'D' | 'M' | null;
    /**
     * Posisi digit di dalam token (0-based).
     * Misal untuk DD slot ke-2: tokenOffset = 1
     */
    tokenOffset: number;
}

export interface MaskTemplate {
    maskable: boolean;
    slots: SlotChar[];
    totalLength: number;
    placeholder: string;
}

// ─── Token definitions ────────────────────────────────────────────────────────

const NUMERIC_TOKENS = ['YYYY', 'MM', 'DD', 'YY', 'D', 'M'] as const;
type NumericToken = (typeof NUMERIC_TOKENS)[number];

// D dan M tetap 2 slot agar hari/bulan 2-digit bisa diinput
const TOKEN_PLACEHOLDER: Record<NumericToken, string> = {
    YYYY: 'yyyy',
    MM: 'mm',
    DD: 'dd',
    YY: 'yy',
    D: 'dd',
    M: 'mm',
};

// ─── Parse format → MaskTemplate ─────────────────────────────────────────────

export function parseMaskTemplate(format: string): MaskTemplate {
    if (/MMMM|MMM/.test(format)) {
        return { maskable: false, slots: [], totalLength: 0, placeholder: format };
    }

    const slots: SlotChar[] = [];
    let remaining = format;
    let digitIndex = 0;
    let placeholder = '';

    while (remaining.length > 0) {
        const token = NUMERIC_TOKENS.find((t) => remaining.startsWith(t));

        if (token) {
            const ph = TOKEN_PLACEHOLDER[token];
            placeholder += ph;
            for (let i = 0; i < ph.length; i++) {
                slots.push({
                    isDigit: true,
                    value: '_',
                    digitIndex: digitIndex++,
                    token,
                    tokenOffset: i,
                });
            }
            remaining = remaining.slice(token.length);
        } else {
            const sep = remaining[0];
            slots.push({ isDigit: false, value: sep, digitIndex: -1, token: null, tokenOffset: 0 });
            placeholder += sep;
            remaining = remaining.slice(1);
        }
    }

    return {
        maskable: slots.some((s) => s.isDigit),
        slots,
        totalLength: slots.length,
        placeholder,
    };
}

// ─── Smart digit validator ────────────────────────────────────────────────────
//
// Dipanggil sebelum digit ditulis ke slot.
// Mengambil konteks dari slot lain (nilai bulan & tahun yang sudah terisi)
// untuk memutuskan apakah digit baru boleh masuk.
//
// Return: true = digit diterima, false = digit ditolak (blokir)

function isDigitAllowed(digit: string, targetDispIdx: number, slots: SlotChar[]): boolean {
    const slot = slots[targetDispIdx];
    if (!slot || !slot.isDigit) return false;

    const { token, tokenOffset } = slot;

    // Bantu: ambil nilai digit lain dari slot token yang sama
    const siblingValue = (offset: number): string | null => {
        const s = slots.find((sl) => sl.isDigit && sl.token === token && sl.tokenOffset === offset);
        return s ? (s.value === '_' ? null : s.value) : null;
    };

    // Bantu: baca nilai lengkap suatu token sebagai angka (null jika belum lengkap)
    const tokenValue = (t: NumericToken): number | null => {
        const tokenSlots = slots.filter((sl) => sl.isDigit && sl.token === t);
        if (tokenSlots.some((sl) => sl.value === '_')) return null;
        const str = tokenSlots.map((sl) => sl.value).join('');
        const n = parseInt(str, 10);
        return isNaN(n) ? null : n;
    };

    const d = parseInt(digit, 10);

    switch (token) {
        // ── Bulan (MM / M) ────────────────────────────────────────────────────
        case 'MM':
        case 'M': {
            if (tokenOffset === 0) {
                // Digit pertama bulan: hanya 0 atau 1
                // (bulan valid: 01-12, jadi digit pertama max 1)
                return d <= 1;
            }
            if (tokenOffset === 1) {
                const first = siblingValue(0);
                if (first === '0') {
                    // 00 tidak valid → min 01
                    return d >= 1 && d <= 9;
                }
                if (first === '1') {
                    // 10, 11, 12 valid → max 2
                    return d <= 2;
                }
                // first belum terisi — boleh saja
                return true;
            }
            return true;
        }

        // ── Hari (DD / D) ─────────────────────────────────────────────────────
        case 'DD':
        case 'D': {
            if (tokenOffset === 0) {
                // Digit pertama hari: hanya 0-3
                // (hari valid: 01-31, jadi digit pertama max 3)
                return d <= 3;
            }
            if (tokenOffset === 1) {
                const first = siblingValue(0);

                // Hitung maxDay berdasarkan bulan & tahun yang sudah diisi
                const month = tokenValue('MM') ?? tokenValue('M');
                const year = tokenValue('YYYY') ?? tokenValue('YY');

                const maxDay = getMaxDay(month, year);

                if (first === '0') {
                    // 00 tidak valid → min 01
                    return d >= 1;
                }
                if (first === '3') {
                    // 30 dan 31 mungkin valid, tergantung bulan
                    // digit kedua hanya 0 atau 1
                    const candidate = parseInt(`3${digit}`, 10);
                    return candidate <= maxDay;
                }
                if (first === '1' || first === '2') {
                    // 10-19, 20-29: semua valid sebagai tanggal
                    return true;
                }
                // first belum terisi
                return true;
            }
            return true;
        }

        // ── Tahun (YYYY / YY) — bebas ─────────────────────────────────────────
        case 'YYYY':
        case 'YY':
            return true;

        default:
            return true;
    }
}

/**
 * Hitung jumlah hari maksimum dalam sebulan.
 * Jika bulan atau tahun belum diisi (null), pakai nilai paling permisif.
 */
function getMaxDay(month: number | null, year: number | null): number {
    if (month === null) return 31; // belum tahu bulan → izinkan max

    // Tahun kabisat: tahun habis 4, kecuali habis 100, kecuali habis 400
    const isLeap = year !== null ? (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 : true; // belum tahu tahun → anggap kabisat (permisif untuk Feb)

    switch (month) {
        case 1:
            return 31; // Jan
        case 2:
            return isLeap ? 29 : 28; // Feb
        case 3:
            return 31; // Mar
        case 4:
            return 30; // Apr
        case 5:
            return 31; // May
        case 6:
            return 30; // Jun
        case 7:
            return 31; // Jul
        case 8:
            return 31; // Aug
        case 9:
            return 30; // Sep
        case 10:
            return 31; // Oct
        case 11:
            return 30; // Nov
        case 12:
            return 31; // Dec
        default:
            return 31;
    }
}

// ─── Slot array helpers ───────────────────────────────────────────────────────

function emptySlots(template: MaskTemplate): SlotChar[] {
    return template.slots.map((s) => ({ ...s, value: s.isDigit ? '_' : s.value }));
}

function slotsToDisplay(slots: SlotChar[]): string {
    return slots.map((s) => s.value).join('');
}

function isComplete(slots: SlotChar[]): boolean {
    return slots.filter((s) => s.isDigit).every((s) => s.value !== '_');
}

export function slotsToDigitString(slots: SlotChar[]): string {
    return slots
        .filter((s) => s.isDigit)
        .map((s) => (s.value === '_' ? '' : s.value))
        .join('');
}

// ─── Cursor / index helpers ───────────────────────────────────────────────────

function firstEmptySlotIndex(slots: SlotChar[]): number {
    const idx = slots.findIndex((s) => s.isDigit && s.value === '_');
    return idx === -1 ? slots.length : idx;
}

function displayIndexOfDigitSlot(slots: SlotChar[], digitSlotN: number): number {
    let count = 0;
    for (let i = 0; i < slots.length; i++) {
        if (slots[i].isDigit) {
            if (count === digitSlotN) return i;
            count++;
        }
    }
    return slots.length;
}

function digitSlotIndexAt(slots: SlotChar[], dispIdx: number): number {
    return slots.slice(0, dispIdx + 1).filter((s) => s.isDigit).length - 1;
}

// ─── Delete helper ────────────────────────────────────────────────────────────

function deleteDigit(slots: SlotChar[], atDigitSlot: number): SlotChar[] {
    const next = [...slots];
    const dispIdx = displayIndexOfDigitSlot(next, atDigitSlot);
    if (dispIdx < next.length && next[dispIdx].isDigit) {
        next[dispIdx] = { ...next[dispIdx], value: '_' };
    }
    return next;
}

// ─── Hook types ───────────────────────────────────────────────────────────────

export interface UseDateMaskOptions {
    format: string;
    onMaskedChange: (displayValue: string, complete: boolean) => void;
}

export interface UseDateMaskReturn {
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleClick: (e: React.MouseEvent<HTMLInputElement>) => void;
    handleFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
    setExternalValue: (formatted: string) => void;
    displayValue: string;
    isMaskable: boolean;
    maskPlaceholder: string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDateMask(inputRef: React.RefObject<HTMLInputElement | null>, options: UseDateMaskOptions): UseDateMaskReturn {
    const { format, onMaskedChange } = options;

    const onMaskedChangeRef = React.useRef(onMaskedChange);
    React.useLayoutEffect(() => {
        onMaskedChangeRef.current = onMaskedChange;
    });

    const template = React.useMemo(() => parseMaskTemplate(format), [format]);
    const [slots, setSlots] = React.useState<SlotChar[]>(() => emptySlots(template));

    React.useEffect(() => {
        setSlots(emptySlots(template));
    }, [template]);

    const displayValue = React.useMemo(() => {
        if (!template.maskable) return '';
        return slotsToDisplay(slots);
    }, [slots, template.maskable]);

    // ── Set dari luar (calendar select / controlled value sync) ───────────────
    const setExternalValue = React.useCallback(
        (formatted: string) => {
            if (!template.maskable) return;

            if (!formatted || formatted.trim() === '') {
                setSlots(emptySlots(template));
                return;
            }

            const next = template.slots.map((s, i) => {
                if (!s.isDigit) return { ...s };
                const ch = formatted[i] ?? '_';
                return { ...s, value: /\d/.test(ch) ? ch : '_' };
            });
            setSlots(next);
        },
        [template],
    );

    // ── Cursor management ─────────────────────────────────────────────────────

    const moveCursorToDigitSlot = React.useCallback(
        (digitSlotIdx: number, nextSlots: SlotChar[]) => {
            const el = inputRef.current;
            if (!el) return;
            const dispIdx = displayIndexOfDigitSlot(nextSlots, digitSlotIdx);
            requestAnimationFrame(() => {
                if (document.activeElement === el) {
                    el.setSelectionRange(dispIdx, dispIdx);
                }
            });
        },
        [inputRef],
    );

    // ── handleKeyDown ─────────────────────────────────────────────────────────
    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (!template.maskable) return;

            const { key } = e;

            if (key === 'Tab' || key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown' || e.ctrlKey || e.metaKey) {
                return;
            }

            e.preventDefault();

            if (key === 'Escape' || key === 'Enter') return;

            const el = inputRef.current;
            if (!el) return;

            const cursor = el.selectionStart ?? 0;
            const selEnd = el.selectionEnd ?? cursor;
            const hasSelection = selEnd !== cursor;

            // ── Backspace / Delete ────────────────────────────────────────────
            if (key === 'Backspace' || key === 'Delete') {
                if (hasSelection) {
                    const minPos = Math.min(cursor, selEnd);
                    const maxPos = Math.max(cursor, selEnd);
                    let next = [...slots];
                    for (let i = minPos; i < maxPos; i++) {
                        if (slots[i]?.isDigit) {
                            const dSlot = digitSlotIndexAt(slots, i);
                            next = deleteDigit(next, dSlot);
                        }
                    }
                    setSlots(next);
                    const val = slotsToDisplay(next);
                    onMaskedChangeRef.current(val, isComplete(next));
                    const cursorDSlot = digitSlotIndexAt(next, Math.min(minPos, next.length - 1));
                    moveCursorToDigitSlot(Math.max(0, cursorDSlot), next);
                    return;
                }

                if (key === 'Backspace') {
                    let targetDispIdx = cursor - 1;
                    while (targetDispIdx >= 0 && !slots[targetDispIdx]?.isDigit) {
                        targetDispIdx--;
                    }
                    if (targetDispIdx < 0) return;

                    const dSlot = digitSlotIndexAt(slots, targetDispIdx);
                    const next = deleteDigit(slots, dSlot);
                    setSlots(next);
                    onMaskedChangeRef.current(slotsToDisplay(next), isComplete(next));
                    moveCursorToDigitSlot(dSlot, next);
                } else {
                    let targetDispIdx = cursor;
                    while (targetDispIdx < slots.length && !slots[targetDispIdx]?.isDigit) {
                        targetDispIdx++;
                    }
                    if (targetDispIdx >= slots.length) return;

                    const dSlot = digitSlotIndexAt(slots, targetDispIdx);
                    const next = deleteDigit(slots, dSlot);
                    setSlots(next);
                    onMaskedChangeRef.current(slotsToDisplay(next), isComplete(next));
                    moveCursorToDigitSlot(dSlot, next);
                }
                return;
            }

            // ── Digit input ───────────────────────────────────────────────────
            if (/^\d$/.test(key)) {
                let targetDispIdx = cursor;
                while (targetDispIdx < slots.length && !slots[targetDispIdx]?.isDigit) {
                    targetDispIdx++;
                }
                if (targetDispIdx >= slots.length) return;

                // ── SMART VALIDATION: cek apakah digit diizinkan di slot ini ─
                if (!isDigitAllowed(key, targetDispIdx, slots)) {
                    // Digit ditolak — cursor tetap, tidak ada perubahan
                    return;
                }

                const next = [...slots];
                next[targetDispIdx] = { ...next[targetDispIdx], value: key };

                // ── Re-validasi digit kedua dari segmen lain yang sudah terisi ─
                // Contoh: user input bulan 02, lalu ganti hari dari 31 → nilai
                // hari 31 kini invalid untuk Feb. Reset hari jika perlu.
                const validated = revalidateDayAfterContextChange(next);

                setSlots(validated);
                onMaskedChangeRef.current(slotsToDisplay(validated), isComplete(validated));

                const dSlot = digitSlotIndexAt(validated, targetDispIdx);
                const nextDigitSlot = dSlot + 1;
                const totalDigitSlots = validated.filter((s) => s.isDigit).length;

                if (nextDigitSlot < totalDigitSlots) {
                    moveCursorToDigitSlot(nextDigitSlot, validated);
                } else {
                    requestAnimationFrame(() => {
                        if (document.activeElement === el) {
                            const lastDispIdx = displayIndexOfDigitSlot(validated, totalDigitSlots - 1);
                            el.setSelectionRange(lastDispIdx + 1, lastDispIdx + 1);
                        }
                    });
                }
                return;
            }

            // Karakter lain — diblokir
        },
        [template, slots, inputRef, moveCursorToDigitSlot],
    );

    // ── handleClick ───────────────────────────────────────────────────────────
    const handleClick = React.useCallback(
        (e: React.MouseEvent<HTMLInputElement>) => {
            if (!template.maskable) return;
            const el = e.currentTarget;
            const cursor = el.selectionStart ?? 0;

            let snapIdx = cursor;
            if (cursor < slots.length && !slots[cursor]?.isDigit) {
                let left = cursor - 1;
                while (left >= 0 && !slots[left]?.isDigit) left--;
                let right = cursor + 1;
                while (right < slots.length && !slots[right]?.isDigit) right++;

                if (left >= 0 && right < slots.length) {
                    snapIdx = cursor - left <= right - cursor ? left : right;
                } else if (left >= 0) {
                    snapIdx = left;
                } else if (right < slots.length) {
                    snapIdx = right;
                }
            }

            if (slots[snapIdx]?.isDigit) {
                requestAnimationFrame(() => {
                    if (document.activeElement === el) {
                        el.setSelectionRange(snapIdx, snapIdx);
                    }
                });
            }
        },
        [template, slots],
    );

    // ── handleFocus ───────────────────────────────────────────────────────────
    const handleFocus = React.useCallback(
        (_e: React.FocusEvent<HTMLInputElement>) => {
            if (!template.maskable) return;
            const el = inputRef.current;
            if (!el) return;
            const firstEmpty = firstEmptySlotIndex(slots);
            requestAnimationFrame(() => {
                if (document.activeElement === el) {
                    el.setSelectionRange(firstEmpty, firstEmpty);
                }
            });
        },
        [template, slots, inputRef],
    );

    return {
        handleKeyDown,
        handleClick,
        handleFocus,
        setExternalValue,
        displayValue: template.maskable ? displayValue : '',
        isMaskable: template.maskable,
        maskPlaceholder: template.placeholder,
    };
}

// ─── Re-validasi hari setelah bulan/tahun berubah ─────────────────────────────
//
// Skenario: user sudah input hari 31, lalu ganti bulan ke 02.
// 31-02 tidak ada → reset slot hari ke '_' agar user input ulang.
//
// Dipanggil setiap kali digit ditulis ke slot bulan atau tahun.

function revalidateDayAfterContextChange(slots: SlotChar[]): SlotChar[] {
    // Kumpulkan token yang diubah — kita hanya perlu cek jika bulan atau tahun berubah
    const monthSlots = slots.filter((s) => s.isDigit && (s.token === 'MM' || s.token === 'M'));
    const yearSlots = slots.filter((s) => s.isDigit && (s.token === 'YYYY' || s.token === 'YY'));
    const daySlots = slots.filter((s) => s.isDigit && (s.token === 'DD' || s.token === 'D'));

    // Jika bulan atau tahun belum lengkap, tidak ada yang perlu di-reset
    const monthComplete = monthSlots.length > 0 && monthSlots.every((s) => s.value !== '_');
    const yearComplete = yearSlots.length > 0 && yearSlots.every((s) => s.value !== '_');
    const dayComplete = daySlots.length > 0 && daySlots.every((s) => s.value !== '_');

    if (!dayComplete) return slots; // hari belum terisi → tidak perlu cek

    const month = monthComplete ? parseInt(monthSlots.map((s) => s.value).join(''), 10) : null;
    const year = yearComplete ? parseInt(yearSlots.map((s) => s.value).join(''), 10) : null;
    const day = parseInt(daySlots.map((s) => s.value).join(''), 10);

    const maxDay = getMaxDay(month, year);

    if (day > maxDay) {
        // Hari tidak valid untuk bulan/tahun ini — reset semua slot hari
        return slots.map((s) => (s.isDigit && (s.token === 'DD' || s.token === 'D') ? { ...s, value: '_' } : s));
    }

    return slots;
}
