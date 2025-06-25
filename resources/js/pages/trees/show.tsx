import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Tree } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface ShowTreeProps {
    tree: Tree;
}

export default function ShowTree({ tree }: ShowTreeProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tree Map',
            href: '/tree-map',
        },
        {
            title: 'Tree Details',
            href: `/trees/${tree.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tree Details" />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="w-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Tree Details</CardTitle>
                            <CardDescription>View details about this tree.</CardDescription>
                        </div>
                        <Button asChild className="ml-auto">
                            <Link href={`/trees/${tree.id}/measurements/create`}>Add a measurement</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Tree Species */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium">Tree Species</h3>
                                <div className="rounded-md border bg-muted/50 p-4">
                                    <div className="text-sm font-medium">{tree.tree_species?.name || 'Unknown'}</div>
                                    {tree.tree_species?.scientific_name && (
                                        <div className="text-sm text-muted-foreground italic">{tree.tree_species.scientific_name}</div>
                                    )}
                                    {tree.tree_species?.description && (
                                        <div className="mt-2 text-sm text-muted-foreground">{tree.tree_species.description}</div>
                                    )}
                                </div>
                            </div>

                            {/* Tree Condition */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium">Tree Condition</h3>
                                <div className="rounded-md border bg-muted/50 p-4">
                                    <div className="text-sm font-medium">{tree.tree_condition?.name || 'Unknown'}</div>
                                    {tree.tree_condition?.description && (
                                        <div className="mt-2 text-sm text-muted-foreground">{tree.tree_condition.description}</div>
                                    )}
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium">Location</h3>
                                <div className="rounded-md border bg-muted/50 p-4">
                                    <div className="text-sm">
                                        Coordinates: {tree.location.coordinates[1].toFixed(6)}, {tree.location.coordinates[0].toFixed(6)}
                                    </div>
                                </div>
                            </div>

                            {/* Added By */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium">Added Information</h3>
                                <div className="rounded-md border bg-muted/50 p-4">
                                    <div className="text-sm">Added by: {tree.user?.username || 'Unknown'}</div>
                                    <div className="text-sm text-muted-foreground">{new Date(tree.created_at).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
