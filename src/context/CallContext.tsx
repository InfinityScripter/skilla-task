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
    loadCalls: () => Promise<void>;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    totalCalls: number;
    totalPages: number;
    limit: number;
}

export const CallContext = createContext<CallContextProps | undefined>(undefined);

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [calls, setCalls] = useState<CallInterface[]>([]);
    const [filteredCalls, setFilteredCalls] = useState<CallInterface[]>([]);
    const [callType, setCallType] = useState<string>("Все типы");
    const [sortOrder, setSortOrder] = useState<string>("date_DESC");
    const [limit] = useState<number>(25); // Количество записей на страницу
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalCalls, setTotalCalls] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    const currentDate = new Date();
    const oneMonthAgo = new Date(currentDate.getTime());
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);

    const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
        start: format(oneMonthAgo, "yyyy-MM-dd"),
        end: format(new Date(), "yyyy-MM-dd"),
    });

    const loadCallsData = async () => {
        const in_out = callType === "Все типы" ? "" : callType === "Входящие" ? "1" : "0";
        const [sort_by, order] = sortOrder.split('_');
        const offset = (currentPage - 1) * limit;

        try {
            const response = await fetchCalls(
                dateRange.start,
                dateRange.end,
                in_out,
                sort_by,
                order,
                limit,
                offset
            );

            const newCalls = response.results;

            setCalls(newCalls);
            setFilteredCalls(newCalls);

            setTotalCalls(response.total_rows);
            setTotalPages(Math.ceil(response.total_rows / limit));

        } catch (error) {
            console.error("Ошибка при загрузке звонков:", error);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [dateRange, callType, sortOrder]);

    useEffect(() => {
        loadCallsData();
    }, [dateRange, callType, sortOrder, currentPage]);

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
                currentPage,
                setCurrentPage,
                totalCalls,
                totalPages,
                limit,
            }}
        >
            {children}
        </CallContext.Provider>
    );
};
