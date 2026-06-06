<?php

namespace App\Http\Resources\Profile;

use App\Enums\ReligionEnum;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicOfficerResource extends JsonResource
{
    public function __construct($resource, protected bool $isDetail = false)
    {
        return parent::__construct($resource);
    }

    private function defautlPhoto(int $gender, int $religion): string
    {

        $fileName = match (true) {
            $gender === 1 => 'po-male',
            $gender === 0 && $religion === ReligionEnum::ISLAM->value => 'po-female-hijab',
            default => 'po-female',
        };

        return storage_asset("images/default/$fileName.webp");
    }

    public function toArray(Request $request): array
    {
        $base = [
            'id' => $this->uuid,
            'name' => $this->fullname,
            'office' => [
                'id' => $this->office->uuid,
                'name' => $this->office->name,
                'alias' => $this->office->alias,
                'rank' => $this->office->rank,
            ],
            'position' => [
                'id' => $this->position->uuid,
                'name' => $this->position->name,
            ],
            'photo' => is_null($this->photo) ? $this->defautlPhoto($this->gender, $this->religion->value) : storage_asset($this->photo) . '?t=' . $this->updated_at->timestamp,
            'is_active' => $this->is_active,
            'period_start' => $this->period_start,
            'period_end' => $this->period_end,
        ];

        if ($this->isDetail) {
            return array_merge($base, [
                'birth_place' => $this->birth_place,
                'birth_date' => $this->birth_date,
                'last_education' => $this->last_education,
                'gender' => $this->gender,
                'religion' => $this->religion,
                'marital_status' => $this->marital_status,
                'cv' => $this->curriculumVitaeOfficers->count() > 0 ? CurriculumVitaeOfficerResource::collection($this->curriculumVitaeOfficers)->resolve() : [],
            ]);
        }

        return $base;
    }
}
