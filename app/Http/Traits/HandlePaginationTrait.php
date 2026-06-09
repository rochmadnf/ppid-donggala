<?php

declare(strict_types=1);

namespace App\Http\Traits;

use Illuminate\Http\RedirectResponse;

trait HandlePaginationTrait
{
    protected function redirectToValidPage(
        int $remaining,
        int $defaultPerPage = 10,
        ?string $routeName = null,
        array $extraParams = [],
    ): RedirectResponse {

        $previousUrl = url()->previous();

        // Ambil query string dari URL sebelumnya
        $parseUrl = parse_url($previousUrl, PHP_URL_QUERY);

        $newParams = [];

        if (! is_null($parseUrl)) {

            parse_str($parseUrl, $query);

            $currentPage = (int) ($query['page'] ?? 1);
            $perPage = (int) ($query['per_page'] ?? $defaultPerPage);

            $lastPage = max((int) ceil($remaining / $perPage), 1);
            $targetPage = min($currentPage, $lastPage);

            $newParams = array_merge($query, [
                'page' => $targetPage,
                'per_page' => $perPage,
            ], $extraParams);
        }

        if (is_null($routeName)) {
            $routeName = app('router')->getRoutes()->match(
                request()->create($previousUrl, 'GET'),
            )->getName();
        }

        return redirect()->route($routeName, $newParams);
    }
}
