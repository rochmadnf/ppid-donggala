<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\MasterData;

use App\Http\Resources\MasterData\OfficeResource;
use App\Models\MasterData\Office;
use App\Repositories\Contracts\MasterData\OfficeRepositoryInterface;
use App\Repositories\Eloquent\BaseRepository;
use Illuminate\Http\Resources\Json\JsonResource;

class OfficeRepository extends BaseRepository implements OfficeRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(
            model: new Office,
            resource: OfficeResource::class,
        );
    }

    public function paginate(array $relations = [], array $searchFields = ['name', 'alias'], int $perPage = 10): JsonResource
    {
        $offices = Office::sortByRankAndName()
            ->withMerger()
            ->searchByKeyword($searchFields)
            ->excludeMerged()
            ->paginate(perPage: request()->input('per_page', $perPage));

        return OfficeResource::collection($offices);
    }
}
