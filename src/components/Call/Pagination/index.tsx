
import React, { useCallback, useMemo } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination.tsx";

interface PaginationComponentProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageChange = useCallback((page: number) => {
        if (page > 0 && page <= totalPages) {
            onPageChange(page);
        }
    }, [onPageChange, totalPages]);

    const renderPageNumbers = useMemo(() => {
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
    }, [currentPage, totalPages, handlePageChange]);

    return (
        <Pagination className="text-gray-500 pt-5">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={() => handlePageChange(currentPage - 1)}
                    />
                </PaginationItem>
                {renderPageNumbers}
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={() => handlePageChange(currentPage + 1)}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default React.memo(PaginationComponent);
