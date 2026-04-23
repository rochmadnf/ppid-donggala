<?php

namespace App\Models\MasterData;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'only_for',
    ];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }
}
