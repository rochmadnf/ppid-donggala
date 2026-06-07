import { cn } from '@/lib/utils';
import { Loader2, Plus } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useComboBoxContext } from '../combobox';

interface ComboBoxCreateProps {
    query: string;
    isActive: boolean;
    onMouseEnter: () => void;
}

export function ComboBoxCreate({ query, isActive, onMouseEnter }: ComboBoxCreateProps) {
    const { handleCreate, isCreating, createMode, setShowCreateModal } = useComboBoxContext();

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isActive) ref.current?.scrollIntoView({ block: 'nearest' });
    }, [isActive]);

    const handleClick = () => {
        if (createMode === 'modal') {
            setShowCreateModal(true);
        } else {
            handleCreate(query);
        }
    };

    return (
        <div
            ref={ref}
            role="option"
            aria-selected={false}
            data-active={isActive}
            onClick={handleClick}
            onMouseEnter={onMouseEnter}
            className={cn(
                'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm select-none',
                'mt-1 border-t border-dashed border-border pt-2',
                'text-primary transition-colors',
                isActive && 'bg-primary/5',
                isCreating && 'pointer-events-none opacity-60',
            )}
        >
            {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            <span>
                Tambah <strong className="font-medium">"{query}"</strong>
            </span>
        </div>
    );
}
