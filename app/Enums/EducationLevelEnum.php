<?php

namespace App\Enums;

enum EducationLevelEnum: int
{
    case NONE = 0;
    case PAUD = 1;
    case TK = 2;
    case SD = 3;
    case SD_A = 4;
    case SMP = 5;
    case SMP_B = 6;
    case SMA = 7;
    case SMA_C = 8;
    case D1 = 9;
    case D2 = 10;
    case D3 = 11;
    case D4 = 12;
    case S1 = 13;
    case PROFFESION = 14;
    case SPECIALIST = 15;
    case SUB_SPECIALIST = 16;
    case S2 = 17;
    case S3 = 18;

    public function label(): string
    {
        return match ($this) {
            self::NONE => 'Tidak Sekolah',
            self::PAUD => 'Pendidikan Anak Usia Dini (PAUD)',
            self::TK => 'Taman Kanak-kanak (TK)',
            self::SD => 'SD / MI',
            self::SD_A => 'SD / MI - (Paket A)',
            self::SMP => 'SMP / MTs',
            self::SMP_B => 'SMP / MTs - (Paket B)',
            self::SMA => 'SMA / SMK / MA',
            self::SMA_C => 'SMA / SMK / MA - (Paket C)',
            self::D1 => 'Diploma 1',
            self::D2 => 'Diploma 2',
            self::D3 => 'Diploma 3',
            self::D4 => 'Diploma 4 / Sarjana Terapan',
            self::S1 => 'Sarjana (S1)',
            self::PROFFESION => 'Profesi',
            self::SPECIALIST => 'Spesialis',
            self::SUB_SPECIALIST => 'Sub Spesialis',
            self::S2 => 'Magister (S2)',
            self::S3 => 'Doktor (S3)',
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
