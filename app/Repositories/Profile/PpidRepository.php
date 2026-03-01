<?php

declare(strict_types=1);

namespace App\Repositories\Profile;

use App\Http\Resources\Profile\PpidResource;
use App\Models\Profile\Ppid;
use App\Repositories\Contracts\Profile\PpidRepositoryInterface;
use Illuminate\Http\Resources\Json\JsonResource;

class PpidRepository implements PpidRepositoryInterface
{
    public function paginate(): JsonResource
    {
        $profiles = Ppid::paginate(perPage: request()->input('per_page', config('pagination.per_page')));

        return PpidResource::collection($profiles);
    }

    public function find(string $value, string $columnName = 'slug', bool $wrap = true): JsonResource
    {
        $profile = Ppid::where($columnName, $value)->firstOrFail();

        if (!$wrap) {
            return $profile;
        }

        return PpidResource::make($profile);
    }

    public function update(array $data, string $columnValue, string $columnName = 'slug'): void
    {
        $profile = $this->find($columnValue, $columnName);

        $profile->update($data);
    }
}
