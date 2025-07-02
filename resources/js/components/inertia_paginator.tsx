import React, { useState, useEffect } from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Paginator } from '@/types';
import { router } from '@inertiajs/react';

interface PaginationComponentProps<T> {
    paginator: Paginator<T>
    only?: string[];
    scrollTarget?: string;
}

export function InertiaPaginator<T>({ paginator, only = [], scrollTarget }: PaginationComponentProps<T>) {
    const [perPage, setPerPage] = useState<number>(paginator.per_page);
    const [inputPerPage, setInputPerPage] = useState<string>(paginator.per_page.toString());

    useEffect(() => {
        // Update perPage and inputPerPage state when paginator.per_page changes
        setPerPage(paginator.per_page);
        setInputPerPage(paginator.per_page.toString());
    }, [paginator.per_page]);

    const handleVisit = (url: string) => {
        // If the URL already has a per_page parameter, we need to replace it
        const urlObj = new URL(url, window.location.origin);
        urlObj.searchParams.set('per_page', perPage.toString());

        let targetElement: Element | null = null;

        if (scrollTarget) {
            targetElement = document.getElementById(scrollTarget)
        }

        const options = {
            preserveState: true,
            preserveScroll: !!targetElement,
            only,
            onSuccess: () => {
                if (targetElement) {
                    // Create a one-time intersection observer
                    const observer = new IntersectionObserver((entries) => {
                        // Once we have the element in the DOM
                        const targetElement = entries[0].target;

                        // Scroll it into view
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });

                        // Disconnect the observer after first use
                        observer.disconnect();
                    });

                    // Start observing when DOM updates are complete
                    requestAnimationFrame(() => {
                        if (targetElement) {
                            observer.observe(targetElement);
                        }
                    });
                }
            }
        };

        router.visit(urlObj.pathname + urlObj.search, options);
    };

    const handlePerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputPerPage(e.target.value);
    };

    const handleApply = () => {
        const parsedValue = parseInt(inputPerPage);
        if (!isNaN(parsedValue) && parsedValue > 0) {
            setPerPage(parsedValue);

            // Get the current URL and update the per_page parameter
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('per_page', parsedValue.toString());

            const options = {
                preserveState: true,
                only,
                preserveScroll: true, // Keep the scroll position during the visit
            };

            router.visit(currentUrl.pathname + currentUrl.search, options);
        }
    };

    // Check if the input is a valid number greater than 0
    const isValidInput = () => {
        const parsedValue = parseInt(inputPerPage);
        return !isNaN(parsedValue) && parsedValue > 0;
    };

    return (
        <div className="flex flex-col space-y-4 w-full max-w-full overflow-hidden px-1">
            <Pagination>
                <PaginationContent className="flex-wrap justify-center">
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
            <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-sm text-muted-foreground">Items per page:</span>
                <Input
                    type="number"
                    value={inputPerPage}
                    onChange={handlePerPageChange}
                    className="w-16 h-8 min-w-0"
                />
                <Button
                    size="sm"
                    onClick={handleApply}
                    disabled={!isValidInput()}
                >
                    Apply
                </Button>
            </div>
        </div>
    );
}
