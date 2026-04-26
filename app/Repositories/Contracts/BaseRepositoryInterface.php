<?php

declare(strict_types=1);

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;

interface BaseRepositoryInterface
{
    public function paginate(int $perPage = 10): JsonResource;

    public function find(int|string $value, ?string $columnName = null, string $operator = '=', bool $wrap = true): Model | JsonResource;

    public function delete(int|string $value, ?string $columnName = null): bool;

    public function update(array $data, string $columnValue, ?string $columnName = null): Model;

    public function count(): int;
}
