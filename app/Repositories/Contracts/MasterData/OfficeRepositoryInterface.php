<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\MasterData;

use Illuminate\Http\Resources\Json\JsonResource;

interface OfficeRepositoryInterface
{
    /**
     * Get all offices with pagination.
     *
     * @return array
     */
    public function paginate(): JsonResource;
}
