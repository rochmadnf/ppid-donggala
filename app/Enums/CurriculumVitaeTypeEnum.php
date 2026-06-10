<?php

namespace App\Enums;

enum CurriculumVitaeTypeEnum: int
{
    case EDUCATION = 1;
    case POSITION = 2;
    case ORGANIZATION = 3;

    public function label(): string
    {
        return match ($this) {
            self::EDUCATION => 'Pendidikan',
            self::POSITION => 'Jabatan',
            self::ORGANIZATION => 'Organisasi',
        };
    }

    public static function options(): array
    {
        return collect(self::cases())
            ->map(fn ($item) => [
                'id' => $item->value,
                'label' => $item->label(),
            ])
            ->toArray();
    }
}
