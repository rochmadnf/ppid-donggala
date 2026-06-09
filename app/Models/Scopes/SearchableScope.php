<?php

declare(strict_types=1);

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;

trait SearchableScope
{
    /**
     * Scope to filter by keyword search.
     *
     * @param  string|array  $defaultColumns  The default columns to search if 'search_by' is not provided.
     */
    public function scopeSearchByKeyword(Builder $query, string|array $defaultColumns = 'name'): void
    {
        $query->when(
            request()->has('keyword') && ! is_null(request()->input('keyword')),
            fn (Builder $q) => $q->when(is_array($defaultColumns), function (Builder $_q) use ($defaultColumns) {
                $_q->where(function (Builder $q) use ($defaultColumns) {
                    foreach ($defaultColumns as $column) {
                        $q->orWhere($column, 'LIKE', '%' . request()->input('keyword') . '%');
                    }
                });
            }),
        );
    }
}
