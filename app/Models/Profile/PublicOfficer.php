<?php

namespace App\Models\Profile;

use App\Enums\EducationLevelEnum;
use App\Enums\MaritalStatusEnum;
use App\Enums\ReligionEnum;
use App\Models\MasterData\Office;
use App\Models\MasterData\Position;
use App\Models\Scopes\SearchableScope;
use Illuminate\Database\Eloquent\Builder;
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

    public function curriculumVitaeOfficers()
    {
        return $this->hasMany(CurriculumVitaeOfficer::class);
    }

    // -------------------------------------------------------------------------
    // Scopes
    // -------------------------------------------------------------------------

    /**
     * Order by office rank first, then position rank.
     * Menggunakan join agar sorting terjadi di DB level, bukan PHP.
     */
    public function scopeOrderByRank(Builder $query): Builder
    {
        return $query
            ->join('offices', 'offices.id', '=', 'public_officers.office_id')
            ->join('positions', 'positions.id', '=', 'public_officers.position_id')
            ->orderBy('offices.rank')
            ->orderBy('positions.rank')
            ->select('public_officers.*');
    }

    /**
     * Filter hanya yang aktif.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('public_officers.is_active', true);
    }

    /**
     * Filter berdasarkan office.
     */
    public function scopeByOffice(Builder $query, int $officeId): Builder
    {
        return $query->where('public_officers.office_id', $officeId);
    }
}
