<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\MasterData;

use App\Http\Resources\MasterData\OfficeResource;
use App\Models\MasterData\Office;
use Illuminate\Http\Resources\Json\JsonResource;

class OfficeRepository extends \App\Repositories\Eloquent\BaseRepository
implements \App\Repositories\Contracts\MasterData\OfficeRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(
            model: new Office(),
            resource: OfficeResource::class
        );
    }

    public function paginate(int $perPage = 10): JsonResource
    {
        $offices = Office::sortByRankAndName()
            ->withMerger()
            ->searchByKeyword()
            ->excludeMerged()
            ->paginate(perPage: request()->input('per_page', $perPage));

        return OfficeResource::collection($offices);
    }
}
