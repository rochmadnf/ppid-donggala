import type { PaginationMetaProps } from '@/types/pagination';

export interface PublicInformationDataIndexProps {
    id: string;
    name: string;
    office: {
        id: string;
        name: string;
        alias: string;
    };
    position: {
        id: string;
        name: string;
    };
    is_active: boolean;
    photo: string;
}

export interface PublicInformationDataShowProps extends PublicInformationDataIndexProps {
    birth_place: string;
    birth_date: string;
    last_education: string;
    gender: string;
    marital_status: string;
    religion: string;
    period_start: string;
    period_end: string;
}

export interface PublicInformationShowProps {
    resources: {
        data: PublicInformationDataShowProps;
        meta: PaginationMetaProps;
    };
}
export interface PublicInformationIndexProps {
    resources: {
        data: PublicInformationDataIndexProps[];
        meta: PaginationMetaProps;
    };
}
