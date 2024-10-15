import React, { useCallback, useContext } from "react";
import CallType from "@/components/Call/CallFilter/components/CallType.tsx";
import DatePick from "@/components/Call/CallFilter/components/DataPick.tsx";
import { CallContext } from "@/context/CallContext";

const CallFilter = () => {
    const context = useContext(CallContext);

    const handleTypeChange = useCallback((type: string) => {
        context?.setCallType(type);
    }, [context]);

    const handleDateChange = useCallback((range: { start: string; end: string }) => {
        context?.setDateRange(range);
    }, [context]);



    return (
        <div className="flex justify-between pb-4">
            <div className="flex">
                <CallType onTypeChange={handleTypeChange} />
            </div>
            <div className="flex">
                <DatePick onDateChange={handleDateChange} />
            </div>
        </div>
    );
};

export default React.memo(CallFilter);
