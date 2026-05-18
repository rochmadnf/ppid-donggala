// types/date-picker.d.ts

export type DatePickerReturnType = 'string' | 'date';

export interface DatePickerProps {
    /** Controlled value. Accepts string (any format) or native Date */
    value?: string | Date;

    /** Uncontrolled default value */
    defaultValue?: string | Date;

    /**
     * Callback fired when a date is selected or typed.
     * Returns string formatted per `format` prop, or native Date if `returnType="date"`
     */
    onChange?: (value: string | Date | undefined) => void;

    /**
     * Display & parse format using Day.js tokens.
     * @default "DD-MM-YYYY"
     * @example "DD-MM-YYYY" | "YYYY-MM-DD" | "DD/MM/YYYY" | "MMMM D, YYYY"
     */
    format?: string;

    /** Placeholder text inside the input */
    placeholder?: string;

    /** Disables the entire component */
    disabled?: boolean;

    /** Marks field as required */
    required?: boolean;

    /** Additional class names applied to the root wrapper */
    className?: string;

    /**
     * Determines what type onChange receives.
     * @default "string"
     */
    returnType?: DatePickerReturnType;

    /** Minimum selectable date (inclusive) */
    minDate?: Date;

    /** Maximum selectable date (inclusive) */
    maxDate?: Date;

    /** Accessible name for the input */
    'aria-label'?: string;

    /** ID of an external element that labels this input */
    'aria-labelledby'?: string;

    /** ID of an external element that describes this input */
    'aria-describedby'?: string;

    /** Unique id forwarded to the <input> element */
    id?: string;

    /** Name attribute forwarded to the <input> element (useful for form submissions) */
    name?: string;

    /** Optional callback to access the internal state of the date picker (for advanced use cases) */
    calendarSide?: 'top' | 'bottom' | 'left' | 'right';
}

export interface DatePickerState {
    /** Raw text currently in the input box */
    inputText: string;

    /** The valid, confirmed Day.js date (null when empty or invalid) */
    selectedDate: import('dayjs').Dayjs | null;

    /** Whether the calendar popover is open */
    isOpen: boolean;

    /** Whether the current inputText represents an invalid date */
    isInvalid: boolean;

    /** The month/year shown in the calendar (may differ from selectedDate while browsing) */
    calendarMonth: import('dayjs').Dayjs;
}
