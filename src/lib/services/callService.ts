import axiosInstance from '@/lib/axiosInstance.ts';
import {CallsApiResponse} from "@/types/callTypes.ts";

export const fetchCalls = async (date_start: string, date_end: string, in_out: string = '') => {
    const response = await axiosInstance.post<CallsApiResponse>('/getList', {
        date_start,
        date_end,
        in_out,
    });
    return response.data;
};
