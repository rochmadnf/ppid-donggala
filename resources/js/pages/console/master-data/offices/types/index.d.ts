import type { PaginationMetaProps } from '@/types/pagination';

export interface OfficeName {
    raw: string;
    alias: string;
}

export interface OfficeDataProps {
    id: string;
    name: OfficeName;
}

export interface OfficeIndexProps {
    resources: {
        data: OfficeDataProps[];
        meta: PaginationMetaProps;
    };
}
