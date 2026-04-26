<?php

declare(strict_types=1);

namespace App\Http\Traits;

trait HandlePaginationTrait
{
    protected function redirectToValidPage(
        int $remaining,
        int $defaultPerPage = 10,
        ?string $routeName = null,
        array $extraParams = []
    ): \Illuminate\Http\RedirectResponse {

        $previousUrl = url()->previous();

        // Ambil query string dari URL sebelumnya
        parse_str(parse_url($previousUrl, PHP_URL_QUERY), $query);

        $currentPage = (int) ($query['page'] ?? 1);
        $perPage     = (int) ($query['per_page'] ?? $defaultPerPage);

        $lastPage   = max((int) ceil($remaining / $perPage), 1);
        $targetPage = min($currentPage, $lastPage);

        $newParams = array_merge($query, [
            'page'     => $targetPage,
            'per_page' => $perPage,
        ], $extraParams);

        if (is_null($routeName)) {
            $routeName = app('router')->getRoutes()->match(
                request()->create($previousUrl, 'GET')
            )->getName();
        }


        return redirect()->route($routeName, $newParams);
    }
}
