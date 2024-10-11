import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {subDays} from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


export const getBadgeVariant = (rating: string) => {
    switch (rating) {
        case 'плохо':
            return 'bad';
        case 'хорошо':
            return 'good';
        case 'отлично':
            return 'excellent';
        default:
            return 'default';
    }
};

export const getRandomRating = () => {
    const ratings = ["плохо", "хорошо", "отлично"];
    return ratings[Math.floor(Math.random() * ratings.length)];
};

export const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false});
};


export const formatTimePlayer = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

export const formatDuration = (seconds: number) => {
    if (seconds === 0) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatPhoneNumber = (phoneNumber: string) => {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
        return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
    }
    return phoneNumber;
};


export const calculateDateRange = (period: string) => {
    const today = new Date();
    switch (period) {
        case "3 дня":
            return {from: subDays(today, 3), to: today};
        case "Неделя":
            return {from: subDays(today, 7), to: today};
        case "Месяц":
            return {from: subDays(today, 30), to: today};
        case "Год":
            return {from: subDays(today, 365), to: today};
        default:
            return {from: subDays(today, 3), to: today};
    }
};
