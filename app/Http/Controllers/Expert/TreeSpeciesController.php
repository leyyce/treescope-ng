<?php

namespace App\Http\Controllers\Expert;

use App\Http\Controllers\Controller;
use App\Models\TreeSpecies;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TreeSpeciesController extends Controller
{
    /**
     * Display a listing of the tree species.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 20);
        $search = $request->input('search', '');

        $treeSpecies = TreeSpecies::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('scientific_name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('expert/tree-species', [
            'treeSpecies' => $treeSpecies,
            'filters' => [
                'search' => $search,
            ]
        ]);
    }

    /**
     * Store a newly created tree species in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:tree_species,name',
            'scientific_name' => 'nullable|string|max:255',
            'description' => 'required|string',
            'a' => 'nullable|numeric',
            'b' => 'nullable|numeric',
            'c' => 'nullable|numeric',
            'd' => 'nullable|numeric',
            'e' => 'nullable|numeric',
            'f' => 'nullable|numeric',
            'g' => 'nullable|numeric',
        ]);

        TreeSpecies::create($validated);

        return back()->with('success', 'Tree species created successfully.');
    }

    /**
     * Update the specified tree species in storage.
     */
    public function update(Request $request, TreeSpecies $treeSpecies)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:tree_species,name,' . $treeSpecies->id,
            'scientific_name' => 'nullable|string|max:255',
            'description' => 'required|string',
            'a' => 'nullable|numeric',
            'b' => 'nullable|numeric',
            'c' => 'nullable|numeric',
            'd' => 'nullable|numeric',
            'e' => 'nullable|numeric',
            'f' => 'nullable|numeric',
            'g' => 'nullable|numeric',
        ]);

        $treeSpecies->update($validated);

        return back()->with('success', 'Tree species updated successfully.');
    }

    /**
     * Remove the specified tree species from storage.
     */
    public function destroy(TreeSpecies $treeSpecies)
    {
        // Check if the tree species is associated with any trees
        if ($treeSpecies->trees()->count() > 0) {
            return back()->withErrors(['error' => 'Cannot delete tree species that is associated with trees.']);
        }

        $treeSpecies->delete();

        return back()->with('success', 'Tree species deleted successfully.');
    }
}
