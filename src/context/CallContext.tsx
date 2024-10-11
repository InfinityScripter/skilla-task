import React, { createContext, useState, useEffect } from "react";
import { fetchCalls } from "@/lib/services/callService";
import { CallInterface } from "@/types/callTypes";
import { format } from "date-fns";

interface CallContextProps {
    calls: CallInterface[];
    setCalls: React.Dispatch<React.SetStateAction<CallInterface[]>>;
    filteredCalls: CallInterface[];
    setFilteredCalls: React.Dispatch<React.SetStateAction<CallInterface[]>>;
    callType: string;
    setCallType: React.Dispatch<React.SetStateAction<string>>;
    dateRange: { start: string; end: string };
    setDateRange: React.Dispatch<React.SetStateAction<{ start: string; end: string }>>;
    sortOrder: string;
    setSortOrder: React.Dispatch<React.SetStateAction<string>>;
    loadCalls: (date_start?: string, date_end?: string, in_out?: string, sort_by?: string, order?: string) => Promise<void>;
}

export const CallContext = createContext<CallContextProps | undefined>(undefined);

export const loadCalls = async (
    date_start: string,
    date_end: string,
    in_out: string,
    sort_by: string = 'date',
    order: string = 'DESC'
) => {
    const response = await fetchCalls(date_start, date_end, in_out, sort_by, order);
    return response.results;
};

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [calls, setCalls] = useState<CallInterface[]>([]);
    const [filteredCalls, setFilteredCalls] = useState<CallInterface[]>([]);
    const [callType, setCallType] = useState<string>("Все типы");
    const [sortOrder, setSortOrder] = useState<string>("date_DESC");

    const currentDate = new Date();
    const oneMonthAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 1));

    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
        start: format(oneMonthAgo, "yyyy-MM-dd"),
        end: format(new Date(), "yyyy-MM-dd"),
    });

    const loadCallsData = async (
        date_start: string = dateRange.start,
        date_end: string = dateRange.end,
        in_out: string = callType === "Все типы" ? "" : callType,
        sort_by: string = sortOrder.split('_')[0],
        order: string = sortOrder.split('_')[1]
    ) => {
        const results = await loadCalls(date_start, date_end, in_out, sort_by, order);
        setCalls(results);
        setFilteredCalls(results);
    };

    useEffect(() => {
        loadCallsData();
    }, [dateRange, callType, sortOrder]);

    return (
        <CallContext.Provider
            value={{
                calls,
                setCalls,
                filteredCalls,
                setFilteredCalls,
                callType,
                setCallType,
                dateRange,
                setDateRange,
                sortOrder,
                setSortOrder,
                loadCalls: loadCallsData,
            }}
        >
            {children}
        </CallContext.Provider>
    );
};
