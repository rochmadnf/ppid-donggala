import * as React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SlotChar {
    /** true = slot digit user, false = separator fixed */
    isDigit: boolean;
    /** Nilai: angka '0'-'9', '_' jika kosong, atau karakter separator */
    value: string;
    /** Index digit global; -1 untuk separator */
    digitIndex: number;
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

// Placeholder 'dd'/'mm' memberi sinyal visual bahwa 2 digit tersedia.
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
            // Alokasikan slot sebanyak panjang placeholder (bukan panjang token)
            for (let i = 0; i < ph.length; i++) {
                slots.push({ isDigit: true, value: '_', digitIndex: digitIndex++ });
            }
            remaining = remaining.slice(token.length);
        } else {
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

/** Cari display-index pertama yang merupakan slot kosong */
function firstEmptySlotIndex(slots: SlotChar[]): number {
    const idx = slots.findIndex((s) => s.isDigit && s.value === '_');
    return idx === -1 ? slots.length : idx;
}

/** Cari display-index dari slot digit ke-n (0-based) */
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
 * Hitung digit-slot index (0-based) dari display-index tertentu.
 */
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
    /**
     * Dipanggil setiap kali slot berubah.
     * displayValue: string dengan '_' untuk slot kosong, misal "19-__-2022"
     * complete: true jika semua digit terisi
     */
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

    // FIX [1]: Simpan onMaskedChange ke ref agar handleKeyDown tidak perlu
    // di-recreate setiap kali callback berubah (menghindari stale closure
    // dan re-create handleKeyDown yang menyebabkan slots stale).
    const onMaskedChangeRef = React.useRef(onMaskedChange);
    React.useLayoutEffect(() => {
        onMaskedChangeRef.current = onMaskedChange;
    });

    const template = React.useMemo(() => parseMaskTemplate(format), [format]);

    const [slots, setSlots] = React.useState<SlotChar[]>(() => emptySlots(template));

    // Reset slots saat format berubah
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

            // Petakan karakter dari formatted string ke posisi slot yang sesuai.
            // Ini aman karena formatted sudah dalam format yang sama dengan template.
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

    // FIX [2]: moveCursorToDigitSlot selalu menerima nextSlots eksplisit
    // sehingga tidak pernah fallback ke `slots` closure yang bisa stale.
    // Signature diubah: nextSlots wajib (bukan optional).
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
        // Tidak perlu `slots` di deps — nextSlots selalu diteruskan eksplisit
    );

    // ── handleKeyDown ─────────────────────────────────────────────────────────
    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (!template.maskable) return;

            const { key } = e;

            // Biarkan browser handle: navigasi & shortcut
            if (key === 'Tab' || key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown' || e.ctrlKey || e.metaKey) {
                return;
            }

            // Blokir default — kita handle sendiri
            e.preventDefault();

            // Enter & Escape dikembalikan ke parent handler
            if (key === 'Escape' || key === 'Enter') return;

            const el = inputRef.current;
            if (!el) return;

            const cursor = el.selectionStart ?? 0;
            const selEnd = el.selectionEnd ?? cursor;
            const hasSelection = selEnd !== cursor;

            // ── Backspace / Delete ────────────────────────────────────────────
            if (key === 'Backspace' || key === 'Delete') {
                if (hasSelection) {
                    // Hapus semua digit dalam range seleksi
                    const minPos = Math.min(cursor, selEnd);
                    const maxPos = Math.max(cursor, selEnd);
                    let next = [...slots];
                    for (let i = minPos; i < maxPos; i++) {
                        if (slots[i]?.isDigit) {
                            // FIX [3]: gunakan digitSlotIndexAt, bukan digitSlotAtCursor+1
                            const dSlot = digitSlotIndexAt(slots, i);
                            next = deleteDigit(next, dSlot);
                        }
                    }
                    setSlots(next);
                    const complete = isComplete(next);
                    const val = slotsToDisplay(next);
                    onMaskedChangeRef.current(val, complete);
                    // FIX [2]: hitung cursor dari next, bukan slots
                    const cursorDigitSlot = digitSlotIndexAt(next, Math.min(minPos, next.length - 1));
                    moveCursorToDigitSlot(Math.max(0, cursorDigitSlot), next);
                    return;
                }

                if (key === 'Backspace') {
                    // Cari digit slot di kiri cursor, lewati separator
                    let targetDispIdx = cursor - 1;
                    while (targetDispIdx >= 0 && !slots[targetDispIdx]?.isDigit) {
                        targetDispIdx--;
                    }
                    if (targetDispIdx < 0) return;

                    // FIX [3]: gunakan digitSlotIndexAt — tidak perlu +1
                    const dSlot = digitSlotIndexAt(slots, targetDispIdx);
                    const next = deleteDigit(slots, dSlot);
                    setSlots(next);
                    const complete = isComplete(next);
                    const val = slotsToDisplay(next);
                    onMaskedChangeRef.current(val, complete);
                    // FIX [2]: teruskan next ke moveCursor
                    moveCursorToDigitSlot(dSlot, next);
                } else {
                    // Delete: hapus digit di kanan cursor, lewati separator
                    let targetDispIdx = cursor;
                    while (targetDispIdx < slots.length && !slots[targetDispIdx]?.isDigit) {
                        targetDispIdx++;
                    }
                    if (targetDispIdx >= slots.length) return;

                    // FIX [3]: digitSlotIndexAt tanpa +1
                    const dSlot = digitSlotIndexAt(slots, targetDispIdx);
                    const next = deleteDigit(slots, dSlot);
                    setSlots(next);
                    const complete = isComplete(next);
                    const val = slotsToDisplay(next);
                    onMaskedChangeRef.current(val, complete);
                    // FIX [2]: teruskan next
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

                const next = [...slots];
                next[targetDispIdx] = { ...next[targetDispIdx], value: key };

                setSlots(next);
                const complete = isComplete(next);
                const val = slotsToDisplay(next);
                onMaskedChangeRef.current(val, complete);

                const dSlot = digitSlotIndexAt(next, targetDispIdx);
                const nextDigitSlot = dSlot + 1;
                const totalDigitSlots = next.filter((s) => s.isDigit).length;

                if (nextDigitSlot < totalDigitSlots) {
                    moveCursorToDigitSlot(nextDigitSlot, next);
                } else {
                    requestAnimationFrame(() => {
                        if (document.activeElement === el) {
                            const lastDispIdx = displayIndexOfDigitSlot(next, totalDigitSlots - 1);
                            el.setSelectionRange(lastDispIdx + 1, lastDispIdx + 1);
                        }
                    });
                }
                return;
            }
        },
        [template, slots, inputRef, moveCursorToDigitSlot],
    );

    // ── handleClick: snap cursor ke digit slot terdekat ──────────────────────
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

    // ── handleFocus: cursor ke slot kosong pertama ────────────────────────────
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
