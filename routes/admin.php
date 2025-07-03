<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    Route::get('/users', function () {
        return Inertia::render('admin/users');
    })->name('users');

    Route::get('/roles', function () {
        return Inertia::render('admin/roles');
    })->name('roles');
});
