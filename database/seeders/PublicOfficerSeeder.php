<?php

namespace Database\Seeders;

use App\Enums\EducationLevelEnum;
use App\Enums\MaritalStatusEnum;
use App\Enums\ReligionEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class PublicOfficerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        collect([[
            'fullname' => 'Vera Elena Laruni, SE',
            'birth_place' => 'Donggala',
            'birth_date' => from_format('29-08-1968'),
            'last_education' => EducationLevelEnum::S1,
            'gender' => 0,
            'religion' => ReligionEnum::CATHOLIC,
            'marital_status' => MaritalStatusEnum::MARRIED,
            'position_id' => 1,
            'office_id' => 1,
            'period_start' => from_format('20-02-2025'),
            'period_end' => null,
            'is_active' => true,
            'photo' => null,

        ]])->each(function ($officer) {
            $record = \App\Models\Profile\PublicOfficer::firstOrCreate([
                'fullname' => $officer['fullname']
            ], Arr::except($officer, ['fullname']));

            dd($record);
        });
    }
}
