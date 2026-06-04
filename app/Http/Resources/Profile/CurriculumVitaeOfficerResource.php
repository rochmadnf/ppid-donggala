<?php

namespace App\Http\Resources\Profile;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CurriculumVitaeOfficerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'institution' => $this->institution,
            'period' =>
            [
                's' => (int) $this->period_start,
                'e' => (int) $this->period_end,
                'display' => $this->period_start . " - " . ($this->period_end ? $this->period_end : 'Sekarang'),
            ],
            'category' => $this->category,
        ];
    }
}
