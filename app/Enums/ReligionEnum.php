<?php

namespace App\Enums;

enum ReligionEnum: int
{
    case ISLAM = 1;
    case CATHOLIC = 2;
    case PROTESTANT = 3;
    case HINDU = 4;
    case BUDDHA = 5;
    case KONGHUCU = 6;

    public function label(): string
    {
        return match ($this) {
            self::ISLAM => 'Islam',
            self::CATHOLIC => 'Katolik',
            self::PROTESTANT => 'Protestan',
            self::HINDU => 'Hindu',
            self::BUDDHA => 'Budha',
            self::KONGHUCU => 'Konghuchu',
        };
    }

    public static function options(): array
    {
        return collect(self::cases())
            ->map(fn($item) => [
                "id" => $item->value,
                "label" => $item->label()
            ])
            ->toArray();
    }
}
