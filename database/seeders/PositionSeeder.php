<?php

namespace Database\Seeders;

use App\Models\MasterData\Office;
use App\Models\MasterData\Position;
use Illuminate\Database\Seeder;

class PositionSeeder extends Seeder
{
    private function getOfficeUuidByAliasName(string $aliasName): ?string
    {
        return Office::where('alias', $aliasName)->value('uuid');
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

            // Dinkes
            ['name' => 'Kepala Bidang Kesehatan Masyarakat', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dinkes'],
            ['name' => 'Kepala Bidang Pencegahan dan Pengendalian Penyakit', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dinkes'],
            ['name' => 'Kepala Bidang Pelayanan Kesehatan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dinkes'],
            ['name' => 'Kepala Bidang Sumber Daya Kesehatan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dinkes'],

            // Disdikpora
            ['name' => 'Kepala Bidang Pembinaan PAUD dan Pendidikan Masyarakat', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Disdikpora'],
            ['name' => 'Kepala Bidang Sekolah Dasar', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Disdikpora'],
            ['name' => 'Kepala Bidang Sekolah Menengah Pertama', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Disdikpora'],
            ['name' => 'Kepala Bidang Kepermudaan dan Kepramukaan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Disdikpora'],
            ['name' => 'Kepala Bidang Keolahragaan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Disdikpora'],

            // Dinas PUPR
            ['name' => 'Kepala Bidang Sumber Daya Air', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dinas PUPR'],
            ['name' => 'Kepala Bidang Tata Ruang', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dinas PUPR'],
            ['name' => 'Kepala Bidang Cipta Karya', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dinas PUPR'],
            ['name' => 'Kepala Bidang Bina Marga', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dinas PUPR'],
            ['name' => 'Kepala Bidang Jasa Konstruksi', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dinas PUPR'],

            // DLHPPKP
            ['name' => 'Kepala Bidang Pertanahan dan Tata Lingkungan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'DLHPPKP'],
            ['name' => 'Kepala Bidang Perumahan dan Kawasan Permukiman', 'only_for' => 4, 'rank' => 3, 'office_id' => 'DLHPPKP'],
            ['name' => 'Kepala Bidang Penataan dan Peningkatan Kapasitas', 'only_for' => 4, 'rank' => 3, 'office_id' => 'DLHPPKP'],
            ['name' => 'Kepala Bidang Pengendalian Pencemaran, Pengelolaan Sampah dan Limbah B3', 'only_for' => 4, 'rank' => 3, 'office_id' => 'DLHPPKP'],

            // Satpol PP
            ['name' => 'Kepala Bidang Ketentraman dan Ketertiban Umum', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Satpol PP'],
            ['name' => 'Kepala Bidang Penegakan Perundang-Undangan Daerah', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Satpol PP'],
            ['name' => 'Kepala Bidang Perlindungan Masyarakat', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Satpol PP'],

            // Dinsos PMD
            ['name' => 'Kepala Bidang Perlindungan dan Jaminan Sosial', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dinsos PMD'],
            ['name' => 'Kepala Bidang Pelayanan dan Rehabilitasi Sosial', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dinsos PMD'],
            ['name' => 'Kepala Bidang Pemberdayaan Sosial', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dinsos PMD'],
            ['name' => 'Kepala Bidang Pembinaan Penyelenggaraan Administrasi Pemerintahan dan Keuangan Desa', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dinsos PMD'],
            ['name' => 'Kepala Bidang Pemberdayaan Kelembagaan Masyarakat dan Pengembangan Usaha Ekonomi Desa', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dinsos PMD'],

            // Disnakertrans
            ['name' => 'Kepala Bidang Penempatan Tenaga Kerja dan Hubungan Industrial', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Disnakertrans'],
            ['name' => 'Kepala Bidang Pelatihan, Produktifitas dan Lembaga Pelatihan Kerja', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Disnakertrans'],
            ['name' => 'Kepala Bidang Transmigrasi', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Disnakertrans'],

            // DP2KBP3A
            ['name' => 'Kepala Bidang Pengendalian Penduduk', 'only_for' => 4, 'rank' => 3, 'office_id' => 'DP2KBP3A'],
            ['name' => 'Kepala Bidang Keluarga Berencana dan Keluarga Sejahtera', 'only_for' => 4, 'rank' => 3, 'office_id' => 'DP2KBP3A'],
            ['name' => 'Kepala Bidang Pemberdayaan dan Perlindungan Perempuan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'DP2KBP3A'],
            ['name' => 'Kepala Bidang Perlindungan Anak', 'only_for' => 4, 'rank' => 3, 'office_id' => 'DP2KBP3A'],

            // DKP
            ['name' => 'Kepala Bidang Ketersediaan Pangan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'DKP'],
            ['name' => 'Kepala Bidang Distribusi Pangan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'DKP'],
            ['name' => 'Kepala Bidang Konsumsi dan Keamanan Pangan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'DKP'],

            // Disdukcapil
            ['name' => 'Kepala Bidang Pelayanan Pendaftaran Penduduk', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Disdukcapil'],
            ['name' => 'Kepala Bidang Pelayanan Pencatatan Sipil', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Disdukcapil'],
            ['name' => 'Kepala Bidang Pengelolaan Informasi Administrasi Kependudukan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Disdukcapil'],
            ['name' => 'Kepala Bidang Pemanfaatan Data dan Inovasi Pelayanan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Disdukcapil'],

            // Dinas PPKUKM
            ['name' => 'Kepala Bidang Perdagangan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dinas PPKUKM'],
            ['name' => 'Kepala Bidang Perindustrian', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dinas PPKUKM'],
            ['name' => 'Kepala Bidang Koperasi', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dinas PPKUKM'],
            ['name' => 'Kepala Bidang Usaha Mikro dan Menengah', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dinas PPKUKM'],

            // DPMPTSP
            // ['name' => 'Kepala Bidang ', 'only_for' => 4, 'rank' => 3, 'office_id' => 'DPMPTSP'],
            // ['name' => 'Kepala Bidang ', 'only_for' => 4, 'rank' => 3, 'office_id' => 'DPMPTSP'],
            // ['name' => 'Kepala Bidang ', 'only_for' => 4, 'rank' => 3, 'office_id' => 'DPMPTSP'],

            // Dispusip
            ['name' => 'Kepala Bidang Pengembangan Koleksi, Konservasi dan Pengolahan Bahan Perpustakaan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dispusip'],
            ['name' => 'Kepala Bidang Layanan Alih Media dan Otomasi Perpustakaan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dispusip'],
            ['name' => 'Kepala Bidang Pengelolaan dan Layanan Arsip', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dispusip'],
            ['name' => 'Kepala Bidang Pembinaan Perpustakaan dan Kearsipan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dispusip'],

            // Diskan
            ['name' => 'Kepala Bidang Pemberdayaan Nelayan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Diskan'],
            ['name' => 'Kepala Bidang Pengelolaan Tempat Pendaratan Ikan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Diskan'],
            ['name' => 'Kepala Bidang Pemberdayaan dan Pengelolaan Perikanan Budidaya', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Diskan'],
            ['name' => 'Kepala Bidang Daya Saing Produk Perikanan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Diskan'],

            // Disparbudekraf
            ['name' => 'Kepala Bidang Destinasi Wisata', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Disparbudekraf'],
            ['name' => 'Kepala Bidang Usaha dan Pemasaran Pariwisata', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Disparbudekraf'],
            ['name' => 'Kepala Bidang Kebudayaan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Disparbudekraf'],
            ['name' => 'Kepala Bidang Ekonomi Kreatif dan Peningkatan Kapasitas SDM', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Disparbudekraf'],

            // Dispertan
            ['name' => 'Kepala Bidang Tanaman Pangan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dispertan'],
            ['name' => 'Kepala Bidang Hortikultura', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dispertan'],
            ['name' => 'Kepala Bidang Perkebunan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dispertan'],
            ['name' => 'Kepala Bidang Peternakan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dispertan'],
            ['name' => 'Kepala Bidang Kesehatan Hewan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dispertan'],
            ['name' => 'Kepala Bidang Prasaranan dan Penyuluhan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Dispertan'],

            ['name' => 'Kepala Badan', 'only_for' => 4, 'rank' => 1, 'office_id' => null],
            ['name' => 'Sekretaris Badan', 'only_for' => 4, 'rank' => 2, 'office_id' => null],

            // BPKAD
            ['name' => 'Kepala Bidang Anggaran', 'only_for' => 4, 'rank' => 3, 'office_id' => 'BPKAD'],
            ['name' => 'Kepala Bidang Akuntansi', 'only_for' => 4, 'rank' => 3, 'office_id' => 'BPKAD'],
            ['name' => 'Kepala Bidang Aset Daerah', 'only_for' => 4, 'rank' => 3, 'office_id' => 'BPKAD'],
            ['name' => 'Kepala Bidang Perbendaharaan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'BPKAD'],

            // BKPSDM
            ['name' => 'Kepala Bidang Pengadaan, Mutasi, Promosi, Pemberhentian dan Informasi', 'only_for' => 4, 'rank' => 3, 'office_id' => 'BKPSDM'],
            ['name' => 'Kepala Bidang Diklat dan Pengembangan Kompetensi Aparatur', 'only_for' => 4, 'rank' => 3, 'office_id' => 'BKPSDM'],
            ['name' => 'Kepala Bidang Penilaian Kinerja Aparatur dan Penghargaan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'BKPSDM'],
            ['name' => 'Kepala Bidang Perbendaharaan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'BKPSDM'],

            // BPPRID
            ['name' => 'Kepala Bidang Perencanaan, Pengendalian dan Evaluasi', 'only_for' => 4, 'rank' => 3, 'office_id' => 'BPPRID'],
            ['name' => 'Kepala Bidang Pemerintahan dan Pembangunan Manusia', 'only_for' => 4, 'rank' => 3, 'office_id' => 'BPPRID'],
            ['name' => 'Kepala Bidang Perekonomian, SDA, Infrastruktur dan Kewilayahan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'BPPRID'],
            ['name' => 'Kepala Bidang Riset dan Inovasi Daerah', 'only_for' => 4, 'rank' => 3, 'office_id' => 'BPPRID'],

            // Bapenda
            ['name' => 'Kepala Bidang Pendataan dan Pelayanan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Bapenda'],
            ['name' => 'Kepala Bidang Penetapan dan Pengolahan Data', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Bapenda'],
            ['name' => 'Kepala Bidang Penagihan dan Pengendalian', 'only_for' => 4, 'rank' => 3, 'office_id' => 'Bapenda'],

            // BPBD
            ['name' => 'Kepala Bidang Pencegahan, Kesiapsiagaan dan Pemadam Kebakaran', 'only_for' => 4, 'rank' => 3, 'office_id' => 'BPBD'],
            ['name' => 'Kepala Bidang Kedaruratan dan logistik', 'only_for' => 4, 'rank' => 3, 'office_id' => 'BPBD'],
            ['name' => 'Kepala Bidang Rehabilitasi dan Rekonstruksi', 'only_for' => 4, 'rank' => 3, 'office_id' => 'BPBD'],

            // BKBP
            ['name' => 'Kepala Bidang Bina Ideologi, Wawasan Kebangsaan dan Karakter Bangsa', 'only_for' => 4, 'rank' => 3, 'office_id' => 'BKBP'],
            ['name' => 'Kepala Bidang Politik dalam Negeri, Ketahanan Ekonomi, Sosial Budaya dan Organisasi Kemasyarakatan', 'only_for' => 4, 'rank' => 3, 'office_id' => 'BKBP'],
            ['name' => 'Kepala Bidang Penanganan Konflik dan Kewaspadaan Nasional', 'only_for' => 4, 'rank' => 3, 'office_id' => 'BKBP'],

            ['name' => 'Camat', 'only_for' => 5, 'rank' => 1, 'office_id' => null],
            ['name' => 'Sekretaris Kecamatan', 'only_for' => 5, 'rank' => 2, 'office_id' => null],

            ['name' => 'Kepala Desa', 'only_for' => 6, 'rank' => 1, 'office_id' => null],
            ['name' => 'Sekretaris Desa', 'only_for' => 6, 'rank' => 2, 'office_id' => null],

            ['name' => 'Lurah', 'only_for' => 7, 'rank' => 1, 'office_id' => null],
            ['name' => 'Sekretaris Kelurahan', 'only_for' => 7, 'rank' => 2, 'office_id' => null],
        ])->each(function ($position) {
            $p = Position::firstOrCreate(
                [
                    'name' => $position['name'],
                ],
                [
                    'only_for' => $position['only_for'],
                    'rank' => $position['rank'],
                    'office_id' => $position['office_id'] ? $this->getOfficeUuidByAliasName($position['office_id']) : null,

                ]
            );

            $this->command->info("\tPosition: {$p->name} (was " . ($p->wasRecentlyCreated ? 'created' : 'existing') . ')');
        });
    }
}
