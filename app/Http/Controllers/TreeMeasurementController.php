<?php

namespace App\Http\Controllers;

use App\Models\Tree;
use App\Models\TreeMeasurement;
use App\Models\TreePhoto;
use App\Http\Requests\StoreTreeMeasurementRequest;
use App\Http\Requests\UpdateTreeMeasurementRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TreeMeasurementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Tree $tree)
    {
        return Inertia::render('trees/measurements/create', [
            'tree' => $tree->load('treeSpecies'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTreeMeasurementRequest $request, Tree $tree)
    {
        $validatedData = $request->validated();

        // Create the measurement
        $measurement = TreeMeasurement::create([
            'tree_id' => $validatedData['tree_id'],
            'user_id' => $validatedData['user_id'],
            'height' => $validatedData['height'],
            'inclination' => $validatedData['inclination'],
            'trunk_diameter' => $validatedData['trunk_diameter'],
            'note' => $validatedData['note'] ?? null,
        ]);

        // Process and store photos
        if (isset($validatedData['photos']) && is_array($validatedData['photos'])) {
            foreach ($validatedData['photos'] as $photoData) {
                if (!isset($photoData['file']) || !$photoData['file']->isValid()) {
                    continue;
                }

                $file = $photoData['file'];

                // Generate a unique filename
                $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

                // Store the file
                $path = $file->storeAs('tree-photos', $filename, 'public');

                // Create photo record
                TreePhoto::create([
                    'tree_measurement_id' => $measurement->id,
                    'user_id' => $validatedData['user_id'],
                    'path' => $path,
                    'note' => $photoData['note'] ?? null,
                ]);
            }
        }

        return redirect()->route('trees.show', $tree->id)
            ->with('success', 'Tree measurement added successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(TreeMeasurement $treeMeasurement)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TreeMeasurement $treeMeasurement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTreeMeasurementRequest $request, TreeMeasurement $treeMeasurement)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TreeMeasurement $treeMeasurement)
    {
        //
    }
}
