import apiClient from './apiClient';
import {ENDPOINTS} from './config/endpoints';
import type {
    Page,
    PrimaryIndicationDetail,
    Indication,
    VariantDetail,
    ImagingCombinationDetail, DiagnosisPayload
} from '../types';


export const getPrimaryIndication = async ({pageParam = 0, query = ''}): Promise<Page<Indication>> => {
    try {
        let endpoint = ENDPOINTS.GET_PRIMARY_INDICATIONS;
        const params: { page: number; size: number; query?: string } = {
            page: pageParam,
            size: 20,
        };

        if (query) {
            endpoint = ENDPOINTS.GET_PRIMARY_INDICATIONS_SEARCH
            params.query = query;
        }

        const response = await apiClient.get<Page<Indication>>(endpoint, {params});
        return response.data;

    } catch (error) {
        console.error("Error fetching primary indications:", error);
        throw error;
    }
};

export const getIndicationDetails = async ({indicationId}: {
    indicationId: string
}): Promise<PrimaryIndicationDetail> => {
    try {
        const endpoint = `${ENDPOINTS.GET_PRIMARY_INDICATIONS}/${indicationId}/detail`;

        const response = await apiClient.get<PrimaryIndicationDetail>(endpoint);

        return response.data;
    } catch (error) {
        console.error(`Error fetching variants for indication ${indicationId}:`, error);
        throw error;
    }
};

export const getSecondaryIndications = async ({variantId}: { variantId: string }): Promise<VariantDetail> => {
    try {
        const endpoint = `${ENDPOINTS.GET_SECONDARY_INDICATIONS}/${variantId}/detail`;

        const response = await apiClient.get<VariantDetail>(endpoint);
        return response.data;
    } catch (error) {
        console.error(`Error fetching scoring results for variant ${variantId}:`, error);
        throw error;
    }
};


export const getImagingCombinationDetails = async (ids: string[]): Promise<ImagingCombinationDetail[]> => {
    try {
        const endpoint = ENDPOINTS.GET_IMAGING_COMBINATIONS_BY_IDS;
        const response = await apiClient.post<ImagingCombinationDetail[]>(endpoint, ids);
        return response.data;
    } catch (error) {
        console.error("Error fetching details by IDs:", error);
        throw error;
    }
};

export const submitDiagnosis = async (payload: DiagnosisPayload): Promise<any> => {
    const apiUrl = ENDPOINTS.SUBMIT_DIAGNOSIS;
    const token = sessionStorage.getItem('authToken');

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({message: 'Sunucudan gelen hata okunamadı.'}));
        throw new Error(errorData.message || 'Tanı gönderme işlemi sırasında bir hata oluştu.');
    }

    return response.json();
};