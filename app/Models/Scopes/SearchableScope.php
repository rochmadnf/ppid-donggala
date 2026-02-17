<?php

declare(strict_types=1);

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;

trait SearchableScope
{
    /**
     * Scope to filter by keyword search.
     *
     * @param  Builder  $query
     * @param  string  $defaultColumn  The default column to search if 'search_by' is not provided.
     * @return void
     */
    public function scopeSearchByKeyword(Builder $query, string $defaultColumn = 'name'): void
    {
        $query->when(
            request()->has('keyword') && strlen(request()->input('keyword')) > 0,
            fn(Builder $q) => $q->where(
                column: request()->input('search_by', $defaultColumn),
                operator: 'LIKE',
                value: '%' . request()->input('keyword') . '%'
            )
        );
    }
}
