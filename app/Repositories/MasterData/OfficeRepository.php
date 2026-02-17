<?php

declare(strict_types=1);

namespace App\Repositories\MasterData;

use App\Http\Resources\MasterData\OfficeResource;
use App\Models\MasterData\Office;
use App\Repositories\Contracts\MasterData\OfficeRepositoryInterface;
use Illuminate\Http\Resources\Json\JsonResource;

class OfficeRepository implements OfficeRepositoryInterface
{
    public function paginate(): JsonResource
    {
        $offices = Office::withMerger()
            ->searchByKeyword()
            ->excludeMerged()
            ->paginate(perPage: request()->input('per_page', config('pagination.per_page')));

        return OfficeResource::collection($offices);
    }
}
