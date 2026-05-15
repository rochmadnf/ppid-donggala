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
        $fileName = 'po-male';


        if ($gender === 0 && $religion === ReligionEnum::ISLAM->value) {
            $fileName = 'po-female-hijab';
        } else {
            $fileName = 'po-female';
        }

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
            ],
            'position' => [
                'id' => $this->position->uuid,
                'name' => $this->position->name,
            ],
            'photo' => is_null($this->photo) ? $this->defautlPhoto($this->gender, $this->religion->value) : storage_asset($this->photo),
            'is_active' => $this->is_active,
        ];

        if ($this->isDetail) {
            return array_merge($base, [
                'birth_place' => $this->birth_place,
                'birth_date' => $this->birth_date->translatedFormat('d F Y'),
                'last_education' => $this->last_education->label(),
                'gender' => $this->gender === 1 ? 'Laki-laki' : 'Perempuan',
                'religion' => $this->religion->label(),
                'marital_status' => $this->marital_status->label(),
                'period_start' => $this->period_start->translatedFormat('d F Y'),
                'period_end' => is_null($this->period_end) ? "Sekarang" : $this->period_end->translatedFormat('d F Y'),
            ]);
        }

        return $base;
    }
}
