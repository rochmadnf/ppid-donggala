import type { PaginationMetaProps } from '@/types/pagination';
import type { JSONContent } from '@tiptap/core';

export interface PpidDataProps {
    name: string;
    slug: string;
    type: string;
    values: JSONContent;
    created_at: string;
}

export interface PpidIndexProps {
    resources: {
        data: PpidDataProps[];
        meta: PaginationMetaProps;
    };
}
