// ============================================================
// hooks/use-keyboard-navigation.ts
// ============================================================

import { type KeyboardEvent, useCallback } from 'react';

interface UseKeyboardNavigationOptions {
    itemCount: number;
    activeIndex: number;
    onActiveIndexChange: (index: number) => void;
    onSelect: () => void;
    onClose: () => void;
    onCreateTrigger?: () => void;
    /** Whether the create action item is visible */
    hasCreateAction?: boolean;
}

/**
 * Handles keyboard navigation inside the ComboBox dropdown.
 *
 * Keys:
 *  - ArrowDown / ArrowUp  → navigate items
 *  - Enter                → select active item (or trigger create)
 *  - Escape               → close dropdown
 *  - Tab                  → close dropdown (allow natural focus)
 */
export function useKeyboardNavigation({
    itemCount,
    activeIndex,
    onActiveIndexChange,
    onSelect,
    onClose,
    onCreateTrigger,
    hasCreateAction = false,
}: UseKeyboardNavigationOptions) {
    // Total navigable items = options + optional create action
    const totalItems = itemCount + (hasCreateAction ? 1 : 0);
    const createIndex = itemCount; // create action is always last

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowDown': {
                    e.preventDefault();
                    const next = activeIndex < totalItems - 1 ? activeIndex + 1 : 0;
                    onActiveIndexChange(next);
                    break;
                }
                case 'ArrowUp': {
                    e.preventDefault();
                    const prev = activeIndex > 0 ? activeIndex - 1 : totalItems - 1;
                    onActiveIndexChange(prev);
                    break;
                }
                case 'Enter': {
                    e.preventDefault();
                    if (hasCreateAction && activeIndex === createIndex) {
                        onCreateTrigger?.();
                    } else if (activeIndex >= 0 && activeIndex < itemCount) {
                        onSelect();
                    }
                    break;
                }
                case 'Escape': {
                    e.preventDefault();
                    onClose();
                    break;
                }
                case 'Tab': {
                    onClose();
                    break;
                }
            }
        },
        [activeIndex, totalItems, itemCount, createIndex, hasCreateAction, onActiveIndexChange, onSelect, onClose, onCreateTrigger],
    );

    return { handleKeyDown };
}
