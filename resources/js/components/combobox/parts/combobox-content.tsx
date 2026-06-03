import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { useEffect, useRef, type HTMLAttributes } from 'react';
import { useComboBoxContext } from '../combobox';
import { useKeyboardNavigation } from '../hooks/use-keyboard-navigation';
import { ComboBoxCreate } from './combobox-create';
import { ComboBoxEmpty } from './combobox-empty';
import { ComboBoxItem } from './combobox-item';
import { ComboBoxLoading } from './combobox-loading';

interface ComboBoxContentProps extends HTMLAttributes<HTMLDivElement> {
    id?: string;
}

export function ComboBoxContent({ id, className }: ComboBoxContentProps) {
    const {
        query,
        setQuery,
        filteredOptions,
        selectedOptions,
        activeIndex,
        setActiveIndex,
        isLoading,
        searchable,
        creatable,
        createMode,
        setOpen,
        selectOption,
        handleCreate,
        setShowCreateModal,
    } = useComboBoxContext();

    const searchRef = useRef<HTMLInputElement>(null);

    // Focus search on open
    useEffect(() => {
        if (searchable) {
            const t = setTimeout(() => searchRef.current?.focus(), 0);
            return () => clearTimeout(t);
        }
    }, [searchable]);

    const hasCreateAction = creatable && query.trim().length > 0;
    const hasResults = filteredOptions.length > 0;

    const { handleKeyDown } = useKeyboardNavigation({
        itemCount: filteredOptions.length,
        activeIndex,
        onActiveIndexChange: setActiveIndex,
        onSelect: () => {
            const opt = filteredOptions[activeIndex];
            if (opt) selectOption(opt);
        },
        onClose: () => setOpen(false),
        hasCreateAction,
        onCreateTrigger: () => {
            if (createMode === 'modal') {
                setShowCreateModal(true);
            } else {
                handleCreate(query.trim());
            }
        },
    });

    return (
        <div className={cn('flex flex-col', className)} onKeyDown={handleKeyDown} data-combobox-content>
            {/* Search input — sticky at top */}
            {searchable && (
                <div className="flex items-center border-b px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                    <input
                        id="combobox-search"
                        ref={searchRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Cari…"
                        className={cn('flex h-10 w-full bg-transparent py-3 text-sm outline-none', 'placeholder:text-muted-foreground')}
                        aria-label="Search options"
                        autoComplete="off"
                        spellCheck={false}
                    />
                </div>
            )}

            {/* Option list */}
            <ScrollArea className="h-full">
                <div role="listbox" id={id} aria-multiselectable={useComboBoxContext().multiple} className="max-h-64 p-1">
                    {isLoading ? (
                        <ComboBoxLoading />
                    ) : !hasResults && !hasCreateAction ? (
                        <ComboBoxEmpty query={query} />
                    ) : (
                        filteredOptions.map((option, index) => (
                            <ComboBoxItem
                                key={option.id}
                                option={option}
                                index={index}
                                isActive={activeIndex === index}
                                isSelected={selectedOptions.some((s) => s.id === option.id)}
                                onMouseEnter={() => setActiveIndex(index)}
                            />
                        ))
                    )}

                    {/* Create action — always at bottom when query present */}
                    {hasCreateAction && !isLoading && (
                        <ComboBoxCreate
                            query={query.trim()}
                            isActive={activeIndex === filteredOptions.length}
                            onMouseEnter={() => setActiveIndex(filteredOptions.length)}
                        />
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
