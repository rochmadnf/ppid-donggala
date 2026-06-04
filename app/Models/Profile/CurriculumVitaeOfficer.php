<?php

namespace App\Models\Profile;

use App\Enums\CurriculumVitaeTypeEnum;
use Illuminate\Database\Eloquent\Model;

class CurriculumVitaeOfficer extends Model
{
    protected $fillable = [
        'title',
        'institution',
        'period_start',
        'period_end',
        'public_officer_id',
        'category',
    ];

    public function casts(): array
    {
        return [
            'category' => CurriculumVitaeTypeEnum::class,
        ];
    }

    public function publicOfficer()
    {
        return $this->belongsTo(PublicOfficer::class);
    }
}
