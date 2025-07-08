<?php

use App\Http\Controllers\TreeController;
use App\Http\Controllers\TreeMeasurementController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('trees')->name('trees.')->group(function () {
    Route::resource('trees', TreeController::class);

    Route::get('/create', [TreeController::class, 'create'])->name('create')->middleware(['permission:add tree']);
    Route::post('/', [TreeController::class, 'store'])->name('store')->middleware(['permission:add tree']);
    Route::get('/{tree}', [TreeController::class, 'show'])->name('show')->middleware(['permission:view validated tree|view unvalidated tree']);

    // Tree Measurements routes
    Route::get('/{tree}/measurements/create', [TreeMeasurementController::class, 'create'])->name('measurements.create')->middleware(['permission:create measurement']);
    Route::post('/{tree}/measurements', [TreeMeasurementController::class, 'store'])->name('measurements.store')->middleware(['permission:create measurement']);
});
