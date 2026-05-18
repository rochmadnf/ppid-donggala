import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import dayjs, { type Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isToday from 'dayjs/plugin/isToday';
import { CalendarIcon, XCircleIcon } from 'lucide-react';
import * as React from 'react';
import { id as IDLocale } from 'react-day-picker/locale';
import { useDateMask } from './hooks/use-date-mask';
import {
    buildOutputValue,
    DEFAULT_FORMAT,
    formatDate,
    getValidationMessage,
    isDateDisabled,
    parseDateValue,
    validateDateInput,
} from './lib/date-picker';
import type { DatePickerProps } from './types/date-picker';

dayjs.extend(customParseFormat);
dayjs.extend(isToday);

// ─── Component ────────────────────────────────────────────────────────────────

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
    (
        {
            value,
            defaultValue,
            onChange,
            format = DEFAULT_FORMAT,
            placeholder,
            disabled = false,
            required = false,
            className,
            returnType = 'string',
            minDate,
            maxDate,
            id,
            name,
            'aria-label': ariaLabel,
            'aria-labelledby': ariaLabelledBy,
            'aria-describedby': ariaDescribedBy,
            calendarSide,
        },
        ref,
    ) => {
        const isControlled = value !== undefined;

        // ── State ─────────────────────────────────────────────────────────────────

        const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(() => {
            const initial = isControlled ? value : defaultValue;
            return parseDateValue(initial, format);
        });

        const [calendarMonth, setCalendarMonth] = React.useState<Dayjs>(() => parseDateValue(isControlled ? value : defaultValue, format) ?? dayjs());

        const [isOpen, setIsOpen] = React.useState(false);
        const [validationError, setValidationError] = React.useState<string>('');

        // Ref ke <input> — dibutuhkan oleh useDateMask untuk cursor management
        const internalInputRef = React.useRef<HTMLInputElement | null>(null);

        // Gabungkan forwardRef dengan internal ref
        const mergedRef = React.useCallback(
            (node: HTMLInputElement | null) => {
                internalInputRef.current = node;
                if (typeof ref === 'function') ref(node);
                else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
            },
            [ref],
        );

        const internalId = React.useId();
        const errorId = `${internalId}-error`;
        const inputId = id ?? internalId;

        // ── commitDate ────────────────────────────────────────────────────────────
        const commitDate = React.useCallback(
            (date: Dayjs | null) => {
                setSelectedDate(date);
                if (date) setCalendarMonth(date);
                onChange?.(buildOutputValue(date, format, returnType));
            },
            [format, onChange, returnType],
        );

        // ── Mask hook ─────────────────────────────────────────────────────────────
        const {
            handleKeyDown: handleMaskedKeyDown,
            handleClick: handleMaskedClick,
            handleFocus: handleMaskedFocus,
            setExternalValue,
            displayValue,
            isMaskable,
            maskPlaceholder,
        } = useDateMask(internalInputRef, {
            format,
            onMaskedChange: (maskedDisplay, complete) => {
                // maskedDisplay berisi '_' untuk slot kosong, misal "19-__-2022"
                // complete = true hanya jika semua digit sudah terisi

                // Input kosong sepenuhnya
                if (!maskedDisplay || maskedDisplay.replace(/[_\-\/.\s]/g, '') === '') {
                    setValidationError('');
                    commitDate(null);
                    return;
                }

                // Masih ada slot kosong — tidak commit, tidak tampilkan error dulu
                if (!complete) {
                    setValidationError('');
                    return;
                }

                // Semua slot terisi — jalankan validasi
                const result = validateDateInput(maskedDisplay, format, minDate, maxDate);
                if (result.valid) {
                    setValidationError('');
                    const parsed = dayjs(maskedDisplay, format, true);
                    commitDate(parsed.isValid() ? parsed : null);
                } else {
                    // FIX [9-UX]: error tetap ditampilkan langsung untuk tanggal
                    // impossible (misal 31-02) karena sudah "complete" namun tidak valid.
                    // Ini memberikan feedback segera tanpa menunggu blur.
                    const reason = (result as { valid: false; reason: string }).reason;
                    if (reason !== 'incomplete') {
                        setValidationError(getValidationMessage(result, format));
                    }
                    commitDate(null);
                }
            },
        });

        // ── Ref untuk displayValue — hindari stale closure di handleInputBlur ────
        // FIX [7]: displayValue dibaca dari ref agar handleInputBlur selalu
        // mendapat nilai terbaru meski dipanggil setelah setState async.
        const displayValueRef = React.useRef(displayValue);
        React.useLayoutEffect(() => {
            displayValueRef.current = displayValue;
        });

        // ── Sync controlled value ke mask ─────────────────────────────────────────
        React.useEffect(() => {
            if (!isControlled) return;
            const parsed = parseDateValue(value, format);
            setSelectedDate(parsed);
            if (parsed) {
                setCalendarMonth(parsed);
                setExternalValue(formatDate(parsed, format));
            } else {
                setExternalValue('');
            }
            // FIX [5]: selalu reset validationError — bukan hanya saat parsed truthy.
            // Sebelumnya jika value di-clear dari parent (undefined/""),
            // error lama tetap tampil karena setValidationError ada di dalam `if (parsed)`.
            setValidationError('');
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [value, format]);

        // ── Input blur: validasi akhir ────────────────────────────────────────────
        const handleInputBlur = React.useCallback(() => {
            // FIX [7]: baca dari ref, bukan closure — selalu fresh
            const current = displayValueRef.current;

            if (!current || current.replace(/[_\-\/.\s]/g, '') === '') {
                setValidationError('');
                return;
            }
            // Masih ada slot kosong setelah blur → incomplete
            if (current.includes('_')) {
                setValidationError(getValidationMessage({ valid: false, reason: 'incomplete' }, format));
                return;
            }
            const result = validateDateInput(current, format, minDate, maxDate);
            if (!result.valid) setValidationError(getValidationMessage(result, format));
            else setValidationError('');
        }, [format, minDate, maxDate]);
        // deps: displayValue TIDAK ada di sini (sudah lewat ref)

        // ── Keyboard handler ──────────────────────────────────────────────────────
        const handleInputKeyDown = React.useCallback(
            (e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (selectedDate) setIsOpen((prev) => !prev);
                    return;
                }
                if (e.key === 'Escape') return; // biarkan popover handle
                handleMaskedKeyDown(e);
            },
            [selectedDate, handleMaskedKeyDown],
        );

        // ── Calendar select ───────────────────────────────────────────────────────
        const handleCalendarSelect = React.useCallback(
            (date: Date | undefined) => {
                if (!date) return;
                const djs = dayjs(date);
                if (isDateDisabled(djs, minDate, maxDate)) return;

                const formatted = formatDate(djs, format);
                setExternalValue(formatted);
                setValidationError('');
                setIsOpen(false);
                commitDate(djs);
            },
            [format, minDate, maxDate, commitDate, setExternalValue],
        );

        // ── Clear ─────────────────────────────────────────────────────────────────
        const handleClear = React.useCallback(
            (e: React.MouseEvent) => {
                e.stopPropagation();
                setExternalValue('');
                setValidationError('');
                commitDate(null);
            },
            [commitDate, setExternalValue],
        );

        // ── Popover open/close ────────────────────────────────────────────────────
        const handleOpenChange = React.useCallback(
            (open: boolean) => {
                if (disabled) return;
                setIsOpen(open);
                if (open && !selectedDate) setCalendarMonth(dayjs());
            },
            [disabled, selectedDate],
        );

        const handleCalendarMonthChange = React.useCallback((month: Date) => {
            setCalendarMonth(dayjs(month));
        }, []);

        const disabledMatcher = React.useCallback((date: Date) => isDateDisabled(dayjs(date), minDate, maxDate), [minDate, maxDate]);

        // ── Derived ───────────────────────────────────────────────────────────────
        const isInvalid = validationError !== '';
        const computedPlaceholder = placeholder ?? (isMaskable ? maskPlaceholder : format);
        const selectedNativeDate = selectedDate?.toDate();
        const computedDescribedBy = [ariaDescribedBy, isInvalid ? errorId : undefined].filter(Boolean).join(' ') || undefined;

        // Nilai yang ditampilkan di input:
        // - maskable: pakai displayValue dari hook (dengan '_' untuk slot kosong)
        // - non-maskable (MMMM dll): pakai format teks dari selectedDate
        const inputValue = isMaskable ? displayValue : selectedDate ? formatDate(selectedDate, format) : '';

        // ── Render ────────────────────────────────────────────────────────────────
        return (
            <TooltipProvider delayDuration={400}>
                <div className={cn('relative flex flex-col gap-1', className)}>
                    <div
                        className={cn(
                            'flex h-10 w-full items-center rounded-md border bg-background text-sm ring-offset-background',
                            'transition-colors duration-150',
                            isInvalid
                                ? 'border-destructive ring-1 ring-destructive/40 focus-within:ring-destructive'
                                : 'border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
                            disabled && 'cursor-not-allowed opacity-50',
                        )}
                    >
                        <input
                            ref={mergedRef}
                            id={inputId}
                            name={name}
                            type="text"
                            inputMode={isMaskable ? 'numeric' : 'text'}
                            role="combobox"
                            aria-expanded={isOpen}
                            aria-haspopup="dialog"
                            aria-invalid={isInvalid}
                            aria-required={required}
                            aria-label={ariaLabel}
                            aria-labelledby={ariaLabelledBy}
                            aria-describedby={computedDescribedBy}
                            aria-autocomplete="none"
                            autoComplete="off"
                            spellCheck={false}
                            disabled={disabled}
                            required={required}
                            value={inputValue}
                            placeholder={computedPlaceholder}
                            // onChange dikosongkan: semua input masuk lewat onKeyDown.
                            // React membutuhkan handler ini agar tidak warning
                            // "controlled input without onChange handler".
                            onChange={() => {}}
                            onBlur={handleInputBlur}
                            onKeyDown={handleInputKeyDown}
                            onClick={handleMaskedClick}
                            onFocus={handleMaskedFocus}
                            className={cn(
                                'h-full flex-1 bg-transparent px-3 py-2 outline-none',
                                'placeholder:text-muted-foreground',
                                disabled && 'cursor-not-allowed',
                            )}
                        />

                        {inputValue && !disabled && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        onClick={handleClear}
                                        aria-label="Hapus tanggal"
                                        className={cn(
                                            'flex h-full items-center px-1 text-muted-foreground',
                                            'transition-colors duration-150 hover:text-foreground',
                                            'rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                                        )}
                                    >
                                        <XCircleIcon className="size-4" aria-hidden />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Hapus</TooltipContent>
                            </Tooltip>
                        )}

                        {/*
                            PENTING: Tooltip harus wrap di LUAR PopoverTrigger.
                            PopoverTrigger asChild meng-clone child langsung ke DOM.
                            Jika child adalah <Tooltip> (bukan DOM element), asChild
                            gagal meneruskan click event → popover tidak terbuka.
                        */}
                        <Popover open={isOpen} onOpenChange={handleOpenChange}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <PopoverTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            disabled={disabled}
                                            aria-label="Buka kalender"
                                            aria-expanded={isOpen}
                                            aria-haspopup="dialog"
                                            className={cn(
                                                'h-full rounded-l-none rounded-r-md border-l px-3',
                                                'text-muted-foreground hover:text-foreground',
                                                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                                isInvalid && 'border-l-destructive/40',
                                            )}
                                        >
                                            <CalendarIcon className="size-4" aria-hidden />
                                        </Button>
                                    </PopoverTrigger>
                                </TooltipTrigger>
                                <TooltipContent side="top">Pilih tanggal</TooltipContent>
                            </Tooltip>

                            <PopoverContent
                                className="w-auto p-0"
                                sideOffset={8}
                                role="dialog"
                                side={calendarSide}
                                aria-label="Kalender pemilih tanggal"
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') setIsOpen(false);
                                }}
                            >
                                <Calendar
                                    mode="single"
                                    selected={selectedNativeDate}
                                    onSelect={handleCalendarSelect}
                                    month={calendarMonth.toDate()}
                                    onMonthChange={handleCalendarMonthChange}
                                    disabled={disabledMatcher}
                                    startMonth={minDate}
                                    endMonth={maxDate}
                                    locale={IDLocale}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {isInvalid && (
                        <p id={errorId} role="alert" aria-live="polite" className="text-xs leading-tight text-destructive">
                            {validationError}
                        </p>
                    )}
                </div>
            </TooltipProvider>
        );
    },
);

DatePicker.displayName = 'DatePicker';

export { DatePicker };
export type { DatePickerProps };
