import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Tree } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { HelpCircle, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface CreateTreeMeasurementProps {
    tree: Tree;
}

export default function CreateTreeMeasurement({ tree }: CreateTreeMeasurementProps) {
    const [measurementType, setMeasurementType] = useState('diameter');
    const [trunkValue, setTrunkValue] = useState<string>('');
    const [photoFields, setPhotoFields] = useState([
        { id: 0, file: null as File | null, note: '' },
        { id: 1, file: null as File | null, note: '' },
    ]);
    const [nextPhotoId, setNextPhotoId] = useState(2);

    const { data, setData, post, processing, errors } = useForm({
        tree_id: tree.id,
        trunk_diameter: '',
        height: '',
        inclination: '',
        note: '',
        photos: [] as { file: File | null; note: string }[],
    });

    // Update trunk diameter when trunkValue or measurementType changes
    useEffect(() => {
        if (trunkValue) {
            const numValue = parseFloat(trunkValue);
            if (!isNaN(numValue) && numValue > 0) {
                // If circumference, convert to diameter (C = πD, so D = C/π)
                const diameter = measurementType === 'circumference' ? Math.round(numValue / Math.PI) : Math.round(numValue);
                setData('trunk_diameter', diameter.toString());
            } else {
                setData('trunk_diameter', '');
            }
        } else {
            setData('trunk_diameter', '');
        }
    }, [trunkValue, measurementType, setData]);

    // Sync photoFields state with the form data state whenever it changes
    useEffect(() => {
        const photosToSubmit = photoFields
            .filter((field) => field.file)
            .map((field) => ({
                file: field.file,
                note: field.note,
            }));
        setData('photos', photosToSubmit);
    }, [photoFields, setData]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tree Map',
            href: '/tree-map',
        },
        {
            title: 'Tree Details',
            href: `/trees/${tree.id}`,
        },
        {
            title: 'Add Measurement',
            href: `/trees/${tree.id}/measurements/create`,
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/trees/${tree.id}/measurements`);
    };

    const handleFileChange = (id: number, file: File | null) => {
        setPhotoFields((prevFields) => prevFields.map((field) => (field.id === id ? { ...field, file } : field)));
    };

    const handleNoteChange = (id: number, note: string) => {
        setPhotoFields((prevFields) => prevFields.map((field) => (field.id === id ? { ...field, note } : field)));
    };

    const addPhotoField = () => {
        setPhotoFields([...photoFields, { id: nextPhotoId, file: null, note: '' }]);
        setNextPhotoId(nextPhotoId + 1);
    };

    const removePhotoField = (id: number) => {
        if (photoFields.length > 2) {
            setPhotoFields(photoFields.filter((field) => field.id !== id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Tree Measurement" />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Add Tree Measurement</CardTitle>
                        <CardDescription>Add measurement data for {tree.tree_species?.name || 'this tree'}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Trunk Size */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="trunk-size" className="text-base">
                                        Trunk Size (DBH)
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="ml-1 h-5 w-5">
                                                        <HelpCircle className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="max-w-xs">
                                                        Diameter at Breast Height (DBH) is measured at 1.3 meters above ground level. You can enter
                                                        either the diameter or circumference.
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </Label>
                                </div>
                                <div className="flex flex-col items-start space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
                                    <div className="w-full sm:w-2/3">
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                id="trunk-size"
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                value={trunkValue}
                                                onChange={(e) => setTrunkValue(e.target.value)}
                                                placeholder={measurementType === 'circumference' ? 'Circumference in cm' : 'Diameter in cm'}
                                                className={errors.trunk_diameter ? 'border-red-500' : ''}
                                            />
                                            <span className="text-sm font-medium">cm</span>
                                        </div>
                                        {errors.trunk_diameter && <p className="mt-1 text-sm text-red-500">{errors.trunk_diameter}</p>}
                                    </div>
                                    <ToggleGroup
                                        type="single"
                                        value={measurementType}
                                        onValueChange={(value) => {
                                            if (value) setMeasurementType(value);
                                        }}
                                        className="justify-start"
                                    >
                                        <ToggleGroupItem value="diameter" aria-label="Toggle diameter">
                                            Diameter
                                        </ToggleGroupItem>
                                        <ToggleGroupItem value="circumference" aria-label="Toggle circumference">
                                            Circumference
                                        </ToggleGroupItem>
                                    </ToggleGroup>
                                </div>
                            </div>

                            {/* Tree Height */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="height" className="text-base">
                                        Tree Height
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="ml-1 h-5 w-5">
                                                        <HelpCircle className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="max-w-xs">Enter the height of the tree in meters.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        id="height"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        max="999.99"
                                        value={data.height}
                                        onChange={(e) => setData('height', e.target.value)}
                                        placeholder="Height in meters"
                                        className={errors.height ? 'border-red-500' : ''}
                                    />
                                    <span className="text-sm font-medium">m</span>
                                </div>
                                {errors.height && <p className="mt-1 text-sm text-red-500">{errors.height}</p>}
                            </div>

                            {/* Inclination */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="inclination" className="text-base">
                                        Inclination
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="ml-1 h-5 w-5">
                                                        <HelpCircle className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="max-w-xs">
                                                        Enter the inclination of the tree in degrees (0-90). 0 means the tree is perfectly vertical,
                                                        90 means it's horizontal.
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        id="inclination"
                                        type="number"
                                        min="0"
                                        max="90"
                                        value={data.inclination}
                                        onChange={(e) => setData('inclination', e.target.value)}
                                        placeholder="Inclination in degrees"
                                        className={errors.inclination ? 'border-red-500' : ''}
                                    />
                                    <span className="text-sm font-medium">°</span>
                                </div>
                                {errors.inclination && <p className="mt-1 text-sm text-red-500">{errors.inclination}</p>}
                            </div>

                            {/* Photos */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base">
                                        Photos
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="ml-1 h-5 w-5">
                                                        <HelpCircle className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="max-w-xs">
                                                        Upload at least 2 photos of the tree. Each photo can have an optional note.
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addPhotoField} className="flex items-center">
                                        <Plus className="mr-1 h-4 w-4" /> Add Photo
                                    </Button>
                                </div>

                                {photoFields.map((field, index) => (
                                    <div key={field.id} className="space-y-2 rounded-md border p-4">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor={`photo-${field.id}`} className="text-sm font-medium">
                                                Photo {index + 1} {index < 2 && <span className="text-red-500">*</span>}
                                            </Label>
                                            {index >= 2 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removePhotoField(field.id)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                        <Input
                                            id={`photo-${field.id}`}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                handleFileChange(field.id, file);
                                            }}
                                            className={errors.photos ? 'border-red-500' : ''}
                                        />
                                        <Textarea
                                            placeholder="Optional note about this photo"
                                            value={field.note}
                                            onChange={(e) => handleNoteChange(field.id, e.target.value)}
                                            className="h-20"
                                        />
                                        {(errors as Record<string, string>)[`photos.${index}.note`] && (
                                            <p className="mt-1 text-sm text-red-500">{(errors as Record<string, string>)[`photos.${index}.note`]}</p>
                                        )}
                                    </div>
                                ))}

                                {errors.photos && <p className="mt-1 text-sm text-red-500">{errors.photos}</p>}
                            </div>

                            {/* Note */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="note" className="text-base">
                                        Note
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="ml-1 h-5 w-5">
                                                        <HelpCircle className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="max-w-xs">Optional note about this measurement.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </Label>
                                </div>
                                <Textarea
                                    id="note"
                                    value={data.note}
                                    onChange={(e) => setData('note', e.target.value)}
                                    placeholder="Optional note about this measurement"
                                    className="h-32"
                                />
                                {errors.note && <p className="mt-1 text-sm text-red-500">{errors.note}</p>}
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={processing}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Measurement'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
