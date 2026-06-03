import { cn } from "@/lib/utils";

export function ComboBoxLoading() {
    return (
        <div className="space-y-1 p-1" aria-busy="true" aria-label="Loading options">
            {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "flex items-center gap-2 rounded-sm px-2 py-1.5",
                        "animate-pulse"
                    )}
                >
                    <div className="h-4 w-4 rounded-sm bg-muted" />
                    <div
                        className="h-4 rounded bg-muted"
                        style={{ width: `${55 + (i % 3) * 15}%` }}
                    />
                </div>
            ))}
        </div>
    );
}