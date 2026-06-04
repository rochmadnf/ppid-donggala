import type { PaginationMetaProps } from '@/types/pagination';

export interface EnumOptionType {
    id: string;
    label: string;
}

export interface PublicOfficerForm {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedRecord: PublicOfficerDataShowProps | null;
}

export interface PublicOfficerDataIndexProps {
    id: string;
    name: string;
    office: {
        id: string;
        name: string;
        alias: string;
        rank: number | null;
    };
    position: {
        id: string;
        name: string;
    };
    is_active: boolean;
    photo: string;
}

export interface PublicOfficerDataShowProps extends PublicOfficerDataIndexProps {
    birth_place: string;
    birth_date: string;
    last_education: string;
    gender: string;
    marital_status: string;
    religion: string;
    period_start: string;
    period_end: string | null;
}

export interface PublicOfficerFormPageProps {
    options: {
        educations: EnumOptionType[];
        religions: EnumOptionType[];
        maritalStatuses: EnumOptionType[];
    };
}

export interface PublicOfficerShowProps extends PublicOfficerFormPageProps {
    resources: {
        data: PublicOfficerDataShowProps;
    };
}
export interface PublicOfficerIndexProps {
    resources: {
        data: PublicOfficerDataIndexProps[];
        meta: PaginationMetaProps;
    };
}
