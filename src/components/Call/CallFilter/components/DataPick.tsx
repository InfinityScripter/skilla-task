import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { calculateDateRange, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useContext, useState } from "react";
import { CallContext } from "@/context/CallContext";
import { DateRange } from "react-day-picker";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

const periods = ["3 дня", "Неделя", "Месяц", "Год"];

const DatePick = ({
                      className,
                  }: React.HTMLAttributes<HTMLDivElement>) => {
    const { dateRange, setDateRange } = useContext(CallContext)!;
    const [activePeriod, setActivePeriod] = useState("3 дня");
    const [isCustomDateSelected, setIsCustomDateSelected] = useState(false);

    // Обновление диапазона при смене периода
    const updateDateRange = (newPeriod: string) => {
        setActivePeriod(newPeriod);
        const newRange = calculateDateRange(newPeriod);
        setDateRange({
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
            setDateRange({
                start: format(range.from, "yyyy-MM-dd"),
                end: format(range.from, "yyyy-MM-dd"),
            });
        } else if (range?.from && range?.to) {
            setDateRange({
                start: format(range.from, "yyyy-MM-dd"),
                end: format(range.to, "yyyy-MM-dd"),
            });
        }
        setIsCustomDateSelected(true);
    };

    return (
        <div className=" gap-2 text-gray-500">
            <Button variant="ghost" className="px-2 py-2" onClick={() => handleArrowClick("left")}>
                <ChevronLeft />
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="px-4 py-2 gap-2 pr-0">
                        <CalendarIcon size={20} className="ml-auto h-4 w-4 text-gray-400 " />
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
                                className={`w-full text-left px-4 py-2 ${
                                    activePeriod === period && !isCustomDateSelected
                                        ? "bg-blue-100 text-blue-600"
                                        : "hover:bg-gray-100"
                                }`}
                            >
                                {period}
                            </Button>
                        ))}
                        <div className={cn("grid gap-2", className)}>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={"ghost"}
                                        className={cn(
                                            "w-auto h-auto flex flex-col gap-2 justify-start text-left font-normal hover:bg-gray-100",
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
            <Button variant="ghost" className="px-2 py-2" onClick={() => handleArrowClick("right")}>
                <ChevronRight color="#5E7793" />
            </Button>
        </div>
    );
};

export default DatePick;
