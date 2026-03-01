<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\{MasterData, Profile};
use App\Repositories;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(MasterData\OfficeRepositoryInterface::class, Repositories\MasterData\OfficeRepository::class);
        $this->app->bind(Profile\PpidRepositoryInterface::class, Repositories\Profile\PpidRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (config('app.env') === 'production') {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }

        \Illuminate\Support\Facades\Gate::before(function ($user, $ability) {
            return $user->hasRole(config('permission.superior_role_name')) ? true : null;
        });
    }
}
