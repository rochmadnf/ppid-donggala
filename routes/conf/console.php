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
                Route::post('', 'store')->name('store');
                Route::put('{office_id}', 'update')->name('update');
                Route::delete('{office_id}', 'destroy')->name('destroy');
            });

        //@positions
        Route::controller(MasterData\PositionController::class)
            ->prefix('positions')
            ->name('positions.')
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
                Route::patch('{slug}/content-update', 'update')->name('update');
            });
        // @public-officers
        Route::controller(Profile\PublicOfficerController::class)
            ->prefix('public-officers')
            ->name('public-officers.')
            ->group(function () {
                Route::get('', 'index')->name('index');
                Route::post('', 'store')->name('store');
                Route::delete('{poid}', 'destroy')->name('destroy');

                Route::prefix('d')->group(function () {
                    Route::get('{poid}', 'show')->name('show');
                    Route::post('{poid}/photo', 'updatePhoto')->name('photo.update');

                    Route::put('{poid}', 'update')->name('update');
                });
            });
    });
});
