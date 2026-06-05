import { cn } from '@/lib/utils';

interface GlowImageProps {
    src: string;
    alt?: string;
    className?: string;
    color?: string;
    animate?: boolean;
}

export function GlowImage({ src, alt = '', className = '', color = '--color-blue-700', animate = false }: GlowImageProps) {
    return (
        <div className={cn(`relative`, className)}>
            <img src={src} aria-hidden className={cn('absolute inset-0 scale-90 blur-2xl', animate ? 'animate-glow opacity-70' : 'opacity-50')} />
            <img src={src} alt={alt} className="relative" style={{ filter: `drop-shadow(0 0 15px var(${color}))` }} />
        </div>
    );
}
