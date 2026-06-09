<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Profile;

use App\Http\Resources\Profile\PpidResource;
use App\Models\Profile\Ppid;
use App\Repositories\Contracts\Profile\PpidRepositoryInterface;
use App\Repositories\Eloquent\BaseRepository;

class PpidRepository extends BaseRepository implements PpidRepositoryInterface
{
    protected string $defaultColumnName = 'slug';

    public function __construct()
    {
        parent::__construct(
            model: new Ppid,
            resource: PpidResource::class,
        );
    }
}
