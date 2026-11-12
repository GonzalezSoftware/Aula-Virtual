<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin_oculto'],
            [
                'name' => 'Administrador General',
                'password' => Hash::make('admin_oculto123'),
                'email_verified_at' => now(),
            ]
        );
    }
}