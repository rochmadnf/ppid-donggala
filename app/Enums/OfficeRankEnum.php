<?php

namespace App\Enums;

enum OfficeRankEnum: int
{
    case PEMKAB = 1;
    case DINAS_BADAN = 2;
    case KECAMATAN = 3;
    case DESA = 4;
    case KELURAHAN = 5;

    public function label(): string
    {
        return match ($this) {
            self::PEMKAB => 'Pemerintah Kabupaten',
            self::DINAS_BADAN => 'Dinas/Badan',
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
