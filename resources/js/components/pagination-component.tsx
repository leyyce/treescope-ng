import React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Paginator } from '@/types';
import { router } from '@inertiajs/react';

interface PaginationComponentProps<T> {
    paginator: Paginator<T>
    only?: string[];
}

export function PaginationComponent<T>({ paginator, only = [] }: PaginationComponentProps<T>) {
    if (paginator.links.length <= 3) {
        return null;
    }

    const handleVisit = (url: string) => {
        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
            only,
        });
    };

    return (
        <Pagination>
            <PaginationContent>
                {paginator.links.map((link, index) => {
                    // Item: Previous Link
                    if (link.label.includes('Previous')) {
                        return (
                            <PaginationItem key={index}>
                                <PaginationPrevious
                                    onClick={() => link.url && handleVisit(link.url)}
                                    // Apply disabled styles manually
                                    className={
                                        !link.url
                                            ? 'pointer-events-none opacity-50'
                                            : ''
                                    }
                                />
                            </PaginationItem>
                        );
                    }

                    // Item: Next Link
                    if (link.label.includes('Next')) {
                        return (
                            <PaginationItem key={index}>
                                <PaginationNext
                                    onClick={() => link.url && handleVisit(link.url)}
                                    // Apply disabled styles manually
                                    className={
                                        !link.url
                                            ? 'pointer-events-none opacity-50'
                                            : ''
                                    }
                                />
                            </PaginationItem>
                        );
                    }

                    // Item: Ellipsis
                    if (link.label.includes('...')) {
                        return (
                            <PaginationItem key={index}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    // Item: Numeric Link (This part was already correct)
                    return (
                        <PaginationItem key={index}>
                            <PaginationLink
                                onClick={() => link.url && handleVisit(link.url)}
                                isActive={link.active}
                            >
                                {link.label}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
            </PaginationContent>
        </Pagination>
    );
}
