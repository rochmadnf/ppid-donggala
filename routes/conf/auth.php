<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth;

Route::prefix('console')->group(function () {

    // Guest
    Route::controller(Auth\AuthenticatedSessionController::class)->group(function () {
        Route::middleware('guest')->group(function () {
            Route::get('login', 'index')->name('login');
            Route::post('login', 'login');
        });
        Route::middleware('auth')->group(function () {
            Route::post('logout', 'logout')->name('logout');
        });
    });
});
