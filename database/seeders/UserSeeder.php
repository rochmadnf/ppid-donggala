<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $s = \App\Models\User::firstOrCreate([
            'username' => 'superadmin',
        ], [
            'email' => 'rochmadnf@donggala.go.id',
            'password' => 'P4$$w0rd',
        ]);

        $s->assignRole(config('permission.superior_role_name'));
    }
}
