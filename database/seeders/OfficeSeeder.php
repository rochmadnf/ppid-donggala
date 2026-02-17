<?php

namespace Database\Seeders;

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
                'address' => 'Jl. Jati, Kompleks Perkantoran Pemda Kelurahan Gunung Bale Banawa',
                'phone' => null,
                'site_url' => 'https://donggala.go.id',
            ],
            [
                'name' => 'Dinas Komunikasi dan Informatika',
                'alias' => 'Diskominfo',
                'address' => 'Jl. Jati No. 14 Kel. Gunung Bale, Kec. Banawa, Kab. Donggala',
                'phone' => null,
                'site_url' => 'https://kominfo.donggala.go.id',
            ],
            [
                'name' => 'Dinas Perhubungan',
                'alias' => 'Dishub',
                'address' => 'Jl. Kabonga Besar, Kec. Banawa, Kabupaten Donggala',
                'phone' => null,
                'site_url' => 'https://dishubdonggala.com',
            ]
        ])->each(function ($office) {
            \App\Models\MasterData\Office::updateOrCreate(['name' => $office['name']], Arr::except($office, ['name']));
        });
    }
}
