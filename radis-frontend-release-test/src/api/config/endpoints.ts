const API_BASE_URL = 'http://188.166.82.72:8090/api/diagnosis';

export const ENDPOINTS = {
    GET_ALL_IMAGING_TYPES: `${API_BASE_URL}/api/symptom/imaging-type`,
    GET_PRIMARY_INDICATIONS: `${API_BASE_URL}/api/symptom/primary`,
    GET_PRIMARY_INDICATIONS_SEARCH: `${API_BASE_URL}/api/symptom/primary/search/search`,
    GET_SECONDARY_INDICATIONS: `${API_BASE_URL}/api/symptom/secondary`,
    GET_IMAGING_COMBINATIONS_BY_IDS: `${API_BASE_URL}/api/symptom/imaging-combination/by-ids`,
    SUBMIT_DIAGNOSIS: `${API_BASE_URL}/api/diagnosis`
};