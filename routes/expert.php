<?php

use App\Http\Controllers\Expert\TreeSpeciesController;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'permission:access expert panel'])->prefix('expert')->name('expert.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('expert/dashboard');
    })->name('dashboard')->middleware(['permission:view expert dashboard']);

    // Tree Species routes
    Route::get('/tree-species', [TreeSpeciesController::class, 'index'])->name('tree-species')->middleware(['permission:view tree species']);
    Route::post('/tree-species', [TreeSpeciesController::class, 'store'])->name('tree-species.store')->middleware(['permission:create tree species']);
    Route::put('/tree-species/{treeSpecies}', [TreeSpeciesController::class, 'update'])->name('tree-species.update')->middleware(['permission:edit tree species']);
    Route::delete('/tree-species/{treeSpecies}', [TreeSpeciesController::class, 'destroy'])->name('tree-species.destroy')->middleware(['permission:delete tree species']);
});
