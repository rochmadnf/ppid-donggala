import { forwardRef, type HTMLAttributes } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useComboBoxContext } from "./combobox";
import { ComboBoxMultiValue } from "./parts/combobox-multi-value";

interface ComboBoxTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  placeholder?: string;
  disabled?: boolean;
}

export const ComboBoxTrigger = forwardRef<HTMLButtonElement, ComboBoxTriggerProps>(
  ({ placeholder = "Select…", disabled, className, ...props }, ref) => {
    const {
      selectedOptions,
      multiple,
      clearAll,
      removeOption,
    } = useComboBoxContext();

    const hasValue = selectedOptions.length > 0;

    return (
      <button
        ref={ref}
        type="button"
        role="combobox"
        disabled={disabled}
        className={cn(
          // Base
          "flex min-h-10 w-full items-center justify-between gap-2 rounded-md border",
          "border-input bg-background px-3 py-2 text-sm shadow-sm",
          "transition-colors focus:outline-none focus:ring-1 focus:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Multi-select has different inner layout
          multiple && hasValue ? "flex-wrap py-1.5 gap-1.5" : "flex-nowrap",
          className
        )}
        {...props}
      >
        {/* Selected value display */}
        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {hasValue ? (
            multiple ? (
              <ComboBoxMultiValue
                options={selectedOptions}
                onRemove={removeOption}
                disabled={disabled}
              />
            ) : (
              <span className="truncate">{selectedOptions[0].label}</span>
            )
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </span>

        {/* Right actions */}
        <span className="flex shrink-0 items-center gap-0.5">
          {/* Clear button */}
          {hasValue && !disabled && (
            <span
              role="button"
              aria-label="Clear selection"
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  clearAll();
                }
              }}
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-sm",
                "text-muted-foreground hover:text-foreground",
                "transition-colors"
              )}
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}

          {/* Chevron */}
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground opacity-70 transition-transform duration-200",
              // Open state is set via CSS from parent aria-expanded
            )}
          />
        </span>
      </button>
    );
  }
);

ComboBoxTrigger.displayName = "ComboBoxTrigger";
