<?php

use App\Http\Controllers\TreeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('trees', TreeController::class);
});
