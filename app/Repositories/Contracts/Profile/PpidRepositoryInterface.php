<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Profile;

use Illuminate\Http\Resources\Json\JsonResource;

interface PpidRepositoryInterface
{
    /**
     * Get all ppid profile with pagination.
     *
     * @return array
     */
    public function paginate(): JsonResource;

    public function find(string $value, string $columnName = 'slug', bool $wrap = true): JsonResource;

    public function update(array $data, string $columnValue, string $columnName = 'slug'): void;
}
