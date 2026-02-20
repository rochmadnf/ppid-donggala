<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Console\{MasterData, Profile, DashboardController, PublicInformationController};

Route::middleware('auth')->prefix('console')->name('console.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    Route::controller(PublicInformationController::class)
        ->prefix('public-information/{category}')
        ->whereIn('category', ['setiap-saat', 'berkala', 'dikecualikan', 'serta-merta'])
        ->name('public-information.')
        ->group(function () {
            Route::get('', 'index')->name('index');
        });

    // @master-data
    Route::prefix('master-data')->name("master-data.")->group(function () {
        // @offices
        Route::controller(MasterData\OfficeController::class)
            ->prefix('offices')
            ->name('offices.')
            ->group(function () {
                Route::get('', 'index')->name('index');
            });
    });

    // @profile
    Route::prefix('profile')->name("profile.")->group(function () {
        // @ppid
        Route::controller(Profile\PpidController::class)
            ->prefix('ppid')
            ->name('ppid.')
            ->group(function () {
                Route::get('', 'index')->name('index');
            });
    });
});
