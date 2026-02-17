export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginationMetaProps {
    current_page: number;
    from: number;
    last_page: number;
    links: PaginationLink[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}
