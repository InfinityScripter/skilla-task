import { useEffect, useState } from 'react';
import { CallInterface } from '@/types/callTypes.ts';
import { fetchCalls } from "@/lib/services/callService.ts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge.tsx";
import {getBadgeVariant, getRandomRating} from "@/lib/utils.ts";

import CallInIcon from '@/assets/icons/call_in.svg';
import CallOutIcon from '@/assets/icons/call_out.svg';
import MissedInIcon from '@/assets/icons/missed_in.svg';
import MissedOutIcon from '@/assets/icons/missed_out.svg';


const getCallIcon = (in_out: number | undefined, status: string) => {
    if (in_out === 1) {
        if (status === 'Не дозвонился') return <img src={MissedInIcon} alt="Пропущенный входящий звонок" />;
        return <img src={CallInIcon} alt="Входящий звонок" />;
    } else if (in_out === 0) {
        if (status === 'Не дозвонился') return <img src={MissedOutIcon} alt="Пропущенный исходящий звонок" />;
        return <img src={CallOutIcon} alt="Исходящий звонок" />;
    }
    return null;
};

const CallList = () => {
    const [calls, setCalls] = useState<CallInterface[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const loadCalls = async () => {
            try {
                const data = await fetchCalls('2024-01-01', '2023-01-31');
                setCalls(data.results);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
                setError('Не удалось загрузить звонки');
            }
        };

        loadCalls();
    }, []);

    return (
        <div className="bg-white rounded-xl">
            {error && <p className="text-red-600">{error}</p>}
            {!error && calls.length === 0 && <p>Загрузка звонков...</p>}
            {calls.length > 0 && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="table-header-font pt-5 pb-6 pl-5 pr-5">Тип</TableHead>
                            <TableHead className="table-header-font pt-5 pb-6 pl-5 pr-5">Время</TableHead>
                            <TableHead className="table-header-font pt-5 pb-6 pl-5 pr-5">Сотрудник</TableHead>
                            <TableHead className="table-header-font pt-5 pb-6 pl-5 pr-5">Звонок</TableHead>
                            <TableHead className="table-header-font pt-5 pb-6 pl-5 pr-5">Источник</TableHead>
                            <TableHead className="table-header-font pt-5 pb-6 pl-5 pr-5">Оценка</TableHead>
                            <TableHead className="table-header-font pt-5 pb-6 pl-5 pr-5">Длительность</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {calls.map((call) => {
                            const rating = getRandomRating();
                            return (
                                <TableRow key={call.id}>
                                    <TableCell className="w-[25px]">{getCallIcon(call.in_out, call.status)}</TableCell>
                                    <TableCell>{new Date(call.date).toLocaleTimeString()}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Avatar>
                                                <AvatarImage src={call.person_avatar} alt={call.person_name} />
                                            </Avatar>
                                        </div>
                                    </TableCell>
                                    <TableCell>{call.partner_data.phone}</TableCell>
                                    <TableCell>{call.partner_data.name}</TableCell>
                                    <TableCell className="text-left">
                                        <Badge variant={getBadgeVariant(rating)}>{rating}</Badge>
                                    </TableCell>
                                    <TableCell>{call.time}</TableCell>
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
