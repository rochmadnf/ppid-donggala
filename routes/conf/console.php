<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Console;

Route::middleware('auth')->prefix('console')->name('console.')->group(function () {
    Route::get('/', [Console\DashboardController::class, 'index'])->name('dashboard');

    Route::controller(Console\PublicInformationController::class)
        ->prefix('public-information/{category}')
        ->whereIn('category', ['setiap-saat', 'berkala', 'dikecualikan', 'serta-merta'])
        ->name('public-information.')
        ->group(function () {
            Route::get('', 'index')->name('index');
        });

    Route::controller(Console\MasterData\OfficeController::class)
        ->prefix('master-data/offices')
        ->name('master-data.offices.')
        ->group(function () {
            Route::get('', 'index')->name('index');
        });
});
