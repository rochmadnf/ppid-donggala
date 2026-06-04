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

    public function delete(int|string $value, ?string $columnName = null): bool
    {
        $record = $this->find(value: $value, columnName: $columnName ?? $this->defaultColumnName, wrap: false);

        // delete foto profile jika ada
        delete_file_exists($record->photo);

        return $record->delete();
    }
}
