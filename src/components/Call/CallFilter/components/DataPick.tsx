import React, { useContext, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { calculateDateRange, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CallContext } from "@/context/CallContext";
import { DateRange } from "react-day-picker";
import {DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";

interface DatePickProps {
    onDateChange?: (range: { start: string; end: string }) => void;
}

const periods = ["3 дня", "Неделя", "Месяц", "Год"];

const DatePick: React.FC<DatePickProps> = ({ onDateChange }) => {
    const { dateRange } = useContext(CallContext)!;
    const [activePeriod, setActivePeriod] = useState("3 дня");
    const [isCustomDateSelected, setIsCustomDateSelected] = useState(false);

    // Обновление диапазона при смене периода
    const updateDateRange = (newPeriod: string) => {
        setActivePeriod(newPeriod);
        const newRange = calculateDateRange(newPeriod);
        onDateChange?.({
            start: format(newRange.from, "yyyy-MM-dd"),
            end: format(newRange.to, "yyyy-MM-dd"),
        });
        setIsCustomDateSelected(false);
    };

    const handleArrowClick = (direction: "left" | "right") => {
        const currentIndex = periods.indexOf(activePeriod);
        const newIndex = direction === "left"
            ? (currentIndex - 1 + periods.length) % periods.length
            : (currentIndex + 1) % periods.length;
        updateDateRange(periods[newIndex]);
    };

    const handleDateSelect = (range: DateRange | undefined) => {
        if (range?.from && !range.to) {
            onDateChange?.({
                start: format(range.from, "yyyy-MM-dd"),
                end: format(range.from, "yyyy-MM-dd"),
            });
        } else if (range?.from && range?.to) {
            onDateChange?.({
                start: format(range.from, "yyyy-MM-dd"),
                end: format(range.to, "yyyy-MM-dd"),
            });
        }
        setIsCustomDateSelected(true);
    };

    return (
        <div className="text-gray-500 flex content-baseline">
            <Button variant="ghost" className="text-gray-500 hover:text-blue-500 " onClick={() => handleArrowClick("left")}>
                <ChevronLeft />
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="  gap-2 ">
                        <CalendarIcon size={24} className="ml-auto h-4 w-4 " />
                        {isCustomDateSelected
                            ? `${format(new Date(dateRange.start), "LLL dd, y")} - ${format(new Date(dateRange.end), "LLL dd, y")}`
                            : activePeriod}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white shadow-md rounded-xl z-10">
                    <DropdownMenuGroup className="flex flex-col">
                        {periods.map((period) => (
                            <Button
                                key={period}
                                variant="ghost"
                                onClick={() => updateDateRange(period)}
                                className={`w-full text-left  ${
                                    activePeriod === period && !isCustomDateSelected
                                        ? " text-blue-600"
                                        : "hover:bg-blue-100"
                                }`}
                            >
                                {period}
                            </Button>
                        ))}
                        <div className={cn("grid gap-2")}>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={"ghost"}
                                        className={cn(
                                            "w-auto h-auto flex flex-col gap-2 justify-start text-left font-normal hover:bg-blue-100",
                                            !dateRange && "text-muted-foreground"
                                        )}
                                    >
                                        <span>Указать даты</span>
                                        <span className="flex flex-row gap-2">
                                            {dateRange?.start ? (
                                                dateRange.end ? (
                                                    <>
                                                        {format(new Date(dateRange.start), "LLL dd, y")} -{" "}
                                                        {format(new Date(dateRange.end), "LLL dd, y")}
                                                    </>
                                                ) : (
                                                    format(new Date(dateRange.start), "LLL dd, y")
                                                )
                                            ) : (
                                                <span>Выберите дату</span>
                                            )}
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                        </span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-white" align="start">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        selected={{
                                            from: dateRange?.start ? new Date(dateRange.start) : undefined,
                                            to: dateRange?.end ? new Date(dateRange.end) : undefined,
                                        }}
                                        onSelect={handleDateSelect}
                                        numberOfMonths={1}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" className="text-gray-500 hover:text-blue-500" onClick={() => handleArrowClick("right")}>
                <ChevronRight  />
            </Button>
        </div>
    );
};

export default React.memo(DatePick);
