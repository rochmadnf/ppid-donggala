<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Profile;

use App\Http\Resources\Profile\PublicOfficerResource;
use App\Models\Profile\PublicOfficer;
use App\Repositories\Contracts\Profile\PublicOfficerRepositoryInterface;
use App\Repositories\Eloquent\BaseRepository;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicOfficerRepository extends BaseRepository implements PublicOfficerRepositoryInterface
{
    protected string $defaultColumnName = 'uuid';

    public function __construct()
    {
        parent::__construct(
            model: new PublicOfficer,
            resource: PublicOfficerResource::class,
        );
    }

    public function paginate(array $relations = [], array $searchFields = ['name'], int $perPage = 10): JsonResource
    {
        $records = PublicOfficer::searchByKeyword($searchFields)
            ->when(count($relations) >= 1, fn ($qWith) => $qWith->with($relations))
            ->where('is_active', request()->input('is_active') === 'no' ? false : true)
            ->paginate(perPage: request()->input('per_page', $perPage));

        return $this->resource::collection($records);
    }

    public function all(): JsonResource
    {
        $records = PublicOfficer::query()
            ->orderByRank()
            ->active()
            ->with(['office', 'position'])
            ->paginate(20);

        return $this->resource::collection($records);
    }

    public function delete(int|string $value, ?string $columnName = null): bool
    {
        $record = $this->find(value: $value, columnName: $columnName ?? $this->defaultColumnName, wrap: false);

        // delete foto profile jika ada
        delete_file_exists($record->photo);

        return $record->delete();
    }
}
