// lib/use-date-mask.ts
//
// Slot-based input masking untuk DatePicker.
//
// PENDEKATAN: Fixed-position slots
// Setiap digit punya posisi tetap dalam string output.
// Saat digit dihapus, posisi itu menjadi "_" (placeholder slot),
// bukan menggeser digit lain. Mirip cara kerja input masking
// seperti "dd-mm-yyyy" di mana setiap karakter punya slot sendiri.
//
// Contoh "DD-MM-YYYY":
//   Template : _ _ - _ _ - _ _ _ _
//   Position : 0 1   2 3   4 5 6 7   (digit slots)
//   Display  : 1 9 - 0 8 - 2 0 2 2
//
// Saat user hapus digit bulan (pos 2-3):
//   Display  : 1 9 - _ _ - 2 0 2 2   <- hari & tahun TIDAK bergeser

import * as React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SlotChar {
    /** Apakah ini slot digit (true) atau separator fixed (false) */
    isDigit: boolean;
    /** Nilai saat ini: angka, atau '_' jika kosong, atau karakter separator */
    value: string;
    /** Index digit global (hanya untuk isDigit=true), untuk tracking */
    digitIndex: number;
}

export interface MaskTemplate {
    maskable: boolean;
    /** Array karakter template: digit slot atau separator */
    slots: SlotChar[];
    /** Total panjang string termasuk separator */
    totalLength: number;
    /** Placeholder visual, misal "dd-mm-yyyy" */
    placeholder: string;
}

// ─── Token definitions ────────────────────────────────────────────────────────

const NUMERIC_TOKENS = ['YYYY', 'MM', 'DD', 'YY', 'D', 'M'] as const;
type NumericToken = (typeof NUMERIC_TOKENS)[number];

