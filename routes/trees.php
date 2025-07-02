<?php

use App\Http\Controllers\TreeController;
use App\Http\Controllers\TreeMeasurementController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('trees', TreeController::class);

    // Tree Measurements routes
    Route::get('trees/{tree}/measurements/create', [TreeMeasurementController::class, 'create'])->name('trees.measurements.create');
    Route::post('trees/{tree}/measurements', [TreeMeasurementController::class, 'store'])->name('trees.measurements.store');
});
