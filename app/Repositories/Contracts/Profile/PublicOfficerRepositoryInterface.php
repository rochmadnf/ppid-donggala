<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Profile;

use App\Repositories\Contracts\BaseRepositoryInterface;

interface PublicOfficerRepositoryInterface extends BaseRepositoryInterface
{
    public function all(): \Illuminate\Http\Resources\Json\JsonResource;
}
