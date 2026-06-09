<?php

use App\Http\Controllers\Auth;
use Illuminate\Support\Facades\Route;

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
