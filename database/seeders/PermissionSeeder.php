<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // set models
        $roleModel = app(config('permission.models.role'));
        $permissionModel = app(config('permission.models.permission'));

        // create main role
        $roleModel::firstOrCreate(['name' => config('permission.superior_role_name')], []);

        // create permissions
        collect([
            [
                "name" => "Akun Pengguna",
                "children" => [
                    ["name" => "read users", "label" => "Dapat melihat daftar Akun Pengguna."],
                    ["name" => "create users", "label" => "Dapat membuat Akun Pengguna."],
                    ["name" => "update users", "label" => "Dapat memperbarui data pada Akun Pengguna."],
                    ["name" => "delete users", "label" => "Dapat menghapus Akun Pengguna."],
                    ["name" => "reset password users", "label" => "Dapat mereset kata sandi Akun Pengguna."],
                    ["name" => "deactivate users", "label" => "Dapat mengaktifkan/menonaktifkan Akun Pengguna."],
                ]
            ],
            [
                "name" => "Perangkat Daerah",
                "children" => [
                    ["name" => "read offices", "label" => "Dapat melihat daftar Perangkat Daerah."],
                    ["name" => "create offices", "label" => "Dapat membuat Perangkat Daerah."],
                    ["name" => "update offices", "label" => "Dapat memperbarui data pada Perangkat Daerah."],
                    ["name" => "delete offices", "label" => "Dapat menghapus Perangkat Daerah."],
                ]
            ],
        ])->each(function ($permission) use ($permissionModel) {
            $groupName = $permission['name'];

            collect($permission['children'])
                ->each(function ($child) use ($groupName, $permissionModel) {
                    $p = $permissionModel::firstOrCreate(
                        [
                            'name' => $child['name'],
                        ],
                        [
                            'group_name' => $groupName,
                            'label' => $child['label'],
                        ]
                    );

                    $this->command->info("Permission '{$child['name']}'" . ($p->wasRecentlyCreated ? " created." : " exists."));
                });
        });
    }
}
