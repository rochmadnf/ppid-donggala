<?php

namespace App\Models\MasterData;

use App\Enums\OfficeRankEnum;
use App\Models\Scopes\SearchableScope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Office extends Model
{
    use HasUuids, SearchableScope;

    protected $fillable = [
        'name',
        'alias',
        'rank',
        'address',
        'phone',
        'site_url',
    ];

    protected $casts = [
        'merged_office_ids' => 'array',
        'rank' => OfficeRankEnum::class,
    ];

    public function uniqueIds(): array
    {
        return [
            'uuid',
        ];
    }

    public function scopeSortByRankAndName(Builder $query): void
    {
        $query->orderBy('rank')->orderBy('name');
    }

    public function scopeWithMerger(Builder $query): void
    {
        $query->with(['mergerOf', 'mergedBy']);
    }

    /**
     * Standalone office
     * office that is not involved in any merger
     */
    public function scopeStandalone(Builder $query): void
    {
        $query->whereDoesntHave('mergedBy')->whereDoesntHave('mergerOf');
    }

    /**
     * Consolidated office
     * office that has merged other offices but is not merged by another office
     */
    public function scopeConsolidated(Builder $query): void
    {
        $query->whereHas('mergerOf')->whereDoesntHave('mergedBy');
    }

    /**
     * Subsidiary office
     * office that is merged by another office but has not merged other offices
     */
    public function scopeSubsidiary(Builder $query): void
    {
        $query->whereDoesntHave('mergerOf')->whereHas('mergedBy');
    }

    public function scopeExcludeMerged(Builder $query): void
    {
        $query->whereDoesntHave('mergedBy');
    }

    public function mergerOf(): BelongsToMany
    {
        return $this->belongsToMany(self::class, 'office_mergers', 'office_id', 'merged_office_id');
    }

    public function mergedBy(): BelongsToMany
    {
        return $this->belongsToMany(self::class, 'office_mergers', 'merged_office_id', 'office_id');
    }
}
