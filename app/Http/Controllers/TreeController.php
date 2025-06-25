<?php

namespace App\Http\Controllers;

use App\Models\Tree;
use App\Http\Requests\StoreTreeRequest;
use App\Http\Requests\UpdateTreeRequest;
use App\Models\TreeCondition;
use App\Models\TreeLocationConfidence;
use App\Models\TreeSpecies;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TreeController extends Controller
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
    public function create()
    {
        return Inertia::render('trees/create', [
            'treeSpecies' => TreeSpecies::all(),
            'treeConditions' => TreeCondition::all(),
            'treeLocationConfidences' => TreeLocationConfidence::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTreeRequest $request)
    {
        $validatedData = $request->validated();
        $validatedData['user_id'] = auth()->id();
        $tree = Tree::create($validatedData);
        return to_route('trees.show', $tree->id);
    }

    /**
     * Display the specified resource.
     */
    public function show(Tree $tree)
    {
        // Load tree with basic relationships (excluding measurements)
        $tree->load([
            'treeSpecies',
            'treeCondition',
            'treeLocationConfidence',
            'user:id,username',
        ]);

        // Paginate tree measurements
        $perPage = 3; // Same as the frontend's measurementsPerPage
        $measurements = $tree->treeMeasurements()
            ->with(['user:id,username', 'treePhotos'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return Inertia::render('trees/show', [
            'tree' => $tree,
            'measurements' => $measurements,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tree $tree)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTreeRequest $request, Tree $tree)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tree $tree)
    {
        //
    }
}
