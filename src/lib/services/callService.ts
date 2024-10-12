import axiosInstance from '@/lib/axiosInstance.ts';
import { CallsApiResponse } from "@/types/callTypes.ts";

export const fetchCalls = async (
    date_start: string,
    date_end: string,
    in_out: string = '',
    sort_by: string = '',
    order: string = '',
    limit: number = 50,
    offset: number = 0
) => {
    const response = await axiosInstance.post<CallsApiResponse>(
        '/getList',
        null,
        {
            params: {
                date_start,
                date_end,
                in_out,
                sort_by,
                order,
                limit,
                offset,
            },
        }
    );
    return response.data;
};

export const fetchCallRecord = async (recordId: string, partnershipId: string): Promise<Blob> => {
    const response = await axiosInstance.post(
        '/getRecord',
        null,
        {
            params: {
                record: recordId,
                partnership_id: partnershipId,
            },
            responseType: 'blob',
        }
    );
    return response.data;
};
