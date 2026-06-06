<?php

use Illuminate\Support\Facades\Route;

Route::get('/', \App\Http\Controllers\WelcomeController::class)->name('welcome');

Route::prefix('profile')->name('profile.')->group(function () {
    Route::get('/public-officers', [\App\Http\Controllers\Console\Profile\PublicOfficerController::class, 'index'])->name('public-officers.index');
});
