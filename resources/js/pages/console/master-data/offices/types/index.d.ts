import type { PaginationMetaProps } from '@/types/pagination';

export interface OfficeName {
    raw: string;
    alias: string;
}

export type OfficeMerger = Pick<OfficeDataProps, 'id' | 'name' | 'site_url'>[];
export interface OfficeDataProps {
    id: string;
    name: OfficeName;
    address: string;
    phone: string | null;
    merger: {
        of: OfficeMerger;
        by: OfficeMerger;
    };
    site_url: string | null;
}

export interface OfficeIndexProps {
    resources: {
        data: OfficeDataProps[];
        meta: PaginationMetaProps;
    };
}
