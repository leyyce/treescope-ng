<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'permission:access admin panel'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard')->middleware(['permission:view admin dashboard']);

    // User routes
    Route::get('/users', [UserController::class, 'index'])->name('users')->middleware(['permission:view users']);
    Route::post('/users', [UserController::class, 'store'])->name('users.store')->middleware(['permission:add user']);
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update')->middleware(['permission:edit user']);
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy')->middleware(['permission:delete user']);

    // Role routes
    Route::get('/roles', [RoleController::class, 'index'])->name('roles')->middleware(['permission:view roles']);
    Route::post('/roles', [RoleController::class, 'store'])->name('roles.store')->middleware(['permission:add role']);
    Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update')->middleware(['permission:edit role']);
    Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy')->middleware(['permission:delete role']);

    // Permission routes
    Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions')->middleware(['permission:view permissions']);
    Route::post('/permissions', [PermissionController::class, 'store'])->name('permissions.store')->middleware(['permission:create permissions']);
    Route::put('/permissions/{permission}', [PermissionController::class, 'update'])->name('permissions.update')->middleware(['permission:edit permissions']);
    Route::delete('/permissions/{permission}', [PermissionController::class, 'destroy'])->name('permissions.destroy')->middleware(['permission:delete permissions']);
});
