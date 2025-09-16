import apiClient from './apiClient';
import {ENDPOINTS} from './config/endpoints';
import type {
    Page,
    Examination,
} from '../types';


export const getAllExaminations = async (): Promise<Examination[]> => {
    try {
        const response = await apiClient.get<Page<Examination>>(ENDPOINTS.GET_ALL_IMAGING_TYPES, {
            params: {
                size: 2000,
            }
        });
        return response.data.content;
    } catch (error) {
        console.error("Error fetching all examinations:", error);
        throw error;
    }
};

