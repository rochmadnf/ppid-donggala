<?php

namespace App\Models\Spatie;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Role extends \Spatie\Permission\Models\Role
{
    use HasUuids;

    public function uniqueIds(): array
    {
        return ['uuid'];
    }
}
