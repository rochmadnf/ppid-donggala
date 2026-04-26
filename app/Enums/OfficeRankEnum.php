<?php

namespace App\Enums;

enum OfficeRankEnum: int
{
    case PEMKAB = 1;
    case DINAS = 2;
    case BADAN = 3;
    case KECAMATAN = 4;
    case DESA = 5;
    case KELURAHAN = 6;

    public function label(): string
    {
        return match ($this) {
            self::PEMKAB => 'Kabupaten',
            self::DINAS => 'Dinas',
            self::BADAN => 'Badan',
            self::KECAMATAN => 'Kecamatan',
            self::DESA => 'Desa',
            self::KELURAHAN => 'Kelurahan',
        };
    }

    public static function options(): array
    {
        return collect(self::cases())
            ->mapWithKeys(fn($item) => [
                $item->value => $item->label()
            ])
            ->toArray();
    }
}
