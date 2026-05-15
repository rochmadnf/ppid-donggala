<?php

namespace App\Models\Profile;

use App\Enums\{EducationLevelEnum, MaritalStatusEnum, ReligionEnum};
use App\Models\MasterData\{Office, Position};
use App\Models\Scopes\SearchableScope;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class PublicOfficer extends Model
{
    use HasUuids, SearchableScope;

    protected $fillable = [
        'fullname',
        'birth_place',
        'birth_date',
        'last_education',
        'gender',
        'religion',
        'marital_status',
        'position_id',
        'office_id',
        'period_start',
        'period_end',
        'is_active',
        'photo',
    ];

    public function casts(): array
    {
        return [
            'birth_date' => 'date',
            'period_start' => 'date',
            'period_end' => 'date',
            'is_active' => 'boolean',
            'last_education' => EducationLevelEnum::class,
            'religion' => ReligionEnum::class,
            'marital_status' => MaritalStatusEnum::class,
        ];
    }

    public function uniqueIds(): array
    {
        return ['uuid'];
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    public function office()
    {
        return $this->belongsTo(Office::class);
    }
}
