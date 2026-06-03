import { useRef, useEffect } from "react";
import { Check, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Option } from "../types";
import { useComboBoxContext } from "../combobox";

interface ComboBoxItemProps {
    option: Option;
    index: number;
    isActive: boolean;
    isSelected: boolean;
    onMouseEnter: () => void;
}

export function ComboBoxItem({
    option,
    isActive,
    isSelected,
    onMouseEnter,
}: ComboBoxItemProps) {
    const { selectOption, deletable, handleDelete, deletingIds, renderOption } =
        useComboBoxContext();

    const isDeleting = deletingIds.has(option.id);
    const ref = useRef<HTMLDivElement>(null);

    // Scroll active item into view
    useEffect(() => {
        if (isActive) ref.current?.scrollIntoView({ block: "nearest" });
    }, [isActive]);

    return (
        <div
            ref={ref}
            role="option"
            aria-selected={isSelected}
            data-active={isActive}
            onClick={() => !isDeleting && selectOption(option)}
            onMouseEnter={onMouseEnter}
            className={cn(
                "group relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none",
                "transition-colors",
                isActive && "bg-blue-100 text-blue-800",
                isDeleting && "opacity-50 pointer-events-none"
            )}
        >
            {/* Check mark */}
            <span className="mr-2 h-4 w-4 shrink-0 text-blue-800">
                {isSelected && <Check className="h-4 w-4" />}
            </span>

            {/* Label */}
            <span className={cn("flex-1 truncate", isSelected ? "text-blue-800" : "")}>
                {renderOption ? renderOption(option) : option.label}
            </span>

            {/* Delete button */}
            {deletable && (
                <span
                    role="button"
                    aria-label={`Delete ${option.label}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(option);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.stopPropagation();
                            handleDelete(option);
                        }
                    }}
                    className={cn(
                        "ml-2 hidden h-6 w-6 items-center justify-center rounded-sm",
                        "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
                        "group-hover:flex",
                        isActive && "flex"
                    )}
                >
                    {isDeleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                    )}
                </span>
            )}
        </div>
    );
}