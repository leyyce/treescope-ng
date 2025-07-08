<?php

use App\Models\Tree;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'permission:access user panel'])->name('user.')->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('user/dashboard');
    })->name('dashboard')->middleware(['permission:view user dashboard']);;

    Route::get('/tree-map', function () {
        return Inertia::render('user/map-view', [
            'trees' => Tree::with(['treeSpecies', 'treeCondition', 'treeMeasurements', 'user:id,username'])->get()
        ]);
    })->name('map-view')->middleware(['permission:view tree map']);
});
