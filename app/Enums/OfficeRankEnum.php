<?php

namespace App\Enums;

enum OfficeRankEnum: int
{
    case PEMKAB = 1;
    case SETDA = 2;
    case DINAS = 3;
    case BADAN = 4;
    case KECAMATAN = 5;
    case DESA = 6;
    case KELURAHAN = 7;

    public function label(): string
    {
        return match ($this) {
            self::PEMKAB => 'Kabupaten',
            self::SETDA => 'Sekretariat Daerah',
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
            ->map(fn ($item) => [
                'id' => $item->value,
                'label' => $item->label(),

            ])
            ->toArray();
    }
}
