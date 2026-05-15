<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\{MasterData, Profile};
use App\Repositories\Eloquent;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $repositories = [
            MasterData\OfficeRepositoryInterface::class => Eloquent\MasterData\OfficeRepository::class,
            Profile\PpidRepositoryInterface::class => Eloquent\Profile\PpidRepository::class,
            Profile\PublicOfficerRepositoryInterface::class => Eloquent\Profile\PublicOfficerRepository::class,
        ];

        foreach ($repositories as $interface => $implementation) {
            $this->app->bind($interface, $implementation);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (app()->isProduction()) {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }

        \Illuminate\Support\Facades\Gate::before(function ($user, $ability) {
            return $user->hasRole(config('permission.superior_role_name')) ? true : null;
        });
    }
}
