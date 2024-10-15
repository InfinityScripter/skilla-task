
import React, { useState, useContext, useCallback } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
import { CallContext } from "@/context/CallContext";

const callTypes = ['Все типы', 'Входящие', 'Исходящие'];

interface CallTypeProps {
    onTypeChange?: (type: string) => void;
}

const CallType: React.FC<CallTypeProps> = ({ onTypeChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { callType } = useContext(CallContext)!;

    const handleSelectType = useCallback((type: string) => {
        onTypeChange?.(type);
        setIsOpen(false);
    }, [onTypeChange]);

    const resetFilters = useCallback(() => {
        onTypeChange?.("Все типы");
    }, [onTypeChange]);

    return (
        <div className="flex items-center text-gray-500">
            <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
                <DropdownMenuTrigger asChild>
                    <Button className="pl-0 gap-[4px] col-[#5E7793]" variant="ghost">
                        {callType}
                        <ChevronDown size="20px" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} color="#5E7793" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white flex flex-col rounded-[6px]">
                    <DropdownMenuGroup className="flex flex-col">
                        {callTypes.map(type => (
                            <Button
                                key={type}
                                variant="dropdown"
                                onClick={() => handleSelectType(type)}
                                className={callType === type ? 'text-blue-600' : 'text-gray-500'}
                            >
                                {type}
                            </Button>
                        ))}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {callType !== "Все типы" && (
                <Button
                    variant="ghost"
                    className="reset-filter"
                    onClick={resetFilters}
                >
                    Сбросить фильтры
                    <X size={16} className="text-[#5e7793] ml-1" />
                </Button>
            )}
        </div>
    );
};

export default React.memo(CallType);
