import { type ComponentType, type SVGProps } from 'react';

export interface MenuProps {
    id: string;
    title: string;
    description: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    url: string;
}
