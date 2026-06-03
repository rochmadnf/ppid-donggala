import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { type Option } from '../types';

interface ComboBoxMultiValueProps {
    options: Option[];
    onRemove: (option: Option) => void;
    disabled?: boolean;
}

export function ComboBoxMultiValue({ options, onRemove, disabled }: ComboBoxMultiValueProps) {
    return (
        <>
            {options.map((option) => (
                <span
                    key={option.id}
                    className={cn(
                        'inline-flex items-center gap-1 rounded-md border bg-secondary',
                        'px-2 py-0.5 text-xs font-medium text-secondary-foreground',
                        'transition-colors',
                    )}
                >
                    <span className="max-w-30 truncate">{option.label}</span>
                    {!disabled && (
                        <span
                            role="button"
                            aria-label={`Remove ${option.label}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove(option);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.stopPropagation();
                                    onRemove(option);
                                }
                            }}
                            className={cn(
                                'flex h-3.5 w-3.5 cursor-pointer items-center justify-center rounded-sm',
                                'text-muted-foreground hover:text-foreground',
                            )}
                        >
                            <X className="h-3 w-3" />
                        </span>
                    )}
                </span>
            ))}
        </>
    );
}
