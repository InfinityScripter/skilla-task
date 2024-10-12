import { useContext, useState, useRef } from "react";
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
import {
    Pagination,
    PaginationContent,
    PaginationItem, PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.tsx";

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
    const {
        filteredCalls,
        setSortOrder,
        currentPage,
        setCurrentPage,
        totalPages,
    } = useContext(CallContext)!;

    const [sortBy, setSortBy] = useState<string | null>(null);
    const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [playingRecords, setPlayingRecords] = useState<{ [key: number]: boolean }>({});

    const ratingsCache = useRef<{ [key: string]: string }>({});

    const handlePlayStateChange = (callId: number, isPlaying: boolean) => {
        setPlayingRecords((prevState) => ({
            ...prevState,
            [callId]: isPlaying,
        }));
    };

    const getRating = (callId: string) => {
        if (!ratingsCache.current[callId]) {
            ratingsCache.current[callId] = getRandomRating();
        }
        return ratingsCache.current[callId];
    };

    const handleSortChange = (column: string) => {
        const newOrder = sortBy === column && order === 'ASC' ? 'DESC' : 'ASC';
        setSortBy(column);
        setOrder(newOrder);
        setSortOrder(`${column}_${newOrder}`);
    };

    const getChevronIcon = (column: string) => {
        if (sortBy === column) {
            return order === 'ASC' ? <ChevronUp size={20} /> : <ChevronDown size={20} />;
        }
        return <ChevronDown size={20} />;
    };

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];

        if (currentPage > 2) {
            pages.push(
                <PaginationItem key={1}>
                    <PaginationLink href="#" onClick={() => handlePageChange(1)}>1</PaginationLink>
                </PaginationItem>
            );
        }

        if (currentPage > 3) {
            pages.push(<PaginationItem key="left-ellipsis">...</PaginationItem>);
        }

        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(totalPages, currentPage + 1);
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href="#"
                        onClick={() => handlePageChange(i)}
                        isActive={currentPage === i}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        if (currentPage < totalPages - 2) {
            pages.push(<PaginationItem key="right-ellipsis">...</PaginationItem>);
        }

        if (currentPage < totalPages - 1) {
            pages.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink href="#" onClick={() => handlePageChange(totalPages)}>
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return pages;
    };

    return (
        <div className="bg-white rounded-xl">
            {filteredCalls.length === 0 && <p>Звонков нет...</p>}
            {filteredCalls.length > 0 && (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
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
                            {filteredCalls.map((call, index) => {
                                const rating = getRating(call.id.toString());
                                return (
                                    <TableRow
                                        key={call.id}
                                        className="text-left h-[65px] group"
                                        onMouseEnter={() => setHoveredRow(index)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                    >
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
                                            {hoveredRow === index || playingRecords[call.id] ? (
                                                <CallRecord
                                                    recordId={call.record}
                                                    partnershipId={call.partnership_id}
                                                    onPlayStateChange={(isPlaying: boolean) =>
                                                        handlePlayStateChange(call.id, isPlaying)
                                                    }
                                                />
                                            ) : (
                                                <span className="pl-5 pr-5 text-right">{formatDuration(call.time)}</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                />
                            </PaginationItem>
                            {renderPageNumbers()}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </>
            )}
        </div>
    );
};

export default CallList;
