export interface Patient {
    id: string;
    name: string;
    age: string;
    gender: string;
    lastVisit: string;
    doctorName: string;
    hospitalName: string;

}

export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: Sort;
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface Page<T> {
    content: T[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: Sort;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}


export interface Examination {
    id: string;
    name: string;
    code?: string;
}
