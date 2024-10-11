import CallType from "@/components/Call/CallFilter/components/CallType.tsx";
import DatePick from "@/components/Call/CallFilter/components/DataPick.tsx";

const CallFilter = () => {

    return (
        <div className="flex justify-between  h-[24px] mb-4">
            <div className="flex">
                <CallType/>
            </div>
            <div className="flex">
                <DatePick/>
            </div>
        </div>
    );
};

export default CallFilter;
