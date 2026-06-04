<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PositionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect([
            ['name' => 'Bupati', 'only_for' => 1],
            ['name' => 'Wakil Bupati', 'only_for' => 1],
            ['name' => 'Sekretaris Daerah', 'only_for' => 1],
            ['name' => 'Asisten Pemerintahan dan Kesra', 'only_for' => 1],
            ['name' => 'Asisten Perekonomian dan Pembangunan', 'only_for' => 1],
            ['name' => 'Asisten Administrasi Umum', 'only_for' => 1],
            ['name' => 'Kepala Dinas', 'only_for' => 2],
            ['name' => 'Sekretaris Dinas', 'only_for' => 2],
            ['name' => 'Kepala Bidang Statistik Sektoral & Persandian', 'only_for' => 2],
            ['name' => 'Kepala Bidang Informasi & Komunikasi Publik', 'only_for' => 2],
            ['name' => 'Kepala Bidang Aplikasi Informatika & E-Government', 'only_for' => 2],
            ['name' => 'Kepala Badan', 'only_for' => 3],
            ['name' => 'Sekretaris Badan', 'only_for' => 3],
            ['name' => 'Camat', 'only_for' => 4],
            ['name' => 'Sekretaris Kecamatan', 'only_for' => 4],
            ['name' => 'Kepala Desa', 'only_for' => 5],
            ['name' => 'Sekretaris Desa', 'only_for' => 5],
            ['name' => 'Lurah', 'only_for' => 6],
            ['name' => 'Sekretaris Kelurahan', 'only_for' => 6],
        ])->each(fn($position) => \App\Models\MasterData\Position::updateOrCreate([
            'name' => $position['name'],
        ], [
            'only_for' => $position['only_for'],
        ]));
    }
}
