<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Profile;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Resources\Json\JsonResource;

interface PpidRepositoryInterface
{
    public function paginate(): JsonResource;

    public function find(int|string $value, ?string $columnName = null, string $operator = '=', bool $wrap = true): Model | JsonResource;

    public function delete(int|string $value, ?string $columnName = null): bool;

    public function update(array $data, string $columnValue, ?string $columnName = null): Model;
}
