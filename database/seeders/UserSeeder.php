<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $s = \App\Models\User::create([
            'username' => 'superadmin',
            'email' => 'rochmadnf@donggala.go.id',
            'password' => 'P4$$w0rd',
        ]);

        $s->assignRole(config('permission.superior_role_name'));
    }
}
