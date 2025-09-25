export interface Patient {
    id: string;
    name: string;
    age: string;
    gender: string;
    lastVisit: string;
    doctorName: string;
    hospitalName: string;

}

export interface Examination {
    id: string;
    name: string;
    code?: string;
}

export interface ClinicalIndication {
    id: string;
    name: string;
    isCustom?: boolean;
}

export interface ClinicalVariant {
    id: string;
    name: string;
    indicationId: string;
    isCustom?: boolean;
}

export interface ScoringResult {
    id: string;
    name: string;
    rating: number;
    shortJustification?: string | null;
    adultRRL?: string | null;
    literatureSummary?: string | null;
    isSelected: boolean;
    variantId: string;
}

export interface RadisState {
    step: number;
    selectedExam: Examination | null;
    selectedIndication: ClinicalIndication | null;
    selectedVariant: ClinicalVariant | null;
    scoringResults: ScoringResult[];
    isManualSelection: boolean;
}

export interface LoginCredentials {
    username: string;
    password: string;
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

export interface Indication {
    id: string;
    name: string;
    secondarySymptomCount: number;
}

export interface PrimaryIndicationDetail {
    id: string;
    name: string;
    secondarySymptoms: SecondarySymptom[];
}

export interface SecondarySymptom {
    id: string;
    name: string;
    imagingCombinationCount: number;
}

export interface ImagingCombination {
    id: string;
    rating: string;
    shortJustification: string | null;
    literatureSummary: string | null;
}

export interface VariantDetail {
    id: string;
    name: string;
    imagingCombinations: {
        id: string;
        rating: string;
        shortJustification: string | null;
        literatureSummary: string | null;
    }[];
}

export interface ImagingCombinationDetail {
    id: string;
    name: string;
    rating: number;
    adultRRL?: string | null;
    literatureSummary?: string | null;
    imagingTypes: Examination[];
    shortJustification: string | null | undefined;

}

export interface DiagnosisPayload {
    primarySymptomId?: string | null;
    secondarySymptomId?: string | null;
    selectedImagingCombinationId?: string | null;
    selectedImagingTypeId?: string | null;
    reason?: string;
    comment?: string;
    doctorName: string;
    hospitalName: string;
}