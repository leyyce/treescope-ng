import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import LocationDisplay from '@/components/location-display';
import type { BreadcrumbItem, Paginator as PaginationType, Tree, TreeMeasurement, TreePhoto } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { InertiaPaginator } from '@/components/inertia_paginator';
import { Icon } from 'leaflet';
import treeMarker from '../../../img/tree_marker.svg';

interface ShowTreeProps {
    tree: Tree;
    measurements: PaginationType<TreeMeasurement>;
}

interface MeasurementCardProps {
    measurement: TreeMeasurement;
}

const treeIcon = new Icon({
    iconUrl: treeMarker,
    iconRetinaUrl: treeMarker,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

function MeasurementCard({ measurement }: MeasurementCardProps) {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [photos, setPhotos] = useState<TreePhoto[]>([]);

    useEffect(() => {
        // Filter out measurements without photos
        if (measurement.tree_photos && measurement.tree_photos.length > 0) {
            console.log('Measurement photos:', measurement.tree_photos);
            setPhotos(measurement.tree_photos);
        }
    }, [measurement]);

    const navigatePhoto = (direction: 'prev' | 'next') => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentPhotoIndex((prevIndex) => {
                if (direction === 'next') {
                    return (prevIndex + 1) % photos.length;
                } else {
                    return (prevIndex - 1 + photos.length) % photos.length;
                }
            });
            setIsTransitioning(false);
        }, 300); // Transition duration
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="rounded-md border bg-card p-4 shadow-sm">
            <div className="mb-4 flex flex-col space-y-2">
                <div className="flex justify-between">
                    <span>
                        <p className="text-sm">Measured by</p>
                        <h4 className="font-medium">{measurement.user?.username}</h4>
                    </span>
                    <span className="text-sm text-muted-foreground">{formatDate(measurement.created_at)}</span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                        <h4 className="text-sm font-medium">Height</h4>
                        <p className="text-sm">{measurement.height} m</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium">Inclination</h4>
                        <p className="text-sm">{measurement.inclination}°</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium">Trunk Diameter</h4>
                        <p className="text-sm">{measurement.trunk_diameter} cm</p>
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-medium">Notes</h4>
                    <p className="text-sm text-muted-foreground h-16 overflow-y-auto">
                        {measurement.note || <span className="text-muted-foreground/50">No notes available</span>}
                    </p>
                </div>
            </div>

            {photos.length > 0 && (
                <div className="relative mt-4 overflow-hidden rounded-md">
                    <div
                        className={`relative aspect-video w-full overflow-hidden rounded-md bg-muted transition-opacity duration-500 ${
                            isTransitioning ? 'opacity-0' : 'opacity-100'
                        }`}
                    >
                        <img
                            src={photos[currentPhotoIndex].url}
                            alt={`Tree photo ${currentPhotoIndex + 1}`}
                            className="h-full w-full object-cover"
                        />

                        {/* Navigation buttons */}
                        {photos.length > 1 && (
                            <>
                                {/* Left button - hide if at first photo */}
                                {currentPhotoIndex > 0 && (
                                    <button
                                        onClick={() => navigatePhoto('prev')}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                                        aria-label="Previous photo"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M15 18l-6-6 6-6" />
                                        </svg>
                                    </button>
                                )}

                                {/* Right button - hide if at last photo */}
                                {currentPhotoIndex < photos.length - 1 && (
                                    <button
                                        onClick={() => navigatePhoto('next')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                                        aria-label="Next photo"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 18l6-6-6-6" />
                                        </svg>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                    {photos.length > 1 && (
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                            {photos.map((_, index) => (
                                <button
                                    key={index}
                                    className={`h-1.5 w-1.5 rounded-full ${
                                        index === currentPhotoIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                                    }`}
                                    onClick={() => setCurrentPhotoIndex(index)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function ShowTree({ tree, measurements }: ShowTreeProps) {
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
                                <div className="rounded-md border bg-muted/50 p-4" style={{ height: '400px' }}>
                                    <LocationDisplay
                                        lat={tree.location.coordinates[0]}
                                        lng={tree.location.coordinates[1]}
                                        customMarkerIcon={treeIcon}
                                    />
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

                            {/* Measurements */}
                            <div id="measurements-section" className="space-y-2">
                                <h3 className="text-lg font-medium">Measurements</h3>
                                {measurements.total > 0 ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            {measurements.data.map((measurement: TreeMeasurement) => (
                                                <MeasurementCard key={measurement.id} measurement={measurement} />
                                            ))}
                                        </div>

                                        {measurements.total > 1 && (
                                            <InertiaPaginator
                                                paginator={measurements}
                                                only={['measurements']}
                                                scrollTarget="measurements-section"
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <div className="rounded-md border bg-muted/50 p-4">
                                        <div className="text-sm text-muted-foreground">No measurements available for this tree.</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
