<?php

namespace Database\Seeders;

use App\Enums\OfficeRankEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class OfficeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect([
            [
                'name' => 'Pemerintah Kabupaten Donggala',
                'alias' => 'Pemda Donggala',
                'rank' => OfficeRankEnum::PEMKAB->value,
                'address' => 'Jl. Jati, Kompleks Perkantoran Pemda Kelurahan Gunung Bale Banawa',
                'phone' => null,
                'site_url' => 'https://donggala.go.id',
            ],
            [
                'name' => 'Dinas Komunikasi dan Informatika',
                'alias' => 'Diskominfo',
                'rank' => OfficeRankEnum::DINAS_BADAN->value,
                'address' => 'Jl. Jati No. 14 Kel. Gunung Bale, Kec. Banawa, Kab. Donggala',
                'phone' => null,
                'site_url' => 'https://kominfo.donggala.go.id',
            ],
            [
                'name' => 'Dinas Perhubungan',
                'alias' => 'Dishub',
                'rank' => OfficeRankEnum::DINAS_BADAN->value,
                'address' => 'Jl. Kabonga Besar, Kec. Banawa, Kabupaten Donggala',
                'phone' => null,
                'site_url' => 'https://dishubdonggala.com',
            ],
            [
                'name' => 'Badan Pengelolaan Keuangan dan Aset Daerah',
                'alias' => 'BPKAD',
                'rank' => OfficeRankEnum::DINAS_BADAN->value,
                'address' => 'Jl. Jati No. 1, Gunung Bale, Kec. Banawa, Kabupaten Donggala',
                'phone' => null,
                'site_url' => null,
            ],
            [
                'name' => 'Kecamatan Banawa',
                'alias' => 'Banawa',
                'rank' => OfficeRankEnum::KECAMATAN->value,
                'address' => null,
                'phone' => null,
                'site_url' => null,
            ],
            [
                'name' => 'Kecamatan Banawa Tengah',
                'alias' => 'Banawa Tengah',
                'rank' => OfficeRankEnum::KECAMATAN->value,
                'address' => null,
                'phone' => null,
                'site_url' => null,
            ],
            [
                'name' => 'Desa Loli Dondo',
                'alias' => 'Loli Dondo',
                'rank' => OfficeRankEnum::DESA->value,
                'address' => null,
                'phone' => null,
                'site_url' => null,
            ],
            [
                'name' => 'Desa Toaya',
                'alias' => 'Toaya',
                'rank' => OfficeRankEnum::DESA->value,
                'address' => "Jl. Pue Lasadindi No.19, Kec. Sindue, Kab. Donggala",
                'phone' => "+6281314560100",
                'site_url' => "https://toaya-sindue.desa.id",
            ],
            [
                'name' => 'Desa Towale',
                'alias' => 'Towale',
                'rank' => OfficeRankEnum::DESA->value,
                'address' => null,
                'phone' => null,
                'site_url' => "https://towale.digitaldesa.id",
            ],
            [
                'name' => 'Kelurahan Boneoge',
                'alias' => 'Boneoge',
                'rank' => OfficeRankEnum::KELURAHAN->value,
                'address' => null,
                'phone' => null,
                'site_url' => null,
            ],
            [
                'name' => 'Kelurahan Ganti',
                'alias' => 'Ganti',
                'rank' => OfficeRankEnum::KELURAHAN->value,
                'address' => "Jl. Trans Sulawesi Donggala",
                'phone' => null,
                'site_url' => null,
            ],
        ])->each(function ($office) {
            \App\Models\MasterData\Office::updateOrCreate(['name' => $office['name']], Arr::except($office, ['name']));
        });
    }
}
