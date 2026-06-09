<?php

use App\Http\Controllers\Console\Profile\PublicOfficerController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', WelcomeController::class)->name('welcome');

Route::prefix('profile')->name('profile.')->group(function () {
    Route::get('/public-officers', [PublicOfficerController::class, 'index'])->name('public-officers.index');
});
