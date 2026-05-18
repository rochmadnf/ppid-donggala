// types/date-picker.d.ts

export type DatePickerReturnType = 'string' | 'date';

export interface DatePickerProps {
    /** Controlled value. Accepts string (any format) or native Date */
    value?: string | Date;

    /** Uncontrolled default value */
    defaultValue?: string | Date;

    /**
     * Callback fired when a valid date is selected or typed.
     * Returns string formatted per `format` prop, or native Date if `returnType="date"`.
     * Returns undefined when the field is cleared.
     */
    onChange?: (value: string | Date | undefined) => void;

    /**
     * Display & parse format using Day.js tokens.
     * Numeric formats (DD-MM-YYYY, YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY) support
     * auto-masking: separator auto-inserts, only digits accepted, fixed-position slots.
     * Text formats (MMMM D, YYYY) fall back to free-text input with Day.js validation.
     * @default "DD-MM-YYYY"
     */
    format?: string;

    /** Placeholder text. Defaults to the mask pattern (e.g. "dd-mm-yyyy") for numeric formats. */
    placeholder?: string;

    /** Disables the entire component */
    disabled?: boolean;

    /** Marks field as required (aria-required + HTML required) */
    required?: boolean;

    /** Additional class names applied to the root wrapper div */
    className?: string;

    /**
     * Determines the type returned by onChange.
     * @default "string"
     */
    returnType?: DatePickerReturnType;

    /** Minimum selectable date (inclusive). Disables earlier dates in the calendar. */
    minDate?: Date;

    /** Maximum selectable date (inclusive). Disables later dates in the calendar. */
    maxDate?: Date;

    /** Accessible label for the input (use when no visible <Label> is present) */
    'aria-label'?: string;

    /** ID of an external element that labels this input */
    'aria-labelledby'?: string;

    /** ID of an external element that describes this input (merged with internal error id) */
    'aria-describedby'?: string;

    /** Forwarded to the <input> element — use with htmlFor on <Label> */
    id?: string;

    /** Name attribute for the <input> element — needed for native form submissions */
    name?: string;

    /**
     * Side of the calendar popover relative to the trigger button.
     * @default "bottom" (Radix default)
     */
    calendarSide?: 'top' | 'bottom' | 'left' | 'right';
}

export interface DatePickerState {
    /** The valid, confirmed Day.js date (null when empty or invalid) */
    selectedDate: import('dayjs').Dayjs | null;

    /** Whether the calendar popover is open */
    isOpen: boolean;

    /** Whether the current input represents an invalid date */
    isInvalid: boolean;

    /** The month/year currently shown in the calendar */
    calendarMonth: import('dayjs').Dayjs;
}
