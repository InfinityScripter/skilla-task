import { useContext, useState } from "react";
import { CallContext } from "@/context/CallContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDuration, formatPhoneNumber, formatTime, getBadgeVariant, getRandomRating } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import CallInIcon from "@/assets/icons/call_in.svg";
import CallOutIcon from "@/assets/icons/call_out.svg";
import MissedInIcon from "@/assets/icons/missed_in.svg";
import MissedOutIcon from "@/assets/icons/missed_out.svg";
import CallRecord from "@/components/Call/CallRecord";

const getCallIcon = (in_out: number | undefined, status: string) => {
    if (in_out === 1) {
        if (status === 'Не дозвонился') return <img className="text-center" src={MissedInIcon} alt="Пропущенный входящий звонок" />;
        return <img src={CallInIcon} alt="Входящий звонок" />;
    } else if (in_out === 0) {
        if (status === 'Не дозвонился') return <img src={MissedOutIcon} alt="Пропущенный исходящий звонок" />;
        return <img src={CallOutIcon} alt="Исходящий звонок" />;
    }
    return null;
};

const CallList = () => {
    const { filteredCalls, loadCalls, setSortOrder } = useContext(CallContext)!;
    const [sortBy, setSortBy] = useState<string | null>(null);
    const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');

    const handleSortChange = (column: string) => {
        const newOrder = sortBy === column && order === 'ASC' ? 'DESC' : 'ASC';
        setSortBy(column);
        setOrder(newOrder);
        setSortOrder(`${column}_${newOrder}`);
        loadCalls(undefined, undefined, undefined, column, newOrder);
    };

    const getChevronIcon = (column: string) => {
        if (sortBy === column) {
            return order === 'ASC' ? <ChevronUp  size={20} /> : <ChevronDown size={20} />;
        }
        return <ChevronDown size={16} />;
    };

    return (
        <div className="bg-white rounded-xl">
            {filteredCalls.length === 0 && <p>Звонков нет...</p>}
            {filteredCalls.length > 0 && (
                <Table>
                    <TableHeader>
                        <TableRow >
                            <TableHead className="table-header-font  pt-5 pb-6 pl-5 pr-5">Тип</TableHead>
                            <TableHead
                                className="table-header-font pt-5 pb-6 pl-5 pr-5 cursor-pointer"
                                onClick={() => handleSortChange('date')}
                            >
                                <div className="flex flex-row justify-center content-center gap-2">
                                Время {getChevronIcon('date')}
                                </div>
                            </TableHead>

                            <TableHead className="table-header-font pt-5 pb-6 pl-5 pr-5">Сотрудник</TableHead>
                            <TableHead className="table-header-font pt-5 pb-6 pl-5 pr-5">Звонок</TableHead>
                            <TableHead className="table-header-font pt-5 pb-6 pl-5 pr-5">Источник</TableHead>
                            <TableHead className="table-header-font pt-5 pb-6 pl-5 pr-5">Оценка</TableHead>
                            <TableHead
                                className="table-header-font pt-5 pb-6 pl-5 pr-5 cursor-pointer text-right"
                                onClick={() => handleSortChange('duration')}
                                colSpan={2}
                            >
                                <div className="flex flex-row justify-end content-center gap-2">
                                    Длительность {getChevronIcon('duration')}
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredCalls.map((call) => {
                            const rating = getRandomRating();
                            return (
                                <TableRow className="text-left h-[65px] group" key={call.id}>
                                    <TableCell className="pl-5 pr-5">{getCallIcon(call.in_out, call.status)}</TableCell>
                                    <TableCell className="pl-5 pr-5">{formatTime(call.date)}</TableCell>
                                    <TableCell className="pl-5 pr-5">
                                        <Avatar>
                                            <AvatarImage src={call.person_avatar} alt={call.person_name} />
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="pl-5 pr-5">
                                        {formatPhoneNumber(call.partner_data.phone)}
                                    </TableCell>
                                    <TableCell className="pl-5 pr-5">{call.contact_company}</TableCell>
                                    <TableCell className="pl-5 pr-5">
                                        <Badge variant={getBadgeVariant(rating)}>{rating}</Badge>
                                    </TableCell>

                                    <TableCell className="text-right w-[320px]">
                                        <CallRecord
                                            recordId={call.record}
                                            partnershipId={call.partnership_id}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right pl-5 pr-5">{formatDuration(call.time)}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            )}
        </div>
    );
};

export default CallList;
