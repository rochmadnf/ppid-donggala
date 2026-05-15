<?php

declare(strict_types=1);

namespace App\Repositories\Eloquent\Profile;

use App\Http\Resources\Profile\PublicOfficerResource;
use App\Models\Profile\PublicOfficer;
use App\Repositories\Contracts\Profile\PublicOfficerRepositoryInterface;
use App\Repositories\Eloquent\BaseRepository;

class PublicOfficerRepository extends BaseRepository implements PublicOfficerRepositoryInterface
{
    protected string $defaultColumnName = 'uuid';

    public function __construct()
    {
        parent::__construct(
            model: new PublicOfficer(),
            resource: PublicOfficerResource::class
        );
    }
}
