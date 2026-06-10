<?php

namespace App\Providers;

use App\Repositories\Contracts\MasterData;
use App\Repositories\Contracts\Profile;
use App\Repositories\Eloquent;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

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
            URL::forceScheme('https');
        }

        Gate::before(function ($user, $ability) {
            return $user->hasRole(config('permission.superior_role_name')) ? true : null;
        });
    }
}
