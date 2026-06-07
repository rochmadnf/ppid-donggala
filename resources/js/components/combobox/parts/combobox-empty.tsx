import { SearchX } from 'lucide-react';

interface ComboBoxEmptyProps {
    query?: string;
}

export function ComboBoxEmpty({ query }: ComboBoxEmptyProps) {
    return (
        <div className="flex flex-col items-center justify-center py-6 text-center">
            <SearchX className="mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">{query ? `Tidak ada hasil untuk "${query}"` : 'Tidak ada data.'}</p>
        </div>
    );
}
