<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth;

Route::prefix('console')->group(function () {
    Route::get('/login', [Auth\AuthenticatedSessionController::class, 'index'])->name('login');
});
