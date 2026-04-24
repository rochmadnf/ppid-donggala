<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\MasterData;

use Illuminate\Http\Resources\Json\JsonResource;

interface OfficeRepositoryInterface
{
    public function paginate(): JsonResource;
}