const TOKEN_PLACEHOLDER: Record<NumericToken, string> = {
    YYYY: 'yyyy',
    MM: 'mm',
    DD: 'dd',
    YY: 'yy',
    D: 'd',
    M: 'm',
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
            const len = token.length;
            placeholder += TOKEN_PLACEHOLDER[token];
            for (let i = 0; i < len; i++) {
                slots.push({ isDigit: true, value: '_', digitIndex: digitIndex++ });
            }
            remaining = remaining.slice(len);
        } else {
            // Separator character
            const sep = remaining[0];
            slots.push({ isDigit: false, value: sep, digitIndex: -1 });
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

// ─── Slot array helpers ───────────────────────────────────────────────────────

/** Buat salinan slot array dengan semua digit dikosongkan ('_') */
function emptySlots(template: MaskTemplate): SlotChar[] {
    return template.slots.map((s) => ({ ...s, value: s.isDigit ? '_' : s.value }));
}

/** Render slot array ke string display, '_' untuk slot kosong */
function slotsToDisplay(slots: SlotChar[], showEmpty = true): string {
    return slots.map((s) => (s.isDigit && s.value === '_' && !showEmpty ? '' : s.value)).join('');
}

/** Apakah semua slot digit terisi (tidak ada '_') */
function isComplete(slots: SlotChar[]): boolean {
    return slots.filter((s) => s.isDigit).every((s) => s.value !== '_');
}

/** Ambil semua digit terisi sebagai string murni (untuk parsing Day.js) */
export function slotsToDigitString(slots: SlotChar[]): string {
    return slots
        .filter((s) => s.isDigit)
        .map((s) => (s.value === '_' ? '' : s.value))
        .join('');
}

// ─── Cursor helpers ───────────────────────────────────────────────────────────

/** Cari slot display-index pertama yang kosong ('_') */
function firstEmptySlotIndex(slots: SlotChar[]): number {
    const idx = slots.findIndex((s) => s.isDigit && s.value === '_');
    return idx === -1 ? slots.length : idx;
}

/** Cari display-index dari slot digit ke-n */
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

/**
 * Dari posisi cursor di string display, cari digit-slot index yang paling dekat.
 * Digunakan untuk tahu "user sedang di segmen mana".
 */
function digitSlotAtCursor(slots: SlotChar[], cursorPos: number): number {
    // Cursor ada di antara karakter cursorPos-1 dan cursorPos
    // Kita cari digit slot terdekat ke kiri
    let digitCount = 0;
    for (let i = 0; i < slots.length && i < cursorPos; i++) {
        if (slots[i].isDigit) digitCount++;
    }
    return Math.max(0, digitCount - 1);
}

// ─── Core operations ──────────────────────────────────────────────────────────

/**
 * Insert digit ke slot tertentu.
 * Jika slot sudah terisi, geser ke slot digit berikutnya yang kosong.
 */
function insertDigit(slots: SlotChar[], digit: string, atDigitSlot: number): SlotChar[] {
    const next = [...slots];
    // Cari slot dari atDigitSlot ke depan yang kosong
    const digitSlots = next.filter((s) => s.isDigit);
    for (let i = atDigitSlot; i < digitSlots.length; i++) {
        const slotIdx = displayIndexOfDigitSlot(next, i);
        if (next[slotIdx].value === '_') {
            next[slotIdx] = { ...next[slotIdx], value: digit };
            return next;
        }
    }
    // Semua terisi — tidak lakukan apa-apa
    return next;
}

/**
 * Hapus digit di slot tertentu (isi dengan '_').
 */
function deleteDigit(slots: SlotChar[], atDigitSlot: number): SlotChar[] {
    const next = [...slots];
    const slotIdx = displayIndexOfDigitSlot(next, atDigitSlot);
    if (slotIdx < next.length && next[slotIdx].isDigit) {
        next[slotIdx] = { ...next[slotIdx], value: '_' };
    }
    return next;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export interface UseDateMaskOptions {
    format: string;
    /** Dipanggil dengan nilai display (misal "19-08-2022") setiap kali slot berubah.
     *  Nilai '_' sudah diganti '' sehingga partial date terlihat bersih untuk validasi. */
    onMaskedChange: (displayValue: string, isComplete: boolean) => void;
}

export interface UseDateMaskReturn {
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleClick: (e: React.MouseEvent<HTMLInputElement>) => void;
    handleFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
    /** Inisialisasi value dari luar (misal saat calendar select atau controlled value sync) */
    setExternalValue: (formatted: string) => void;
    /** Value saat ini untuk prop value pada <input> */
    displayValue: string;
    isMaskable: boolean;
    maskPlaceholder: string;
}

export function useDateMask(inputRef: React.RefObject<HTMLInputElement | null>, options: UseDateMaskOptions): UseDateMaskReturn {
    const { format, onMaskedChange } = options;

    const template = React.useMemo(() => parseMaskTemplate(format), [format]);

    // State: array slot saat ini
    const [slots, setSlots] = React.useState<SlotChar[]>(() => emptySlots(template));

    // Reset slots saat format berubah
    React.useEffect(() => {
        setSlots(emptySlots(template));
    }, [template]);

    // Display value yang ditampilkan di <input>
    const displayValue = React.useMemo(() => {
        if (!template.maskable) return '';
        return slotsToDisplay(slots, true);
    }, [slots, template.maskable]);

    // ── Set dari luar (calendar select / controlled value) ────────────────────
    const setExternalValue = React.useCallback(
        (formatted: string) => {
            if (!template.maskable) return;

            if (!formatted || formatted.trim() === '') {
                setSlots(emptySlots(template));
                return;
            }

            // Parse: ambil karakter dari formatted yang sesuai posisi digit slot
            const next = template.slots.map((s, i) => {
                if (!s.isDigit) return { ...s };
                const ch = formatted[i] ?? '_';
                return { ...s, value: /\d/.test(ch) ? ch : '_' };
            });
            setSlots(next);
        },
        [template],
    );

    // ── Cursor: posisi digit slot dari cursor saat ini ─────────────────────────
    const getCurrentDigitSlot = React.useCallback((): number => {
        const el = inputRef.current;
        if (!el) return 0;
        const cursor = el.selectionStart ?? 0;
        return digitSlotAtCursor(slots, cursor);
    }, [slots, inputRef]);

    // ── Pindahkan cursor ke digit slot tertentu ────────────────────────────────
    const moveCursorToDigitSlot = React.useCallback(
        (digitSlotIdx: number, nextSlots?: SlotChar[]) => {
            const el = inputRef.current;
            if (!el) return;
            const s = nextSlots ?? slots;
            const dispIdx = displayIndexOfDigitSlot(s, digitSlotIdx);
            requestAnimationFrame(() => {
                if (document.activeElement === el) {
                    el.setSelectionRange(dispIdx, dispIdx);
                }
            });
        },
        [slots, inputRef],
    );

    // ── handleKeyDown: satu-satunya cara input masuk ───────────────────────────
    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (!template.maskable) return;

            const { key } = e;

            // Izinkan: Tab, Arrow keys (navigasi bebas), Ctrl/Cmd shortcuts
            if (key === 'Tab' || key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown' || e.ctrlKey || e.metaKey) {
                return; // biarkan browser handle
            }

            // Blokir semua input default — kita handle sendiri
            e.preventDefault();

            if (key === 'Escape' || key === 'Enter') return; // biarkan parent handle

            const el = inputRef.current;
            if (!el) return;

            const cursor = el.selectionStart ?? 0;
            const selEnd = el.selectionEnd ?? cursor;
            const hasSelection = selEnd !== cursor;

            // ── Delete / Backspace ──────────────────────────────────────────────
            if (key === 'Backspace' || key === 'Delete') {
                if (hasSelection) {
                    // Hapus semua digit dalam range seleksi
                    const minPos = Math.min(cursor, selEnd);
                    const maxPos = Math.max(cursor, selEnd);
                    let next = [...slots];
                    for (let i = minPos; i < maxPos; i++) {
                        if (slots[i]?.isDigit) {
                            const dSlot = digitSlotAtCursor(slots, i + 1);
                            next = deleteDigit(next, dSlot);
                        }
                    }
                    setSlots(next);
                    const complete = isComplete(next);
                    const val = slotsToDisplay(next, true);
                    onMaskedChange(val, complete);
                    moveCursorToDigitSlot(digitSlotAtCursor(slots, minPos), next);
                    return;
                }

                if (key === 'Backspace') {
                    // Cari digit slot di kiri cursor
                    let targetDispIdx = cursor - 1;
                    // Lewati separator ke kiri
                    while (targetDispIdx >= 0 && !slots[targetDispIdx]?.isDigit) {
                        targetDispIdx--;
                    }
                    if (targetDispIdx < 0) return;

                    const dSlot = digitSlotAtCursor(slots, targetDispIdx + 1);
                    const next = deleteDigit(slots, dSlot);
                    setSlots(next);
                    const complete = isComplete(next);
                    const val = slotsToDisplay(next, true);
                    onMaskedChange(val, complete);
                    moveCursorToDigitSlot(dSlot, next);
                } else {
                    // Delete: hapus digit di kanan cursor
                    let targetDispIdx = cursor;
                    while (targetDispIdx < slots.length && !slots[targetDispIdx]?.isDigit) {
                        targetDispIdx++;
                    }
                    if (targetDispIdx >= slots.length) return;

                    const dSlot = digitSlotAtCursor(slots, targetDispIdx + 1);
                    const next = deleteDigit(slots, dSlot);
                    setSlots(next);
                    const complete = isComplete(next);
                    const val = slotsToDisplay(next, true);
                    onMaskedChange(val, complete);
                    moveCursorToDigitSlot(dSlot, next);
                }
                return;
            }

            // ── Digit input ─────────────────────────────────────────────────────
            if (/^\d$/.test(key)) {
                // Tentukan slot target: slot digit di posisi cursor atau kanan cursor
                let targetDispIdx = cursor;
                // Lewati separator
                while (targetDispIdx < slots.length && !slots[targetDispIdx]?.isDigit) {
                    targetDispIdx++;
                }
                if (targetDispIdx >= slots.length) return;

                const dSlot = digitSlotAtCursor(slots, targetDispIdx + 1);

                // Jika slot sudah terisi dan tidak ada seleksi, overwrite slot itu
                const next = (() => {
                    const s = [...slots];
                    s[targetDispIdx] = { ...s[targetDispIdx], value: key };
                    return s;
                })();

                setSlots(next);
                const complete = isComplete(next);
                const val = slotsToDisplay(next, true);
                onMaskedChange(val, complete);

                // Pindahkan cursor ke slot digit berikutnya
                const nextDigitSlot = dSlot + 1;
                const totalDigitSlots = slots.filter((s) => s.isDigit).length;
                if (nextDigitSlot < totalDigitSlots) {
                    moveCursorToDigitSlot(nextDigitSlot, next);
                } else {
                    // Sudah di akhir
                    requestAnimationFrame(() => {
                        const pos = displayIndexOfDigitSlot(next, totalDigitSlots - 1) + 1;
                        el.setSelectionRange(pos, pos);
                    });
                }
                return;
            }

            // Karakter lain (huruf, simbol) — blokir semua
        },
        [template, slots, inputRef, onMaskedChange, moveCursorToDigitSlot],
    );

    // ── handleClick: posisikan cursor ke digit slot terdekat ──────────────────
    const handleClick = React.useCallback(
        (e: React.MouseEvent<HTMLInputElement>) => {
            if (!template.maskable) return;
            const el = e.currentTarget;
            const cursor = el.selectionStart ?? 0;

            // Snap cursor ke digit slot terdekat
            let snapIdx = cursor;
            // Cari digit slot di posisi cursor atau terdekat
            if (cursor < slots.length && !slots[cursor]?.isDigit) {
                // Cari ke kiri dulu
                let left = cursor - 1;
                while (left >= 0 && !slots[left]?.isDigit) left--;
                // Cari ke kanan
                let right = cursor + 1;
                while (right < slots.length && !slots[right]?.isDigit) right++;

                // Pilih yang lebih dekat
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

    // ── handleFocus: letakkan cursor di slot kosong pertama ───────────────────
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
