import { format} from "date-fns";
import {Calendar as CalendarIcon, ChevronLeft, ChevronRight} from "lucide-react";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {HTMLAttributes, useState} from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {DateRange} from "react-day-picker";

const DatePick = ({
                    className,
                }: HTMLAttributes<HTMLDivElement>) => {
    const [activePeriod, setActivePeriod] = useState("3 дня");
    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const periods = ["3 дня", "Неделя", "Месяц","Год"];

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="px-4 py-2 gap-2 pr-0">
                        <ChevronLeft/>
                        <CalendarIcon className="ml-auto h-4 w-4 text-gray-400"/>
                        {activePeriod}
                        <ChevronRight
                            color="#5E7793"
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white shadow-md rounded-lg p-2">
                    <DropdownMenuGroup className="flex flex-col">
                        {periods.map((period) => (
                            <Button
                                key={period}
                                variant="ghost"
                                onClick={() => setActivePeriod(period)}
                                className={`w-full text-left px-4 py-2 ${
                                    activePeriod === period
                                        ? "bg-blue-100 text-blue-600"
                                        : "hover:bg-gray-100"
                                }`}
                            >
                                {period}
                            </Button>
                        ))}
                        <div className={cn("grid gap-2",className)}>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={"outline"}
                                        className={cn(
                                            "w-[300px] justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4"/>
                                        {date?.from ? (
                                            date.to ? (
                                                <>
                                                    {format(date.from, "LLL dd, y")} -{" "}
                                                    {format(date.to, "LLL dd, y")}
                                                </>
                                            ) : (
                                                format(date.from, "LLL dd, y")
                                            )
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={date?.from}
                                        selected={date}
                                        onSelect={setDate}
                                        numberOfMonths={1}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default DatePick;
