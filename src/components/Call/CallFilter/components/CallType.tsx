import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ChevronDown} from "lucide-react";
import {useState} from "react";

const CallType = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
                <DropdownMenuTrigger asChild>
                    <Button className="pl-0 gap-[4px] col-[#5E7793]" variant="ghost">
                        Все типы
                        <ChevronDown size="20px" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                     color="#5E7793"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white flex flex-col rounded-lg ">
                    <DropdownMenuGroup className="flex flex-col rounded-lg ">
                        <Button variant="dropdown">Все типы</Button>
                        <Button variant="dropdown">Входящие</Button>
                        <Button variant="dropdown">Исходящие</Button>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default CallType;
