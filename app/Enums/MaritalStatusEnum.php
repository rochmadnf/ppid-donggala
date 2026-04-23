<?php

namespace App\Enums;

enum MaritalStatusEnum: int
{
    case SINGLE = 1;
    case MARRIED = 2;
    case DIVORCED = 3;
    case WIDOWED = 4;

    public function label(): string
    {
        return match ($this) {
            self::SINGLE => 'Belum Kawin',
            self::MARRIED => 'Kawin',
            self::DIVORCED => 'Cerai Hidup',
            self::WIDOWED => 'Cerai Mati',
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
