<?php

namespace App\Http\Resources\MasterData;

use Illuminate\Http\{Request, Resources\Json\JsonResource};
use Illuminate\Support\Collection;

class OfficeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->uuid,
            'name' => [
                'raw' => $this->name,
                'alias' => $this->alias,
            ],
            'address' => $this->address,
            'phone' => $this->phone,
            'merger' => [
                'of' => $mergerOf = $this->resolveMerger('mergerOf'),
                'by' => $mergedBy = $this->resolveMerger('mergedBy'),
            ],
            'site_url' => $mergerOf->isEmpty() && $mergedBy->isNotEmpty() ? "#" : $this->site_url,
        ];
    }

    protected function resolveMerger(string $relation): Collection
    {
        return $this->whenLoaded(
            $relation,
            fn() => $this->{$relation}
                ->map(fn($office) => [
                    'id' => $office->uuid,
                    'name' => [
                        'raw' => $office->name,
                        'alias' => $office->alias,
                    ],
                    'site_url' => $relation === 'mergerOf' ? "#" : $office->site_url,
                ])
                ->values(),
            collect()
        );
    }
}
