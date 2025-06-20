<?php

use App\Models\Tree;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/tree-map', function () {
        return Inertia::render('treemap', [
            'trees' => Tree::with(['treeType', 'healthStatus', 'measurements'])->get()
        ]);
    })->name('tree-map');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/trees.php';
