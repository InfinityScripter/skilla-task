import React, { useState, useEffect } from 'react';
import { Call } from '@/types/callTypes';
import {fetchCalls} from "@/lib/services/callService.ts";

const CallList: React.FC = () => {
    const [calls, setCalls] = useState<Call[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const loadCalls = async () => {
            try {
                const data = await fetchCalls('2023-01-01', '2023-01-31');
                setCalls(data.results);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
                setError('Не удалось загрузить звонки');
            }
        };

        loadCalls();
    }, []);

    return (
        <div>
            <h1>Список звонков</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!error && calls.length === 0 && <p>Загрузка звонков...</p>}
            {calls.length > 0 && (
                <ul>
                    {calls.map((call) => (
                        <li key={call.id}>
                            Звонок от {call.from_number} на {call.to_number}, статус: {call.status}, id: {call.id}, Partner: {call.partner_data.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CallList;
