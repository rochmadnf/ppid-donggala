<?php

namespace App\Models\MasterData;

use App\Models\Scopes\SearchableScope;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    use HasUuids, SearchableScope;

    protected $fillable = [
        'name',
        'only_for',
    ];

    public function uniqueIds(): array
    {
        return ['uuid'];
    }
}
