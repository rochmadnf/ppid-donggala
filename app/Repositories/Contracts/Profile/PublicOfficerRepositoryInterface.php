<?php

declare(strict_types=1);

namespace App\Repositories\Contracts\Profile;

use App\Repositories\Contracts\BaseRepositoryInterface;
use Illuminate\Http\Resources\Json\JsonResource;

interface PublicOfficerRepositoryInterface extends BaseRepositoryInterface
{
    public function all(): JsonResource;
}
