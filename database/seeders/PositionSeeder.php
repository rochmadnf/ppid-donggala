<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class PositionSeeder extends Seeder
{
    private function getOfficeUuidByAliasName(string $aliasName): ?string
    {
        return \App\Models\MasterData\Office::where('alias', $aliasName)->value('uuid');
    }

    public function run(): void
    {
        collect([
            ['name' => 'Bupati', 'only_for' => 1, 'rank' => 1, 'office_id' => 'Pemda Donggala'],
            ['name' => 'Wakil Bupati', 'only_for' => 1, 'rank' => 2, 'office_id' => 'Pemda Donggala'],

            ['name' => 'Sekretaris Daerah', 'only_for' => 2, 'rank' => 1, 'office_id' => 'Setda'],
            ['name' => 'Asisten Pemerintahan dan Kesra', 'only_for' => 2, 'rank' => 2, 'office_id' => 'Setda'],
            ['name' => 'Asisten Perekonomian dan Pembangunan', 'only_for' => 2, 'rank' => 2, 'office_id' => 'Setda'],
            ['name' => 'Asisten Administrasi Umum', 'only_for' => 2, 'rank' => 2, 'office_id' => 'Setda'],

            ['name' => 'Kepala Dinas', 'only_for' => 3, 'rank' => 1, 'office_id' => null],
            ['name' => 'Sekretaris Dinas', 'only_for' => 3, 'rank' => 2, 'office_id' => null],

            // Dishub
            ['name' => 'Kepala Bidang Lalu Lintas dan Angkutan', 'only_for' => 3, 'rank' => 3, 'office_id' => 'Dishub'],
            ['name' => 'Kepala Bidang Prasarana', 'only_for' => 3, 'rank' => 3, 'office_id' => 'Dishub'],
            ['name' => 'Kepala Bidang Pengembangan dan Keselamatan', 'only_for' => 3, 'rank' => 3, 'office_id' => 'Dishub'],

            // Diskominfo
            ['name' => 'Kepala Bidang Statistik Sektoral dan Persandian', 'only_for' => 3, 'rank' => 3, 'office_id' => 'Diskominfo'],
            ['name' => 'Kepala Bidang Informasi dan Komunikasi Publik', 'only_for' => 3, 'rank' => 3, 'office_id' => 'Diskominfo'],
            ['name' => 'Kepala Bidang Aplikasi Informatika E-Government', 'only_for' => 3, 'rank' => 3, 'office_id' => 'Diskominfo'],

            ['name' => 'Kepala Badan', 'only_for' => 4, 'rank' => 1, 'office_id' => null],
            ['name' => 'Sekretaris Badan', 'only_for' => 4, 'rank' => 2, 'office_id' => null],

            // BPKAD
            ['name' => 'Kepala Bidang Anggaran', 'only_for' => 4, 'rank' => 3, 'office_id' => 'BPKAD'],
            ['name' => 'Kepala Bidang Akuntansi', 'only_for' => 4, 'rank' => 3, 'office_id' => 'BPKAD'],
            ['name' => 'Kepala Bidang Aset Daerah', 'only_for' => 4, 'rank' => 3, 'office_id' => 'BPKAD'],
            ['name' => 'Kepala Bidang Perbendaharaan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'BPKAD'],

            ['name' => 'Camat', 'only_for' => 5, 'rank' => 1, 'office_id' => null],
            ['name' => 'Sekretaris Kecamatan', 'only_for' => 5, 'rank' => 2, 'office_id' => null],

            ['name' => 'Kepala Desa', 'only_for' => 6, 'rank' => 1, 'office_id' => null],
            ['name' => 'Sekretaris Desa', 'only_for' => 6, 'rank' => 2, 'office_id' => null],

            ['name' => 'Lurah', 'only_for' => 7, 'rank' => 1, 'office_id' => null],
            ['name' => 'Sekretaris Kelurahan', 'only_for' => 7, 'rank' => 2, 'office_id' => null],
        ])->each(fn($position) => \App\Models\MasterData\Position::updateOrCreate([
            'name' => $position['name'],
        ], [
            'only_for' => $position['only_for'],
            'rank' => $position['rank'],
            'office_id' => $position['office_id'] ? $this->getOfficeUuidByAliasName($position['office_id']) : null,
        ]));
    }
}
